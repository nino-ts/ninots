import { DatabaseManager, Model } from "@ninots/framework";
import databaseConfig from "@/config/database";
import "@/database/factories/UserFactory";

let databaseManager: DatabaseManager | null = null;

/**
 * Build a DatabaseManager from application config.
 */
export function createDatabaseManager(): DatabaseManager {
    const manager = new DatabaseManager();

    for (const [name, connection] of Object.entries(databaseConfig.connections)) {
        manager.addConnection(name, connection);
    }

    manager.setDefaultConnection(databaseConfig.default);
    return manager;
}

/**
 * Resolve the singleton database manager and wire the ORM resolver.
 */
export function getDatabaseManager(): DatabaseManager {
    if (!databaseManager) {
        databaseManager = createDatabaseManager();
        Model.setConnectionResolver(databaseManager);
    }

    return databaseManager;
}

/**
 * Reset database manager (used in tests).
 */
export function resetDatabaseManager(manager?: DatabaseManager | null): void {
    databaseManager = manager ?? null;
}
