import type { Application } from "@ninots/framework";
import { ROUTER_KEY, ServiceProvider } from "@ninots/framework";
import type { Router } from "@ninots/framework";

/**
 * Route service provider.
 *
 * Registers HTTP routes on the application router.
 */
export class RouteServiceProvider extends ServiceProvider {
    /**
     * @param app - Application instance
     */
    constructor(app: Application) {
        super(app.container);
    }

    /**
     * Register services.
     */
    public register(): void {
        // Routes are registered during boot once the router is available.
    }

    /**
     * Boot services — register application routes.
     */
    public boot(): void {
        const router = this.app.make<Router>(ROUTER_KEY);

        router.get("/health", () =>
            Response.json({
                service: "ninots",
                status: "ok",
            }),
        );

        router.group({ prefix: "/api" }, () => {
            router.get("/users", () =>
                Response.json({
                    data: [],
                    message: "Users module wired — connect persistence in Sprint 2",
                }),
            );
        });
    }
}
