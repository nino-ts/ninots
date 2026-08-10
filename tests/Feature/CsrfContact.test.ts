import { describe, expect, test } from "bun:test";
import { assertStatus, createTestApp, responseText } from "../support/http";

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
        const t = await createTestApp();
        try {
            const response = await t.get("/contact");

            assertStatus(response, 200);
            expect(response.headers.get("Content-Type")).toContain("text/html");

            const html = await responseText(response);
            expect(html).toContain('name="_token"');
            expect(html).toContain('method="post"');
            expect(html).toContain("Contact");
        } finally {
            t.stop();
        }
    });

    test("POST /contact without CSRF token is rejected", async () => {
        const t = await createTestApp();
        try {
            const response = await t.post("/contact", {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Cookie: `${SESSION_COOKIE}=test-session-without-token`,
                },
                body: "message=hello",
            });

            assertStatus(response, 419);
        } finally {
            t.stop();
        }
    });

    test("POST /contact with valid CSRF token is accepted", async () => {
        const t = await createTestApp();
        try {
            const getResponse = await t.get("/contact");
            const html = await responseText(getResponse);
            const token = extractCsrfToken(html);

            expect(token).toBeDefined();

            const setCookie = getResponse.headers.get("set-cookie");
            const sessionId = extractCookie(setCookie, SESSION_COOKIE);
            expect(sessionId).toBeDefined();

            const postResponse = await t.post("/contact", {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Cookie: `${SESSION_COOKIE}=${encodeURIComponent(sessionId ?? "")}`,
                },
                body: `_token=${encodeURIComponent(token ?? "")}&message=Hello+from+CSRF+test`,
            });

            assertStatus(postResponse, 200);

            const thanksHtml = await responseText(postResponse);
            expect(thanksHtml).toContain("Thanks!");
            expect(thanksHtml).toContain("Hello from CSRF test");
        } finally {
            t.stop();
        }
    });
});
