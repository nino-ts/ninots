export default {
    /**
     * Application name
     */
    name: "Ninots App",

    /**
     * Application environment
     */
    env: Bun.env.NODE_ENV ?? "development",

    /**
     * Debug mode
     */
    debug: Bun.env.NODE_ENV !== "production",

    /**
     * Application URL
     */
    url: "http://localhost:3000",

    /**
     * Server port
     */
    port: parseInt(Bun.env.PORT ?? "3000", 10),

    /**
     * Server hostname
     */
    hostname: "0.0.0.0",
};
