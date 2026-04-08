import type { Application } from '@ninots/foundation';

/**
 * Route service provider.
 *
 * Registers route services.
 */
export class RouteServiceProvider {
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
        // TODO: Register route services
    }

    /**
     * Boot services.
     */
    public boot(): void {
        // TODO: Boot route services
    }
}
