import type { Application } from '@ninots/foundation';
import { AppServiceProvider } from '@/shared/Providers/AppServiceProvider';
import { AuthServiceProvider } from '@/shared/Providers/AuthServiceProvider';
import { CacheServiceProvider } from '@/shared/Providers/CacheServiceProvider';
import { RouteServiceProvider } from '@/shared/Providers/RouteServiceProvider';

/**
 * Register all service providers with the application.
 *
 * @param app - The Application instance
 */
export async function registerProviders(app: Application): Promise<void> {
    const providers = [
        AppServiceProvider,
        AuthServiceProvider,
        CacheServiceProvider,
        RouteServiceProvider,
    ];

    for (const Provider of providers) {
        app.register(new Provider(app));
    }
}
