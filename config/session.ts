/**
 * Session configuration (Laravel-like).
 *
 * Driver implementations live in `@ninots/session`. Auth consumes an
 * `AuthSessionStore` adapter — see `SessionAuthStoreAdapter`.
 */
export default {
    /**
     * Session driver: cookie | file | database | redis
     *
     * @default 'file' (use `redis` with REDIS_URL / Docker profile `redis`)
     */
    driver: (Bun.env.SESSION_DRIVER ?? "file") as "cookie" | "file" | "database" | "redis",

    /**
     * Lifetime in minutes.
     *
     * @default 120
     */
    lifetime: Number(Bun.env.SESSION_LIFETIME ?? 120),

    /**
     * Session cookie name.
     *
     * @default 'ninots_session'
     */
    cookie: Bun.env.SESSION_COOKIE ?? "ninots_session",

    /**
     * Cookie path.
     */
    path: "/",

    /**
     * Cookie domain (optional).
     */
    domain: Bun.env.SESSION_DOMAIN,

    /**
     * Secure cookies only.
     */
    secure: Bun.env.SESSION_SECURE === "true",

    /**
     * HTTP-only cookie flag.
     */
    httpOnly: true,

    /**
     * SameSite attribute.
     */
    sameSite: (Bun.env.SESSION_SAME_SITE ?? "lax") as "strict" | "lax" | "none",

    /**
     * File driver storage path.
     */
    files: Bun.env.SESSION_FILES ?? "storage/framework/sessions",

    /**
     * Database driver table name.
     */
    table: Bun.env.SESSION_TABLE ?? "sessions",

    /**
     * Redis key prefix (redis driver).
     */
    redisPrefix: Bun.env.SESSION_REDIS_PREFIX ?? "ninots_session:",
};
