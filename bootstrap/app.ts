import { Application, createServeOptions, wireCoreServices } from "@ninots/foundation";
import type { WireCoreServicesDeps } from "@ninots/foundation";
import { Container } from "@ninots/container";
import { EventDispatcher, SyncBus } from "@ninots/events";
import { MiddlewareStack, Pipeline } from "@ninots/middleware";
import { Router, setRouteResolver } from "@ninots/routing";
import type { Serve } from "bun";
import appConfig from "@/config/app";
import hmrDemoPage from "@/resources/hmr-demo/hmr-demo.html";
import { getDatabaseManager } from "./database";
import { registerProviders } from "./providers";

type AppServeOptions = Serve.Options<undefined> & { unix?: undefined };

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

    const deps: WireCoreServicesDeps = {
        router: new Router(),
        middlewareStack: new MiddlewareStack(),
        eventDispatcher: new EventDispatcher(),
        syncBus: new SyncBus("sync"),
        setRouteResolver: (router) => {
            setRouteResolver(router as Parameters<typeof setRouteResolver>[0]);
        },
        createPipeline: () => Pipeline.create() as ReturnType<WireCoreServicesDeps["createPipeline"]>,
    };
    wireCoreServices(app, deps);
    getDatabaseManager();
    await registerProviders(app);
    await app.boot();

    return app;
}

/**
 * Create Bun.serve options from a booted application.
 *
 * Enables Bun fullstack `development` HMR and a dedicated HTML-import demo at
 * `/hmr-demo`. The typed Router remains the source of truth for named routes;
 * HTML routes are additive and do not regenerate `RouteRegistry`.
 *
 * @param app - Booted application instance
 * @returns Bun.serve configuration
 */
export function createAppServeOptions(app: Application): AppServeOptions {
    const options = createServeOptions(app, {
        error(_error: Error): Response {
            return new Response("Internal Server Error", { status: 500 });
        },
        idleTimeout: 30,
    }) as AppServeOptions;

    options.development = app.getConfig().development;
    options.routes = {
        "/hmr-demo": hmrDemoPage,
    };

    return options;
}
