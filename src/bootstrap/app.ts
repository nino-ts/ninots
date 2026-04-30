import type { Serve } from 'bun';
import { Application } from '@ninots/foundation';
import { Container } from '@ninots/container';
import { registerProviders } from './providers';

/**
 * Bootstrap the application.
 *
 * @returns The configured Application instance
 */
export async function bootstrap(): Promise<Application> {
    const container = new Container();
    const app = new Application({}, container);

    // Register service providers
    await registerProviders(app);

    // Boot all providers
    await app.boot();

    return app;
}

/**
 * Create the Bun.serve options from the application.
 *
 * @param app - The Application instance
 * @returns Bun.serve configuration object
 */
export function createServeOptions(app: Application): Serve.Options<undefined> {
    const config = app.getConfig();

    return {
        port: config.port,
        hostname: config.hostname,

        // Fallback fetch handler
        async fetch(req: Request): Promise<Response> {
            return new Response('Not Found', { status: 404 });
        },

        // Error handler
        error(error: Error): Response {
            console.error(error);
            return new Response('Internal Server Error', { status: 500 });
        },

        // Idle timeout (default 10s)
        idleTimeout: 30,
    };
}
