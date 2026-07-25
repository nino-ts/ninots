import { describe, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { bootstrap, createAppServeOptions } from "@/bootstrap/app";

const starterRoot = join(import.meta.dir, "../..");

describe("Bun fullstack HMR demo (/hmr-demo)", () => {
    test("createAppServeOptions enables development + dedicated HTML route", async () => {
        const app = await bootstrap();
        const options = createAppServeOptions(app);

        expect(options.development).toBe(app.getConfig().development);
        expect(options.routes).toBeDefined();
        expect(options.routes?.["/hmr-demo"]).toBeDefined();
    });

    test("HTML demo coexists with typed Router fetch", async () => {
        const app = await bootstrap();
        const options = createAppServeOptions(app);
        options.port = 0;
        options.hostname = "127.0.0.1";

        const server = Bun.serve(options);
        try {
            const home = await fetch(`http://127.0.0.1:${server.port}/`);
            expect(home.status).toBe(200);

            const demo = await fetch(`http://127.0.0.1:${server.port}/hmr-demo`);
            expect(demo.status).toBe(200);
            const body = await demo.text();
            expect(body).toContain("hmr-label");
            expect(body).toContain("Ninots");
            expect(body.toLowerCase()).toContain("<!doctype html>");
        } finally {
            server.stop(true);
        }
    });

    test("ServeCommand still wires compileArtifact spawn (no #47 regression)", async () => {
        const cli = await readFile(join(starterRoot, "bootstrap/cli.ts"), "utf8");
        const callStart = cli.indexOf("startRoutesAutoHook({");
        expect(callStart).toBeGreaterThan(-1);

        const hookBlock = cli.slice(callStart, cli.indexOf("}).catch", callStart));

        expect(hookBlock).toContain("compileArtifact:");
        expect(hookBlock).toContain('Bun.spawn(["bun", "./nino", "routes:compile"]');
        expect(hookBlock).toContain("resolveRouter: resolveFreshRouter");
    });
});
