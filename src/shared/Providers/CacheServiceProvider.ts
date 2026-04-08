import type { Application } from '@ninots/foundation';

/**
 * Cache service provider.
 *
 * Registers cache services.
 */
export class CacheServiceProvider {
    /**
     * Create a new service provider instance.
     *
     * @param app - The application instance
     */
    constructor(private app: Application) {}

    /**
     * Register services.
     */
    public register(): void {
        // TODO: Register cache services
    }

    /**
     * Boot services.
     */
    public boot(): void {
        // TODO: Boot cache services
    }
}
