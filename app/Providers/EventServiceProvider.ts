import type { Application } from "@ninots/foundation";
import { EVENT_DISPATCHER_KEY } from "@ninots/foundation";
import { ServiceProvider } from "@ninots/container";
import type { EventDispatcher } from "@ninots/events";
import type { QueueManager } from "@ninots/queue";
import { UserCreatedEvent } from "@/app/Events/UserCreatedEvent";
import { SendWelcomeEmailListener } from "@/app/Listeners/SendWelcomeEmailListener";
import { QUEUE_MANAGER_KEY } from "@/app/Queue/createQueueServices";

/**
 * Registers domain event listeners.
 */
export class EventServiceProvider extends ServiceProvider {
    constructor(app: Application) {
        super(app.container);
    }

    public override register(): void {
        const dispatcher = this.app.make<EventDispatcher>(EVENT_DISPATCHER_KEY);
        const queue = this.app.make<QueueManager>(QUEUE_MANAGER_KEY);
        const listener = new SendWelcomeEmailListener(queue);

        dispatcher.listen(UserCreatedEvent, listener);
    }
}
