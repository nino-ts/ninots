import type { Application } from '@ninots/foundation';

/**
 * Application service provider.
 *
 * Registers core application services.
 */
export class AppServiceProvider {
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
        // TODO: Register core services
    }

    /**
     * Boot services.
     */
    public boot(): void {
        // TODO: Boot core services
    }
}
