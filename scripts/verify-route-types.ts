/**
 * Fail-fixtures for typed `route()` — each must make `tsc --noEmit` exit ≠ 0.
 *
 * @packageDocumentation
 */

import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { $ } from "bun";

const failDir = join(import.meta.dir, "../tests/Types/fail");
const configs = (await readdir(failDir))
    .filter((name) => name.startsWith("tsconfig.") && name.endsWith(".json") && name !== "tsconfig.base.json")
    .sort();

if (configs.length === 0) {
    process.exit(1);
}

let unexpectedPass = 0;

for (const configName of configs) {
    const configPath = join(failDir, configName);
    const result = await $`bunx tsc --noEmit -p ${configPath}`.nothrow();

    if (result.exitCode === 0) {
        unexpectedPass += 1;
    }
}

if (unexpectedPass > 0) {
    process.exit(1);
}
