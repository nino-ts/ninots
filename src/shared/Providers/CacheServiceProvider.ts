import type { Application } from "@ninots/framework";
import { ServiceProvider } from "@ninots/framework";

/**
 * Cache service provider.
 *
 * Registers cache services.
 */
export class CacheServiceProvider extends ServiceProvider {
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
        // TODO: Register cache services (Sprint 2+)
    }

    /**
     * Boot services.
     */
    public boot(): void {
        // TODO: Boot cache services
    }
}
