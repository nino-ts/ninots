import type { LayoutConfig } from "@ninots/routing";

/**
 * Web layout configuration.
 * Applied to all routes under web/
 */
export const layout: LayoutConfig = {
    middleware: [],
    prefix: "users/",
};
