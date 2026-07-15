import path from "node:path";
import { DatabaseManager, Migrator, Model } from "@ninots/framework";
import { resetDatabaseManager } from "@/bootstrap/database";
import databaseConfig from "@/config/database";

let activeDatabase: DatabaseManager | null = null;

const migrationsPath = path.join(process.cwd(), databaseConfig.migrations.directory);

/**
 * Boot an in-memory SQLite database with migrations applied (for feature tests).
 */
export async function setupTestDatabase(): Promise<DatabaseManager> {
    const database = new DatabaseManager();
    database.addConnection("default", {
        database: ":memory:",
        driver: "sqlite",
        url: ":memory:",
    });
    database.setDefaultConnection("default");
    Model.setConnectionResolver(database);
    resetDatabaseManager(database);

    const migrator = new Migrator({
        database,
        path: migrationsPath,
        table: databaseConfig.migrations.table,
    });
    await migrator.run();

    activeDatabase = database;
    return database;
}

/**
 * Tear down the in-memory test database.
 */
export async function teardownTestDatabase(): Promise<void> {
    if (activeDatabase) {
        await activeDatabase.closeALl();
        activeDatabase = null;
    }
    resetDatabaseManager(null);
}
