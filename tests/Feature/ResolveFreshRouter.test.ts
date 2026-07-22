import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ROUTER_KEY, Route } from "@ninots/framework";
import type { Router } from "@ninots/framework";
import { bootstrap } from "@/bootstrap/app";
import { resolveFreshRouter } from "@/bootstrap/resolveFreshRouter";

const starterRoot = join(import.meta.dir, "../..");

function namedRouteNames(router: Router): string[] {
    const names: string[] = [];
    for (const route of router.getRoutes()) {
        const name: string | undefined = route.getName();
        if (name !== undefined) {
            names.push(name);
        }
    }
    return names.toSorted((left: string, right: string) => left.localeCompare(right));
}

describe("resolveFreshRouter (isolated bootstrap)", () => {
    test("returns a distinct Router instance from a discarded bootstrap", async () => {
        const first = await resolveFreshRouter();
        const second = await resolveFreshRouter();

        expect(first).not.toBe(second);
        expect(namedRouteNames(first)).toEqual(namedRouteNames(second));
        expect(namedRouteNames(first)).toContain("home");
        expect(namedRouteNames(first)).toContain("users.show");
        expect(first.getRoutes()[0]).toBeInstanceOf(Route);
    });

    test("closed-over serve app.make stays the same instance (stale pattern)", async () => {
        const app = await bootstrap();
        const closedOver = (): Router => app.make<Router>(ROUTER_KEY);

        expect(closedOver()).toBe(closedOver());
        expect(closedOver()).not.toBe(await resolveFreshRouter());
    });

    test("ServeCommand auto-hook wires resolveFreshRouter, not closed-over app.make", async () => {
        const cli = await readFile(join(starterRoot, "bootstrap/cli.ts"), "utf8");
        const callStart = cli.indexOf("startRoutesAutoHook({");
        expect(callStart).toBeGreaterThan(-1);

        const hookBlock = cli.slice(callStart, cli.indexOf("}).catch", callStart));

        expect(hookBlock).toContain("resolveRouter: resolveFreshRouter");
        expect(hookBlock).not.toMatch(/resolveRouter:\s*\(\)\s*=>\s*app\.make/);
    });
});
