import { describe, expect, test } from "bun:test";
import { bootstrap, createAppServeOptions } from "@/bootstrap/app";

const SESSION_COOKIE = "ninots_session";

function extractCookie(setCookieHeader: string | null, name: string): string | undefined {
    if (!setCookieHeader) {
        return undefined;
    }

    const match = setCookieHeader.match(new RegExp(`${name}=([^;]+)`));
    return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

function extractCsrfToken(html: string): string | undefined {
    const match = html.match(/name="_token"\s+value="([^"]+)"/);
    return match?.[1];
}

describe("CSRF contact form", () => {
    test("GET /contact returns a form with CSRF hidden field", async () => {
        const app = await bootstrap();
        const server = Bun.serve({
            ...createAppServeOptions(app),
            port: 0,
            hostname: "127.0.0.1",
        });

        try {
            const response = await fetch(`http://127.0.0.1:${server.port}/contact`);

            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toContain("text/html");

            const html = await response.text();
            expect(html).toContain('name="_token"');
            expect(html).toContain('method="post"');
            expect(html).toContain("Contact");
        } finally {
            server.stop();
        }
    });

    test("POST /contact without CSRF token is rejected", async () => {
        const app = await bootstrap();
        const server = Bun.serve({
            ...createAppServeOptions(app),
            port: 0,
            hostname: "127.0.0.1",
        });

        try {
            const response = await fetch(`http://127.0.0.1:${server.port}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Cookie: `${SESSION_COOKIE}=test-session-without-token`,
                },
                body: "message=hello",
            });

            expect(response.status).toBe(419);
        } finally {
            server.stop();
        }
    });

    test("POST /contact with valid CSRF token is accepted", async () => {
        const app = await bootstrap();
        const server = Bun.serve({
            ...createAppServeOptions(app),
            port: 0,
            hostname: "127.0.0.1",
        });

        try {
            const baseUrl = `http://127.0.0.1:${server.port}`;
            const getResponse = await fetch(`${baseUrl}/contact`);
            const html = await getResponse.text();
            const token = extractCsrfToken(html);

            expect(token).toBeDefined();

            const setCookie = getResponse.headers.get("set-cookie");
            const sessionId = extractCookie(setCookie, SESSION_COOKIE);
            expect(sessionId).toBeDefined();

            const postResponse = await fetch(`${baseUrl}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Cookie: `${SESSION_COOKIE}=${encodeURIComponent(sessionId ?? "")}`,
                },
                body: `_token=${encodeURIComponent(token ?? "")}&message=Hello+from+CSRF+test`,
            });

            expect(postResponse.status).toBe(200);

            const thanksHtml = await postResponse.text();
            expect(thanksHtml).toContain("Thanks!");
            expect(thanksHtml).toContain("Hello from CSRF test");
        } finally {
            server.stop();
        }
    });
});
