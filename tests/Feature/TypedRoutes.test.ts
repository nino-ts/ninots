import { describe, expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { route } from "@ninots/routing";
import { bootstrap } from "@/bootstrap/app";

const starterRoot = join(import.meta.dir, "../..");

describe("typed route registry", () => {
    test("route('users.show') includes group prefix /api", async () => {
        await bootstrap();
        expect(route("users.show", { id: "123" })).toBe("/api/users/123");
        expect(route("home")).toBe("/");
        expect(route("contact.create")).toBe("/contact");
    });

    test("routes:compile is idempotent", async () => {
        const first = spawnSync("bun", ["./nino", "routes:compile"], {
            cwd: starterRoot,
            encoding: "utf8",
        });
        const second = spawnSync("bun", ["./nino", "routes:compile"], {
            cwd: starterRoot,
            encoding: "utf8",
        });

        expect(first.status).toBe(0);
        expect(second.status).toBe(0);

        // Compare semantic content (normalize CRLF) instead of fragile `git diff`
        // which fails on Windows when core.autocrlf rewrote the committed artifact.
        const before = (await readFile(join(starterRoot, "types/routes.d.ts"), "utf8")).replace(/\r\n/g, "\n");
        const third = spawnSync("bun", ["./nino", "routes:compile"], {
            cwd: starterRoot,
            encoding: "utf8",
        });
        expect(third.status).toBe(0);
        const after = (await readFile(join(starterRoot, "types/routes.d.ts"), "utf8")).replace(/\r\n/g, "\n");
        expect(after).toBe(before);
    });

    test("committed types/routes.d.ts matches registry shape", async () => {
        const content = await readFile(join(starterRoot, "types/routes.d.ts"), "utf8");
        expect(content).toContain('"home": Record<never, never>;');
        expect(content).toContain('"users.show": { id: string };');
        expect(content).toContain("DO NOT EDIT");
    });

    test("routes:list shows NAME column", () => {
        const result = spawnSync("bun", ["./nino", "routes:list"], {
            cwd: starterRoot,
            encoding: "utf8",
        });

        expect(result.status).toBe(0);
        expect(result.stdout).toContain("NAME");
        expect(result.stdout).toContain("home");
        expect(result.stdout).toContain("users.show");
    });
});
