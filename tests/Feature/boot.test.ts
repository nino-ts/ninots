import { describe, expect, test } from "bun:test";
import { bootstrap, createAppServeOptions } from "@/bootstrap/app";

describe("Application boot", () => {
    test("GET /health returns ok JSON", async () => {
        const app = await bootstrap();
        const server = Bun.serve({
            ...createAppServeOptions(app),
            port: 0,
            hostname: "127.0.0.1",
        });

        try {
            const response = await fetch(`http://127.0.0.1:${server.port}/health`);
            const body = (await response.json()) as { status: string; service: string };

            expect(response.status).toBe(200);
            expect(body.status).toBe("ok");
            expect(body.service).toBe("ninots");
        } finally {
            server.stop();
        }
    });
});
