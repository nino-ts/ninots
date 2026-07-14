import type { Application } from "@ninots/framework";
import { ServiceProvider } from "@ninots/framework";

/**
 * Auth service provider.
 *
 * Registers authentication services.
 */
export class AuthServiceProvider extends ServiceProvider {
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
        // TODO: Register auth services (Sprint 2+)
    }

    /**
     * Boot services.
     */
    public boot(): void {
        // TODO: Boot auth services
    }
}
