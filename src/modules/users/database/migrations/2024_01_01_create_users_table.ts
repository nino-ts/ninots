import type { Migration } from '@ninots/orm';

/**
 * Create users table migration.
 */
export default class CreateUsersTable implements Migration {
    /**
     * Run the migration.
     */
    public async up(): Promise<void> {
        // CREATE TABLE users (
        //     id INTEGER PRIMARY KEY AUTOINCREMENT,
        //     email TEXT UNIQUE NOT NULL,
        //     name TEXT NOT NULL,
        //     password TEXT NOT NULL,
        //     avatar TEXT,
        //     metadata TEXT,
        //     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        //     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        // );
    }

    /**
     * Reverse the migration.
     */
    public async down(): Promise<void> {
        // DROP TABLE users;
    }
}
