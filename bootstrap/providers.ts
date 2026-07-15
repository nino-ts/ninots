import type { Application } from "@ninots/framework";
import { AppServiceProvider } from "@/app/Providers/AppServiceProvider";
import { EventServiceProvider } from "@/app/Providers/EventServiceProvider";
import { RouteServiceProvider } from "@/app/Providers/RouteServiceProvider";

/**
 * Register all service providers with the application.
 */
export async function registerProviders(app: Application): Promise<void> {
    const providers = [AppServiceProvider, EventServiceProvider, RouteServiceProvider];

    for (const Provider of providers) {
        app.register(new Provider(app));
    }
}
