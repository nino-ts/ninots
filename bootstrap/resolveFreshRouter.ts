import { ROUTER_KEY } from "@ninots/framework";
import type { Router } from "@ninots/framework";
import { bootstrap } from "@/bootstrap/app";

/**
 * Boot a disposable Application and return its Router.
 *
 * Used by `routes:compile` and the serve auto-hook so registry emit never
 * reads the long-lived serve app's in-memory Router (stale after route edits).
 */
export async function resolveFreshRouter(): Promise<Router> {
    const app = await bootstrap();
    return app.make<Router>(ROUTER_KEY);
}
