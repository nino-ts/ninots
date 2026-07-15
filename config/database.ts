export default {
    /**
     * Default database connection
     */
    default: Bun.env.DB_CONNECTION ?? "sqlite",

    /**
     * Database connections
     */
    connections: {
        sqlite: {
            driver: "sqlite",
            filename: "storage/database.sqlite",
            foreignKeys: true,
        },
        postgres: {
            driver: "postgres",
            host: Bun.env.DB_HOST ?? "127.0.0.1",
            port: parseInt(Bun.env.DB_PORT ?? "5432", 10),
            database: Bun.env.DB_DATABASE ?? "ninots",
            username: Bun.env.DB_USERNAME ?? "root",
            password: Bun.env.DB_PASSWORD ?? "",
        },
        mysql: {
            driver: "mysql",
            host: Bun.env.DB_HOST ?? "127.0.0.1",
            port: parseInt(Bun.env.DB_PORT ?? "3306", 10),
            database: Bun.env.DB_DATABASE ?? "ninots",
            username: Bun.env.DB_USERNAME ?? "root",
            password: Bun.env.DB_PASSWORD ?? "",
        },
    },

    /**
     * Migration configuration
     */
    migrations: {
        table: "migrations",
        directory: "database/migrations",
    },
};
