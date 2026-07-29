import type { SessionConfig, SessionDriver } from "@ninots/session";
import { CookieDriver, FileDriver, SessionManager } from "@ninots/session";
import sessionConfig from "@/config/session";
import { SessionAuthStoreAdapter } from "./SessionAuthStoreAdapter";

/**
 * Build a {@link SessionConfig} from app config (fills required cookie fields).
 */
export function buildSessionConfig(): SessionConfig {
    return {
        cookie: sessionConfig.cookie,
        driver: sessionConfig.driver,
        files: sessionConfig.files,
        httpOnly: sessionConfig.httpOnly,
        lifetime: sessionConfig.lifetime,
        path: sessionConfig.path,
        sameSite: sessionConfig.sameSite,
        secure: sessionConfig.secure,
        table: sessionConfig.table,
        ...(sessionConfig.domain !== undefined ? { domain: sessionConfig.domain } : {}),
    };
}

/**
 * Resolve the concrete session driver for the configured `driver` name.
 *
 * Database requires an app-injected {@link import("@ninots/session").DatabaseDriver}
 * — register it in the container instead of using this helper.
 */
export function resolveSessionDriver(config: SessionConfig = buildSessionConfig()): SessionDriver {
    switch (config.driver) {
        case "cookie":
            return new CookieDriver();
        case "file":
            return new FileDriver(config.files);
        case "database":
            throw new Error(
                "Session driver \"database\" requires injecting DatabaseDriver (SessionConnectionInterface). " +
                    "Override the SessionManager binding in a service provider.",
            );
        default: {
            const _exhaustive: never = config.driver;
            throw new Error(`Unknown session driver: ${String(_exhaustive)}`);
        }
    }
}

/**
 * Create the canonical {@link SessionManager} for this app.
 */
export function createSessionManager(driver?: SessionDriver): SessionManager {
    const config = buildSessionConfig();
    return new SessionManager(driver ?? resolveSessionDriver(config), config);
}

/**
 * Load (or create) a session and wrap it as auth's AuthSessionStore.
 */
export async function createAuthSessionStore(
    manager: SessionManager,
    sessionId?: string,
): Promise<SessionAuthStoreAdapter> {
    const session =
        sessionId !== undefined ? await manager.getOrCreate(sessionId) : await manager.create();
    return new SessionAuthStoreAdapter(session);
}

/** Container key for {@link SessionManager}. */
export const SESSION_MANAGER_KEY = "SessionManager";

/** Container key for {@link import("@ninots/auth").AuthManager}. */
export const AUTH_MANAGER_KEY = "AuthManager";
