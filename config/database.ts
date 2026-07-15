import type { ConnectionConfig, DatabaseDriver } from "@ninots/framework";

type DatabaseConnections = Record<string, ConnectionConfig>;

const connections = {
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
} as const satisfies DatabaseConnections;

export default {
    /**
     * Default database connection
     */
    default: (Bun.env.DB_CONNECTION ?? "sqlite") as DatabaseDriver | string,

    /**
     * Database connections
     */
    connections,

    /**
     * Migration configuration
     */
    migrations: {
        table: "migrations",
        directory: "database/migrations",
    },
};
