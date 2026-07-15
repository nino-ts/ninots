export default {
    /**
     * Default queue connection (sync only in Sprint 2).
     */
    default: Bun.env.QUEUE_CONNECTION ?? "sync",

    connections: {
        sync: {
            driver: "sync",
        },
    },
};
