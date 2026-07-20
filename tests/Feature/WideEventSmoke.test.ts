/**
 * Feature smoke: instrumented web request → exactly one Wide Event JSON line.
 *
 * @packageDocumentation
 */

import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { bootstrap, createAppServeOptions } from "@/bootstrap/app";

const MINIMAL_FIELDS = ["request_id", "timestamp", "method", "path", "status_code", "duration_ms", "outcome"] as const;

function parseCanonicalLine(writeSpy: ReturnType<typeof spyOn>, index: number): Record<string, unknown> {
    const args = writeSpy.mock.calls[index] as unknown[];
    const payload = args[1];
    if (typeof payload !== "string") {
        throw new Error(`Expected Bun.write string payload at call ${index}`);
    }
    return JSON.parse(payload) as Record<string, unknown>;
}

function isCanonicalWideEvent(line: Record<string, unknown>): boolean {
    return MINIMAL_FIELDS.every((key) => key in line) && !("level" in line) && !("message" in line);
}

describe("Wide Event smoke", () => {
    let writeSpy: ReturnType<typeof spyOn> | undefined;

    afterEach(() => {
        writeSpy?.mockRestore();
        writeSpy = undefined;
    });

    test("GET / emits exactly one canonical JSON line", async () => {
        writeSpy = spyOn(Bun, "write").mockImplementation(() => Promise.resolve(100));

        const app = await bootstrap();
        const server = Bun.serve({
            ...createAppServeOptions(app),
            port: 0,
            hostname: "127.0.0.1",
        });

        try {
            const response = await fetch(`http://127.0.0.1:${server.port}/`);
            expect(response.status).toBe(200);

            const spy = writeSpy;
            const canonicalLines: Record<string, unknown>[] = [];
            for (let index = 0; index < spy.mock.calls.length; index++) {
                const line = parseCanonicalLine(spy, index);
                if (isCanonicalWideEvent(line)) {
                    canonicalLines.push(line);
                }
            }

            expect(canonicalLines).toHaveLength(1);

            const line = canonicalLines[0];
            expect(line).toBeDefined();
            if (!line) {
                throw new Error("Expected canonical wide event line");
            }

            expect(typeof line.request_id).toBe("string");
            expect(typeof line.timestamp).toBe("string");
            expect(line.method).toBe("GET");
            expect(line.path).toBe("/");
            expect(line.status_code).toBe(200);
            expect(typeof line.duration_ms).toBe("number");
            expect(line.outcome).toBe("success");
        } finally {
            server.stop();
        }
    });
});
