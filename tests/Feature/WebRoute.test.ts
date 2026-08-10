import { describe, expect, test } from "bun:test";
import { render } from "@ninots/view";
import { Welcome } from "@/resources/views/welcome";
import { assertStatus, createTestApp, responseText } from "../support/http";

describe("Web routes", () => {
    test("GET / returns rendered HTML welcome page", async () => {
        const t = await createTestApp();
        try {
            const response = await t.get("/");

            assertStatus(response, 200);
            expect(response.headers.get("Content-Type")).toContain("text/html");

            const html = await responseText(response);
            expect(html).toContain("Welcome to Ninots");
            expect(html).toContain("<title>Ninots</title>");
            expect(html).toContain("Laravel-like DX on Bun");
        } finally {
            t.stop();
        }
    });

    test("welcome view escapes XSS payloads in dynamic text", async () => {
        const payload = '<script>alert("xss")</script>';
        const response = await render(Welcome, { subtitle: payload });
        const html = await response.text();

        expect(html).not.toContain("<script>");
        expect(html).toContain("&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;");
    });
});
