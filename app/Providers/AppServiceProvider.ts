import { AuthManager } from "@ninots/auth";
import type { Application } from "@ninots/foundation";
import { EVENT_DISPATCHER_KEY, MIDDLEWARE_STACK_KEY } from "@ninots/foundation";
import { ServiceProvider } from "@ninots/container";
import type { EventDispatcher } from "@ninots/events";
import { createWideEvent, runWithContext } from "@ninots/logger";
import { verifyCsrf, wideEventMiddleware, type MiddlewareStack } from "@ninots/middleware";
import { mkdirSync } from "node:fs";
import { UsersController } from "@/app/Http/Controllers/UsersController";
import {
    AUTH_MANAGER_KEY,
    createSessionManager,
    SESSION_MANAGER_KEY,
} from "@/app/Session/createSessionServices";
import { UserService } from "@/app/Services/UserService";
import authConfig from "@/config/auth";
import csrfConfig from "@/config/csrf";
import sessionConfig from "@/config/session";

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

        if (sessionConfig.driver === "file") {
            mkdirSync(sessionConfig.files, { recursive: true });
        }

        this.app.singleton(SESSION_MANAGER_KEY, () => createSessionManager());
        this.app.singleton(
            AUTH_MANAGER_KEY,
            () => new AuthManager({ default: authConfig.defaults.guard }),
        );
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
