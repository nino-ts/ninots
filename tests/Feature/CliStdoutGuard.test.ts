import { join } from "node:path";
import { describe, expect, test } from "bun:test";

/**
 * Guards against regressing to a silent Kernel OutputWriter.
 * Symptom: `spawnSync(["bun", "./nino", "help"]).stdout === ""` with exit 0.
 */
describe("CLI stdout writer guard", () => {
    test("bootstrap/cli.ts OutputWriter writes to process.stdout", async () => {
        const cliPath = join(import.meta.dir, "../../bootstrap/cli.ts");
        const source = await Bun.file(cliPath).text();

        expect(source).toContain("process.stdout.write");
        expect(source).not.toMatch(/writeLine\(_text:\s*string\):\s*void\s*\{\s*\}/);
    });
});
