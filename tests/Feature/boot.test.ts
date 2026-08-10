import { describe, test } from "bun:test";
import { assertJson, assertStatus, createTestApp } from "../support/http";

describe("Application boot", () => {
    test("GET /health returns ok JSON", async () => {
        const t = await createTestApp();
        try {
            const response = await t.get("/health");
            assertStatus(response, 200);
            await assertJson(response, { status: "ok", service: "ninots" });
        } finally {
            t.stop();
        }
    });
});
