import { describe, expect, test } from "bun:test";
import { render } from "@ninots/view";
import { bootstrap, createAppServeOptions } from "@/bootstrap/app";
import { Welcome } from "@/resources/views/welcome";

describe("Web routes", () => {
    test("GET / returns rendered HTML welcome page", async () => {
        const app = await bootstrap();
        const server = Bun.serve({
            ...createAppServeOptions(app),
            port: 0,
            hostname: "127.0.0.1",
        });

        try {
            const response = await fetch(`http://127.0.0.1:${server.port}/`);

            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toContain("text/html");

            const html = await response.text();
            expect(html).toContain("Welcome to Ninots");
            expect(html).toContain("<title>Ninots</title>");
            expect(html).toContain("Laravel-like DX on Bun");
        } finally {
            server.stop();
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
