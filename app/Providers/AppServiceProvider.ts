import type { Application } from "@ninots/foundation";
import { EVENT_DISPATCHER_KEY, MIDDLEWARE_STACK_KEY } from "@ninots/foundation";
import { ServiceProvider } from "@ninots/container";
import type { EventDispatcher } from "@ninots/events";
import { createWideEvent, runWithContext } from "@ninots/logger";
import { verifyCsrf, wideEventMiddleware, type MiddlewareStack } from "@ninots/middleware";
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
        stack.add(
            "wideEvent",
            wideEventMiddleware({
                createWideEvent,
                runWithContext,
            }),
        );
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
