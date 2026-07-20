/**
 * Ensures `.deps/ninots-framework` is a full framework tree so:
 * - `file:.deps/.../packages/view` resolves (`@ninots/view` is not on npm yet)
 * - `deps:link` can expose workspace `@ninots/*` packages for `tsc` (published
 *   `@ninots/framework` ships a bundled runtime but `.d.ts` re-exports packages
 *   that are not published separately on npm)
 *
 * Prefers the hub sibling `../framework`; otherwise clones the tagged release.
 * Rewrites `catalog:` ranges so `bun install` works outside the workspace.
 */

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { $ } from "bun";

const FRAMEWORK_REF = "v0.10.1";
const DEPS_DIR = resolve(import.meta.dir, "..", ".deps");
const FRAMEWORK_DIR = join(DEPS_DIR, "ninots-framework");
const VIEW_DIR = join(FRAMEWORK_DIR, "packages", "view");
const VIEW_MARKER = join(VIEW_DIR, "package.json");
const ORM_MARKER = join(FRAMEWORK_DIR, "packages", "orm", "package.json");
const FRAMEWORK_PKG = join(FRAMEWORK_DIR, "package.json");
const HUB_FRAMEWORK = resolve(import.meta.dir, "..", "..", "framework");
const VIEW_PATCH_MARKER = join(VIEW_DIR, ".ninots-deps-patched");
const ROOT_PATCH_MARKER = join(FRAMEWORK_DIR, ".ninots-root-deps-patched");

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function rewriteCatalog(deps: JsonRecord | undefined): void {
    if (!deps) {
        return;
    }
    for (const [name, range] of Object.entries(deps)) {
        if (typeof range !== "string" || !range.startsWith("catalog:")) {
            continue;
        }
        if (name === "@types/bun") {
            deps[name] = "latest";
        } else if (name === "typescript") {
            deps[name] = "^6.0.0";
        } else if (name === "@biomejs/biome") {
            deps[name] = "2.5.4";
        } else if (name === "typedoc") {
            deps[name] = "^0.28.19";
        } else {
            deps[name] = "*";
        }
    }
}

function patchPackageJsonCatalogs(pkgPath: string, markerPath: string): void {
    if (existsSync(markerPath)) {
        return;
    }
    const raw = readFileSync(pkgPath, "utf8");
    const pkg: unknown = JSON.parse(raw);
    if (!isRecord(pkg)) {
        throw new Error(`${pkgPath} is not an object`);
    }
    if (isRecord(pkg.devDependencies)) {
        rewriteCatalog(pkg.devDependencies);
    }
    if (isRecord(pkg.peerDependencies)) {
        rewriteCatalog(pkg.peerDependencies);
    }
    if (isRecord(pkg.dependencies)) {
        rewriteCatalog(pkg.dependencies);
    }
    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 4)}\n`);
    writeFileSync(markerPath, `${FRAMEWORK_REF}\n`);
}

function log(message: string): void {
    process.stdout.write(`${message}\n`);
}

function isCompleteFrameworkTree(): boolean {
    return existsSync(FRAMEWORK_PKG) && existsSync(VIEW_MARKER) && existsSync(ORM_MARKER);
}

function shouldSkipCopy(src: string): boolean {
    const normalized = src.replaceAll("\\", "/");
    return (
        normalized.includes("/node_modules/") ||
        normalized.endsWith("/node_modules") ||
        normalized.includes("/.git/") ||
        normalized.endsWith("/.git")
    );
}

async function materializeFramework(): Promise<void> {
    if (isCompleteFrameworkTree()) {
        return;
    }

    mkdirSync(DEPS_DIR, { recursive: true });
    if (existsSync(FRAMEWORK_DIR)) {
        rmSync(FRAMEWORK_DIR, { recursive: true, force: true });
    }

    if (existsSync(join(HUB_FRAMEWORK, "packages", "view", "package.json"))) {
        log(`copying hub framework → ${FRAMEWORK_DIR}`);
        cpSync(HUB_FRAMEWORK, FRAMEWORK_DIR, {
            recursive: true,
            filter: (src) => !shouldSkipCopy(src),
        });
        return;
    }

    log(`cloning nino-ts/framework@${FRAMEWORK_REF} → ${FRAMEWORK_DIR}`);
    await $`git clone --depth 1 --branch ${FRAMEWORK_REF} https://github.com/nino-ts/framework.git ${FRAMEWORK_DIR}`;
}

async function main(): Promise<void> {
    await materializeFramework();
    if (!isCompleteFrameworkTree()) {
        throw new Error(`incomplete framework tree under ${FRAMEWORK_DIR}`);
    }
    patchPackageJsonCatalogs(VIEW_MARKER, VIEW_PATCH_MARKER);
    patchPackageJsonCatalogs(FRAMEWORK_PKG, ROOT_PATCH_MARKER);
    log(`framework deps ok: ${FRAMEWORK_DIR}`);
}

await main();
