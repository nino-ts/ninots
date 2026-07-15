import type { Application } from "@ninots/framework";
import { EVENT_DISPATCHER_KEY, ServiceProvider } from "@ninots/framework";
import type { EventDispatcher } from "@ninots/framework";
import { UsersController } from "@/app/Http/Controllers/UsersController";
import { UserService } from "@/app/Services/UserService";

/**
 * Application service provider.
 */
export class AppServiceProvider extends ServiceProvider {
    constructor(app: Application) {
        super(app.container);
    }

    public override register(): void {
        const events = this.app.make<EventDispatcher>(EVENT_DISPATCHER_KEY);

        this.app.singleton(UserService.name, () => new UserService(events));
        this.app.singleton(UsersController.name, () => new UsersController(this.app.make(UserService.name)));
    }
}
