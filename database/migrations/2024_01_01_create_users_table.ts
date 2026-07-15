import type { Connection, Migration } from "@ninots/framework";

/**
 * Create users table migration.
 */
export default class CreateUsersTable implements Migration {
    public async up(connection: Connection): Promise<void> {
        await connection.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL,
                password TEXT NOT NULL,
                avatar TEXT,
                metadata TEXT
            )
        `);
    }

    public async down(connection: Connection): Promise<void> {
        await connection.run("DROP TABLE IF EXISTS users");
    }
}
