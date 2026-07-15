export default {
    name: Bun.env.APP_NAME ?? "Ninots App",
    env: Bun.env.APP_ENV ?? "development",
    debug: (Bun.env.APP_DEBUG ?? "true") === "true",
    url: Bun.env.APP_URL ?? "http://localhost:3000",
    port: Number.parseInt(Bun.env.PORT ?? "3000", 10),
    hostname: Bun.env.HOSTNAME ?? "0.0.0.0",
};
