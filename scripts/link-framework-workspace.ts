/**
 * Symlinks workspace `@ninots/*` packages from `.deps/ninots-framework/packages`
 * into `node_modules/@ninots/` so TypeScript can resolve re-exports from the
 * published `@ninots/framework` meta-package `.d.ts` (those packages are not on npm).
 *
 * Run after `bun run deps:fetch` and `bun install`.
 */

import { existsSync, lstatSync, mkdirSync, readdirSync, rmSync, symlinkSync } from "node:fs";
import { join, resolve } from "node:path";

const STARTER_ROOT = resolve(import.meta.dir, "..");
const FRAMEWORK_DIR = join(STARTER_ROOT, ".deps", "ninots-framework");
const PACKAGES_DIR = join(FRAMEWORK_DIR, "packages");
const SCOPE_DIR = join(STARTER_ROOT, "node_modules", "@ninots");

function log(message: string): void {
    process.stdout.write(`${message}\n`);
}

function linkPackage(name: string, target: string): void {
    const dest = join(SCOPE_DIR, name);
    if (existsSync(dest)) {
        const stat = lstatSync(dest);
        if (stat.isSymbolicLink() || stat.isDirectory()) {
            rmSync(dest, { recursive: true, force: true });
        }
    }
    symlinkSync(target, dest, "junction");
    log(`linked @ninots/${name} → ${target}`);
}

function main(): void {
    if (!existsSync(join(PACKAGES_DIR, "orm", "package.json"))) {
        throw new Error(`missing framework packages under ${PACKAGES_DIR}; run bun run deps:fetch first`);
    }
    if (!existsSync(join(STARTER_ROOT, "node_modules"))) {
        throw new Error("node_modules missing; run bun install first");
    }

    mkdirSync(SCOPE_DIR, { recursive: true });

    for (const name of readdirSync(PACKAGES_DIR)) {
        const pkgDir = join(PACKAGES_DIR, name);
        if (!existsSync(join(pkgDir, "package.json"))) {
            continue;
        }
        // Keep the file: view install from package.json; only fill gaps for types.
        if (name === "view" && existsSync(join(SCOPE_DIR, "view"))) {
            continue;
        }
        linkPackage(name, pkgDir);
    }

    log("workspace @ninots/* packages linked for tsc");
}

main();
