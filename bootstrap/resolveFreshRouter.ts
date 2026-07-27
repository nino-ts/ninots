import { ROUTER_KEY } from "@ninots/foundation";
import type { Router } from "@ninots/routing";
import { bootstrap } from "@/bootstrap/app";

/**
 * Boot a disposable Application and return its Router.
 *
 * Used by `routes:compile` and `routes:list` so registry emit / listing never
 * reads the long-lived serve app's in-memory Router (stale after route edits).
 * Serve auto-hook debounce prefers a cold `routes:compile` subprocess (Fixes #47)
 * while still passing this resolver for the hook option contract (Fixes #45).
 */
export async function resolveFreshRouter(): Promise<Router> {
    const app = await bootstrap();
    return app.make<Router>(ROUTER_KEY);
}
