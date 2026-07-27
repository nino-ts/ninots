import type { Application } from "@ninots/foundation";
import { ROUTER_KEY } from "@ninots/foundation";
import { ServiceProvider } from "@ninots/container";
import type { Router } from "@ninots/routing";
import { registerApiRoutes } from "@/routes/api";
import { registerWebRoutes } from "@/routes/web";

/**
 * Route service provider — single source of truth for HTTP routes.
 */
export class RouteServiceProvider extends ServiceProvider {
    private readonly application: Application;

    constructor(app: Application) {
        super(app.container);
        this.application = app;
    }

    public override register(): void {
        // Routes are registered during boot once the router is available.
    }

    public override boot(): void {
        const router = this.app.make<Router>(ROUTER_KEY);

        router.get("/health", () =>
            Response.json({
                service: "ninots",
                status: "ok",
            }),
        );

        registerWebRoutes(router);
        registerApiRoutes(router, this.application);
    }
}
