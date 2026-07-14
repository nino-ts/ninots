import type { LayoutConfig } from "@ninots/routing";
import { CorsMiddleware } from "@/shared/Http/Middleware/CorsMiddleware";

/**
 * API layout configuration.
 * Applied to all routes under (api)/
 */
export const layout: LayoutConfig = {
    middleware: [CorsMiddleware],
    prefix: "/api",
};
