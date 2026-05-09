import type { LayoutConfig } from "@ninots/routing";
import { authWS } from "@/shared/Http/Middleware/AuthWSMiddleware";

/**
 * WebSocket layout configuration.
 * Applied to all routes under (ws)/
 */
export const layout: LayoutConfig = {
    middleware: [authWS],
    prefix: "/ws",
};
