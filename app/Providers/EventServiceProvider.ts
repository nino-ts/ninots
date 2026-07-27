import type { Application } from "@ninots/foundation";
import { EVENT_DISPATCHER_KEY, SYNC_BUS_KEY } from "@ninots/foundation";
import { ServiceProvider } from "@ninots/container";
import type { EventDispatcher, SyncBus } from "@ninots/events";
import { UserCreatedEvent } from "@/app/Events/UserCreatedEvent";
import { SendWelcomeEmailListener } from "@/app/Listeners/SendWelcomeEmailListener";

/**
 * Registers domain event listeners.
 */
export class EventServiceProvider extends ServiceProvider {
    constructor(app: Application) {
        super(app.container);
    }

    public override register(): void {
        const dispatcher = this.app.make<EventDispatcher>(EVENT_DISPATCHER_KEY);
        const bus = this.app.make<SyncBus>(SYNC_BUS_KEY);
        const listener = new SendWelcomeEmailListener(bus);

        dispatcher.listen(UserCreatedEvent, listener);
    }
}
