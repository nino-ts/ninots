/**
 * Ensures `.deps/ninots-framework` exists so `file:.deps/.../packages/view`
 * resolves. Prefers the hub sibling `../framework`; otherwise clones the
 * tagged release from GitHub (`@ninots/view` is not published on npm yet).
 *
 * Also rewrites `catalog:` ranges in the view package.json so `bun install`
 * works outside the framework workspace.
 */

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { $ } from "bun";

const FRAMEWORK_REF = "v0.10.1";
const DEPS_DIR = resolve(import.meta.dir, "..", ".deps");
const FRAMEWORK_DIR = join(DEPS_DIR, "ninots-framework");
const VIEW_DIR = join(FRAMEWORK_DIR, "packages", "view");
const VIEW_MARKER = join(VIEW_DIR, "package.json");
const HUB_FRAMEWORK = resolve(import.meta.dir, "..", "..", "framework");
const PATCH_MARKER = join(VIEW_DIR, ".ninots-deps-patched");

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
        } else {
            deps[name] = "*";
        }
    }
}

function patchViewPackageJson(): void {
    if (existsSync(PATCH_MARKER)) {
        return;
    }
    const raw = readFileSync(VIEW_MARKER, "utf8");
    const pkg: unknown = JSON.parse(raw);
    if (!isRecord(pkg)) {
        throw new Error("view package.json is not an object");
    }
    if (isRecord(pkg.devDependencies)) {
        rewriteCatalog(pkg.devDependencies);
    }
    if (isRecord(pkg.peerDependencies)) {
        rewriteCatalog(pkg.peerDependencies);
    }
    writeFileSync(VIEW_MARKER, `${JSON.stringify(pkg, null, 4)}\n`);
    writeFileSync(PATCH_MARKER, `${FRAMEWORK_REF}\n`);
}

function log(message: string): void {
    process.stdout.write(`${message}\n`);
}

async function materializeFramework(): Promise<void> {
    if (existsSync(VIEW_MARKER)) {
        return;
    }

    mkdirSync(DEPS_DIR, { recursive: true });

    if (existsSync(join(HUB_FRAMEWORK, "packages", "view", "package.json"))) {
        log(`copying hub framework → ${FRAMEWORK_DIR}`);
        if (existsSync(FRAMEWORK_DIR)) {
            rmSync(FRAMEWORK_DIR, { recursive: true, force: true });
        }
        // Copy only what we need so we can patch view/package.json without
        // mutating the live hub tree.
        mkdirSync(join(FRAMEWORK_DIR, "packages"), { recursive: true });
        cpSync(join(HUB_FRAMEWORK, "packages", "view"), VIEW_DIR, { recursive: true });
        return;
    }

    log(`cloning nino-ts/framework@${FRAMEWORK_REF} → ${FRAMEWORK_DIR}`);
    if (existsSync(FRAMEWORK_DIR)) {
        rmSync(FRAMEWORK_DIR, { recursive: true, force: true });
    }
    await $`git clone --depth 1 --branch ${FRAMEWORK_REF} https://github.com/nino-ts/framework.git ${FRAMEWORK_DIR}`;
}

async function main(): Promise<void> {
    await materializeFramework();
    if (!existsSync(VIEW_MARKER)) {
        throw new Error(`missing ${VIEW_MARKER}`);
    }
    patchViewPackageJson();
    log(`framework deps ok: ${VIEW_DIR}`);
}

await main();
