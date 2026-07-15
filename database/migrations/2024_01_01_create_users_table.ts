import type { Migration } from "@ninots/framework";

/**
 * Create users table migration.
 */
export default class CreateUsersTable implements Migration {
    public async up(): Promise<void> {
        // CREATE TABLE users (...)
    }

    public async down(): Promise<void> {
        // DROP TABLE users;
    }
}
