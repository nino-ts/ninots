export default {
    /**
     * Default cache store
     */
    default: Bun.env.CACHE_STORE ?? "array",

    /**
     * Cache stores
     */
    stores: {
        array: {
            driver: "array" as const,
            serialize: false,
        },
        file: {
            driver: "file" as const,
            path: "storage/framework/cache/data",
            lockPath: "storage/framework/cache/locks",
        },
        redis: {
            driver: "redis" as const,
            url: Bun.env.REDIS_URL,
            prefix: Bun.env.CACHE_PREFIX ?? "ninots_cache_",
        },
    },

    /**
     * Cache prefix (used by redis store when store-level prefix omitted)
     */
    prefix: Bun.env.CACHE_PREFIX ?? "ninots_cache_",
};
