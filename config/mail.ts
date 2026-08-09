/**
 * Mail configuration — drivers live in `@ninots/mail`.
 *
 * Default `log` matches Laravel skeleton DX (no SMTP required locally).
 */
const mailConfig = {
    /**
     * Default mailer name (`MAIL_MAILER`).
     */
    default: Bun.env.MAIL_MAILER ?? "log",

    /**
     * Global From address / name.
     */
    from: {
        address: Bun.env.MAIL_FROM_ADDRESS ?? "hello@example.com",
        name: Bun.env.MAIL_FROM_NAME ?? Bun.env.APP_NAME ?? "Ninots App",
    },

    /**
     * Named mailers.
     */
    mailers: {
        array: {
            driver: "array" as const,
        },
        log: {
            driver: "log" as const,
        },
        smtp: {
            driver: "smtp" as const,
            host: Bun.env.MAIL_HOST ?? "127.0.0.1",
            port: Number(Bun.env.MAIL_PORT ?? "2525"),
            secure: (Bun.env.MAIL_ENCRYPTION ?? "").toLowerCase() === "tls",
            auth:
                Bun.env.MAIL_USERNAME && Bun.env.MAIL_USERNAME !== "null"
                    ? {
                          user: Bun.env.MAIL_USERNAME,
                          pass: Bun.env.MAIL_PASSWORD ?? "",
                      }
                    : undefined,
        },
    },
};

export default mailConfig;
