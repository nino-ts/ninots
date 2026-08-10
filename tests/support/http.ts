/**
 * HTTP Feature-test helpers — bootstrap + Bun.serve without boilerplate.
 *
 * Zero runtime deps beyond bun:test / Bun APIs used by the caller.
 *
 * @packageDocumentation
 */

import { expect } from "bun:test";
import type { Application } from "@ninots/foundation";
import { bootstrap, createAppServeOptions } from "@/bootstrap/app";

export type TestRequestOptions = {
    headers?: HeadersInit;
    body?: BodyInit | null;
};

export type TestApp = {
    app: Application;
    baseUrl: string;
    stop: () => void;
    get: (path: string, options?: TestRequestOptions) => Promise<Response>;
    post: (path: string, options?: TestRequestOptions) => Promise<Response>;
};

function normalizePath(path: string): string {
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }
    return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Boot the app and serve on an ephemeral local port.
 */
export async function createTestApp(): Promise<TestApp> {
    const app = await bootstrap();
    const server = Bun.serve({
        ...createAppServeOptions(app),
        port: 0,
        hostname: "127.0.0.1",
    });

    const baseUrl = `http://127.0.0.1:${server.port}`;

    const request = async (method: string, path: string, options: TestRequestOptions = {}): Promise<Response> => {
        const url = path.startsWith("http://") || path.startsWith("https://") ? path : `${baseUrl}${normalizePath(path)}`;
        return fetch(url, {
            method,
            headers: options.headers,
            body: options.body,
            redirect: "manual",
        });
    };

    return {
        app,
        baseUrl,
        stop: () => {
            server.stop();
        },
        get: (path, options) => request("GET", path, options),
        post: (path, options) => request("POST", path, options),
    };
}

/**
 * Assert HTTP status code.
 */
export function assertStatus(response: Response, status: number): void {
    expect(response.status).toBe(status);
}

/**
 * Assert JSON body deep-equals `expected` (and Content-Type includes json when present).
 */
export async function assertJson(response: Response, expected: unknown): Promise<void> {
    const contentType = response.headers.get("Content-Type");
    if (contentType !== null) {
        expect(contentType).toContain("json");
    }
    const body: unknown = await response.json();
    expect(body).toEqual(expected);
}

/**
 * Read response text body (convenience for HTML assertions).
 */
export async function responseText(response: Response): Promise<string> {
    return response.text();
}
