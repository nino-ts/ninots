/**
 * Queue configuration (Laravel-like).
 *
 * Connectors live in `@ninots/queue`. SyncBus in `@ninots/events` remains for
 * EventDispatcher — domain jobs dispatch via QueueManager.
 */
export default {
    /**
     * Default queue connection name.
     *
     * @default 'sync'
     */
    default: Bun.env.QUEUE_CONNECTION ?? "sync",

    connections: {
        sync: {
            driver: "sync" as const,
        },
        redis: {
            driver: "redis" as const,
            queue: Bun.env.REDIS_QUEUE ?? "default",
            prefix: Bun.env.REDIS_PREFIX ?? "ninots:",
            blockTimeoutSeconds: Number(Bun.env.QUEUE_BLOCK_TIMEOUT ?? 5),
            url: Bun.env.REDIS_URL,
        },
    },
};
