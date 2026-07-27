/**
 * Patch installed `@ninots/*` package.json so TypeScript resolves types from
 * `index.ts` (Bun DX). Needed while npm `@0.0.1` still points `types` at stale
 * `dist/*.d.ts`. Remove after `@0.0.2` (or later) is published with source types.
 *
 * @packageDocumentation
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..", "node_modules", "@ninots");

for (const name of readdirSync(root, { withFileTypes: true })) {
    if (!name.isDirectory() || name.name === "framework") {
        continue;
    }

    const pjPath = join(root, name.name, "package.json");
    const pkg = JSON.parse(readFileSync(pjPath, "utf8")) as {
        types?: string;
        exports?: Record<string, Record<string, string> | string>;
        version?: string;
    };

    const dot = {
        types: "./index.ts",
        import: "./index.ts",
        default: "./index.ts",
    };

    pkg.types = "./index.ts";
    if (name.name === "view") {
        const jsx = {
            types: "./src/jsx-runtime.ts",
            import: "./src/jsx-runtime.ts",
            default: "./src/jsx-runtime.ts",
        };
        pkg.exports = {
            ".": dot,
            "./jsx-runtime": jsx,
            "./jsx-dev-runtime": jsx,
        };
    } else {
        pkg.exports = { ".": dot };
    }

    writeFileSync(pjPath, `${JSON.stringify(pkg, null, 4)}\n`);

    // Hotfix stale create-serve-options null narrowing on @0.0.1
    if (name.name === "foundation") {
        const servePath = join(root, name.name, "src", "create-serve-options.ts");
        try {
            let src = readFileSync(servePath, "utf8");
            if (src.includes("baseHandler(request)") && !src.includes("fetchHandler")) {
                src = src.replace(
                    /const baseHandler = overrides\.fetch \?\? app\.getHandler\(\);\s*if \(baseHandler === undefined\) \{[\s\S]*?\}\s*const options: Serve\.Options<undefined> = \{\s*fetch: \(request: Request\) => baseHandler\(request\),/,
                    `const baseHandler = overrides.fetch ?? app.getHandler();\n    if (baseHandler === undefined || baseHandler === null) {\n        throw new Error(\n            "createServeOptions requires app.getHandler() or overrides.fetch. Call wireCoreServices(app, deps) first.",\n        );\n    }\n\n    const fetchHandler = baseHandler;\n\n    const options: Serve.Options<undefined> = {\n        fetch: (request: Request) => fetchHandler(request),`,
                );
                writeFileSync(servePath, src);
                console.log("patched foundation create-serve-options");
            }
        } catch {
            // ignore missing file
        }
    }

    console.log(`patched @ninots/${name.name}@${pkg.version ?? "?"}`);
}
