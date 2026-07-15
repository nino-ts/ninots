import type { Router } from "@ninots/framework";

/**
 * Web routes (HTML pages, future views).
 */
export function registerWebRoutes(router: Router): void {
    router.get("/", () => new Response("Ninots — Laravel-like starter on Bun", { status: 200 }));
}
