import type { Application } from "@ninots/framework";
import {
    EVENT_DISPATCHER_KEY,
    MIDDLEWARE_STACK_KEY,
    ServiceProvider,
    verifyCsrf,
    wideEventMiddleware,
} from "@ninots/framework";
import type { EventDispatcher, MiddlewareStack } from "@ninots/framework";
import { UsersController } from "@/app/Http/Controllers/UsersController";
import { UserService } from "@/app/Services/UserService";
import csrfConfig from "@/config/csrf";

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

    public override boot(): void {
        const stack = this.app.make<MiddlewareStack>(MIDDLEWARE_STACK_KEY);

        // Outermost: accumulate request lifecycle → emit one canonical line in finally
        stack.add("wideEvent", wideEventMiddleware());
        stack.add(
            "csrf",
            verifyCsrf({
                secret: csrfConfig.secret,
                sessionCookieName: csrfConfig.sessionCookie,
                tokenFieldName: csrfConfig.tokenField,
            }),
        );
        stack.alias("web", ["wideEvent", "csrf"]);
    }
}
