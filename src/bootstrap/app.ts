import { Application, Container, createServeOptions, wireCoreServices } from "@ninots/framework";
import type { Serve } from "bun";
import appConfig from "@/config/app";
import { registerProviders } from "./providers";

export { createServeOptions };

/**
 * Bootstrap the application.
 *
 * @returns The configured Application instance
 */
export async function bootstrap(): Promise<Application> {
    const container = new Container();
    const app = new Application(
        {
            development: appConfig.debug,
            hostname: appConfig.hostname,
            port: appConfig.port,
        },
        container,
    );

    wireCoreServices(app);
    await registerProviders(app);
    await app.boot();

    return app;
}

/**
 * Create Bun.serve options from a booted application.
 *
 * @param app - Booted application instance
 * @returns Bun.serve configuration
 */
export function createAppServeOptions(app: Application): Serve.Options<undefined> {
    return createServeOptions(app, {
        error(_error: Error): Response {
            return new Response("Internal Server Error", { status: 500 });
        },
        idleTimeout: 30,
    });
}
