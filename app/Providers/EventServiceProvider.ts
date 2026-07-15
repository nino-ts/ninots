import type { Application } from "@ninots/framework";
import { EVENT_DISPATCHER_KEY, ServiceProvider, SYNC_BUS_KEY } from "@ninots/framework";
import type { EventDispatcher, SyncBus } from "@ninots/framework";
import { UserCreatedEvent } from "@/app/Events/UserCreatedEvent";
import { SendWelcomeEmailListener } from "@/app/Listeners/SendWelcomeEmailListener";

/**
 * Registers domain event listeners.
 */
export class EventServiceProvider extends ServiceProvider {
    constructor(app: Application) {
        super(app.container);
    }

    public register(): void {
        const dispatcher = this.app.make<EventDispatcher>(EVENT_DISPATCHER_KEY);
        const bus = this.app.make<SyncBus>(SYNC_BUS_KEY);
        const listener = new SendWelcomeEmailListener(bus);

        dispatcher.listen(UserCreatedEvent, listener);
    }
}
