import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Kernel, MakeModuleCommand } from "@ninots/framework";

const starterRoot = join(import.meta.dir, "../..");

async function createModuleWorkspace(): Promise<string> {
    const root = await mkdtemp(join(tmpdir(), "ninots-make-module-"));

    await mkdir(join(root, "bootstrap"), { recursive: true });
    await mkdir(join(root, "database/migrations"), { recursive: true });

    await writeFile(
        join(root, "bootstrap/providers.ts"),
        `import type { Application } from "@ninots/framework";
import { AppServiceProvider } from "@/app/Providers/AppServiceProvider";
import { RouteServiceProvider } from "@/app/Providers/RouteServiceProvider";
// -- nino:provider-imports --

export async function registerProviders(app: Application): Promise<void> {
    const providers = [
        AppServiceProvider,
        RouteServiceProvider,
        // -- nino:providers --
    ];

    for (const Provider of providers) {
        app.register(new Provider(app));
    }
}
`,
    );

    return root;
}

describe("nino make:module", () => {
    let root = "";

    beforeEach(async () => {
        root = await createModuleWorkspace();
    });

    afterEach(async () => {
        await rm(root, { force: true, recursive: true });
    });

    test("kernel exposes make:module command", () => {
        const kernel = new Kernel();
        kernel.register(new MakeModuleCommand({ paths: { basePath: root } }));

        const command = kernel.findCommand("make:module");
        expect(command).toBeDefined();
        expect(command?.getDefinition().description).toContain("module");
    });

    test("make:module creates default skeleton under app/Modules without src/", async () => {
        const kernel = new Kernel();
        kernel.register(new MakeModuleCommand({ paths: { basePath: root } }));

        const exitCode = await kernel.run(["make:module", "Billing"]);

        expect(exitCode).toBe(0);
        expect(existsSync(join(root, "app/Modules/Billing/Providers/BillingServiceProvider.ts"))).toBe(true);
        expect(existsSync(join(root, "app/Modules/Billing/routes.ts"))).toBe(true);
        expect(existsSync(join(root, "src"))).toBe(false);

        const providers = await readFile(join(root, "bootstrap/providers.ts"), "utf8");
        expect(providers).toContain("BillingServiceProvider");
        expect(providers).toContain("@/app/Modules/Billing/Providers/BillingServiceProvider");
    });

    test("make:module --all generates controller, model, and global migration", async () => {
        const kernel = new Kernel();
        kernel.register(new MakeModuleCommand({ paths: { basePath: root } }));

        const exitCode = await kernel.run(["make:module", "Catalog", "--all"]);

        expect(exitCode).toBe(0);
        expect(existsSync(join(root, "app/Modules/Catalog/Http/Controllers/CatalogController.ts"))).toBe(true);
        expect(existsSync(join(root, "app/Modules/Catalog/Models/Catalog.ts"))).toBe(true);
        expect(existsSync(join(root, "src"))).toBe(false);

        const migrationsDir = join(root, "database/migrations");
        const files = await Array.fromAsync(new Bun.Glob("*.ts").scan(migrationsDir));
        expect(files.length).toBe(1);
        expect(files[0]).toMatch(/create_catalogs_table\.ts$/);
    });

    test("starter CLI help lists make:module", () => {
        const result = spawnSync("bun", ["./nino", "help"], {
            cwd: starterRoot,
            encoding: "utf8",
        });

        expect(result.status).toBe(0);
        expect(result.stdout).toContain("make:module");
    });

    test("starter CLI make:module Demo creates files in the app tree", async () => {
        const demoRoot = join(starterRoot, "app/Modules/Demo");
        const providersPath = join(starterRoot, "bootstrap/providers.ts");
        const providersBefore = await readFile(providersPath, "utf8");

        try {
            const result = spawnSync("bun", ["./nino", "make:module", "Demo"], {
                cwd: starterRoot,
                encoding: "utf8",
            });

            expect(result.status).toBe(0);
            expect(existsSync(join(demoRoot, "Providers/DemoServiceProvider.ts"))).toBe(true);
            expect(existsSync(join(demoRoot, "routes.ts"))).toBe(true);
            expect(existsSync(join(starterRoot, "src"))).toBe(false);

            const providersAfter = await readFile(providersPath, "utf8");
            expect(providersAfter).toContain("DemoServiceProvider");
        } finally {
            await rm(demoRoot, { force: true, recursive: true });
            await writeFile(providersPath, providersBefore, "utf8");
        }
    });
});
