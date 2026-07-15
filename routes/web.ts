import { render } from "@ninots/view";
import type { Router } from "@ninots/framework";
import { Welcome } from "@/resources/views/welcome.tsx";

/**
 * Web routes (HTML pages rendered via @ninots/view).
 */
export function registerWebRoutes(router: Router): void {
    router.get("/", () =>
        render(Welcome, {
            subtitle: "Laravel-like DX on Bun.",
        }),
    );
}
