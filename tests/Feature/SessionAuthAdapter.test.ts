import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import type { AuthManager } from "@ninots/auth";
import type { Application } from "@ninots/foundation";
import { FileDriver, SessionManager } from "@ninots/session";
import {
    AUTH_MANAGER_KEY,
    createAuthSessionStore,
    createSessionManager,
    SESSION_MANAGER_KEY,
} from "@/app/Session/createSessionServices";
import { SessionAuthStoreAdapter } from "@/app/Session/SessionAuthStoreAdapter";
import { bootstrap } from "@/bootstrap/app";

describe("Session ↔ Auth adapter", () => {
    const testDir = join(import.meta.dir, "..", "tmp-session-auth");
    let app: Application;

    beforeAll(async () => {
        await mkdir(testDir, { recursive: true });
        app = await bootstrap();
    });

    afterAll(async () => {
        await rm(testDir, { force: true, recursive: true });
    });

    test("container resolves SessionManager and AuthManager", () => {
        const manager = app.make<SessionManager>(SESSION_MANAGER_KEY);
        const auth = app.make<AuthManager>(AUTH_MANAGER_KEY);
        expect(manager).toBeInstanceOf(SessionManager);
        expect(typeof auth.extend).toBe("function");
    });

    test("adapter maps session get/put/forget/flush to AuthSessionStore", async () => {
        const driver = new FileDriver(testDir);
        const manager = new SessionManager(driver, {
            cookie: "ninots_session",
            driver: "file",
            files: testDir,
            httpOnly: true,
            lifetime: 120,
            path: "/",
            sameSite: "lax",
            secure: false,
        });

        const store = await createAuthSessionStore(manager);
        expect(store).toBeInstanceOf(SessionAuthStoreAdapter);

        store.put("user_id", 42);
        expect(store.get<number>("user_id")).toBe(42);

        store.forget("user_id");
        expect(store.get("user_id")).toBeUndefined();

        store.put("a", 1);
        store.put("b", 2);
        store.flush();
        expect(store.get("a")).toBeUndefined();
        expect(store.get("b")).toBeUndefined();

        const ok = await store.regenerate();
        expect(ok).toBe(true);
        await store.unwrap().save();
    });

    test("createSessionManager uses file driver by default", () => {
        const manager = createSessionManager();
        expect(manager).toBeInstanceOf(SessionManager);
    });
});
