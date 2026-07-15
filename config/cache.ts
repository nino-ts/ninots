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
            driver: "array",
            serialize: false,
        },
        file: {
            driver: "file",
            path: "storage/framework/cache/data",
            lockPath: "storage/framework/cache/locks",
        },
    },

    /**
     * Cache prefix
     */
    prefix: "ninots_cache_",
};
