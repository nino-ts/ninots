import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { existsSync } from "node:fs";
import {
    Kernel,
    MakeControllerCommand,
    Router,
    ROUTER_KEY,
} from "@ninots/framework";
import { bootstrap, createAppServeOptions } from "@/bootstrap/app";

const SESSION_COOKIE = "ninots_session";

async function createGeneratorWorkspace(): Promise<string> {
    const root = await mkdtemp(join(tmpdir(), "ninots-starter-generator-"));

    await mkdir(join(root, "app/Http/Controllers"), { recursive: true });
    await mkdir(join(root, "resources/views"), { recursive: true });
    await mkdir(join(root, "routes"), { recursive: true });

    await writeFile(
        join(root, "routes/web.ts"),
        `import type { Router } from "@ninots/framework";

// -- nino:web-imports --

export function registerWebRoutes(router: Router): void {
    router.group({ middleware: ["web"] }, () => {
        // -- nino:web-bindings --
        // -- nino:web-routes --
    });
}
`,
    );

    return root;
}

describe("nino make:* generators", () => {
    let root = "";

    beforeEach(async () => {
        root = await createGeneratorWorkspace();
    });

    afterEach(async () => {
        await rm(root, { force: true, recursive: true });
    });

    test("kernel exposes make:controller command", async () => {
        const kernel = new Kernel();
        kernel.register(new MakeControllerCommand({ paths: { basePath: root } }));

        const command = kernel.findCommand("make:controller");
        expect(command).toBeDefined();
        expect(command?.getDefinition().description).toContain("controller");
    });

    test("make:controller --resource generates controller and web POST route", async () => {
        const kernel = new Kernel();
        kernel.register(new MakeControllerCommand({ paths: { basePath: root } }));

        const exitCode = await kernel.run(["make:controller", "ArticleController", "--resource"]);

        expect(exitCode).toBe(0);
        expect(existsSync(join(root, "app/Http/Controllers/ArticleController.ts"))).toBe(true);
        expect(existsSync(join(root, "resources/views/articles.tsx"))).toBe(true);

        const routes = await readFile(join(root, "routes/web.ts"), "utf8");
        expect(routes).toContain('router.post("/articles"');
        expect(routes).toContain('middleware: ["web"]');

        const importLine = routes
            .split("\n")
            .find((line) => line.includes("ArticleController") && line.trimStart().startsWith("import "));
        expect(importLine?.startsWith("import ")).toBe(true);
        expect(routes.indexOf("import { ArticleController }")).toBeLessThan(
            routes.indexOf("export function registerWebRoutes"),
        );
    });

    test("make:controller --resource keeps import top-level with legacy indented marker", async () => {
        await writeFile(
            join(root, "routes/web.ts"),
            `import type { Router } from "@ninots/framework";

export function registerWebRoutes(router: Router): void {
    // -- nino:web-imports --
    router.group({ middleware: ["web"] }, () => {
        // -- nino:web-bindings --
        // -- nino:web-routes --
    });
}
`,
        );

        const kernel = new Kernel();
        kernel.register(new MakeControllerCommand({ paths: { basePath: root } }));

        const exitCode = await kernel.run(["make:controller", "LegacyController", "--resource"]);

        expect(exitCode).toBe(0);

        const routes = await readFile(join(root, "routes/web.ts"), "utf8");
        const importLine = routes
            .split("\n")
            .find((line) => line.includes("LegacyController") && line.trimStart().startsWith("import "));

        expect(importLine?.startsWith("import ")).toBe(true);
        expect(routes.indexOf("import { LegacyController }")).toBeLessThan(
            routes.indexOf("export function registerWebRoutes"),
        );
    });

    test("resource-style web POST routes are CSRF-protected", async () => {
        const app = await bootstrap();
        const router = app.make<Router>(ROUTER_KEY);

        router.group({ middleware: ["web"] }, () => {
            router.post("/generated-resource", () => Response.json({ created: true }));
        });

        const server = Bun.serve({
            ...createAppServeOptions(app),
            port: 0,
            hostname: "127.0.0.1",
        });

        try {
            const response = await fetch(`http://127.0.0.1:${server.port}/generated-resource`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Cookie: `${SESSION_COOKIE}=generator-session`,
                },
                body: "title=test",
            });

            expect(response.status).toBe(419);
        } finally {
            server.stop();
        }
    });

    test("starter CLI help lists make:* commands", async () => {
        const { spawnSync } = await import("node:child_process");
        const result = spawnSync("bun", ["./nino", "help"], {
            cwd: join(import.meta.dir, "../.."),
            encoding: "utf8",
        });

        expect(result.status).toBe(0);
        expect(result.stdout).toContain("make:controller");
        expect(result.stdout).toContain("make:model");
        expect(result.stdout).toContain("make:migration");
        expect(result.stdout).toContain("make:view");
        expect(result.stdout).toContain("make:module");
    });
});

describe("starter web routes", () => {
    test("GET / still renders after route marker changes", async () => {
        const app = await bootstrap();
        const server = Bun.serve({
            ...createAppServeOptions(app),
            port: 0,
            hostname: "127.0.0.1",
        });

        try {
            const response = await fetch(`http://127.0.0.1:${server.port}/`);
            expect(response.status).toBe(200);
        } finally {
            server.stop();
        }
    });
});
