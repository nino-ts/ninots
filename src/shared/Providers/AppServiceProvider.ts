import type { Application } from "@ninots/framework";
import { ServiceProvider } from "@ninots/framework";

/**
 * Application service provider.
 *
 * Registers core application services.
 */
export class AppServiceProvider extends ServiceProvider {
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
        // Core services are wired via wireCoreServices() during bootstrap.
    }

    /**
     * Boot services.
     */
    public boot(): void {
        // Reserved for app-level boot hooks.
    }
}
