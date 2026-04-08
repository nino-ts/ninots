import type { Application } from '@ninots/foundation';

/**
 * Auth service provider.
 *
 * Registers authentication services.
 */
export class AuthServiceProvider {
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
        // TODO: Register auth services
    }

    /**
     * Boot services.
     */
    public boot(): void {
        // TODO: Boot auth services
    }
}
