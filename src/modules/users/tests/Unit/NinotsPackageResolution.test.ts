import { describe, expect, test } from "bun:test";
import packageJson from "../../../../../package.json";

describe("Ninots package resolution", () => {
    test("should keep only @ninots/framework as runtime dependency", () => {
        expect(packageJson.dependencies).toEqual({
            "@ninots/framework": "link:@ninots/framework",
        });
    });

    test("should resolve @ninots/framework", async () => {
        await expect(import("@ninots/framework")).resolves.toBeDefined();
    });
});
