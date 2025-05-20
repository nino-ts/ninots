/**
 * Migração: Criar tabela de usuários
 * Gerada em: 2023-10-27T00:00:00.000Z
 */
import { DriverInterface } from "ninorm/src/Core/Contracts/DriverInterface";
import { Migration } from "../../../bootstrap/migrations";

const migration: Migration = {
    id: "20231027000000_create_users_table",
    name: "Criar tabela de usuários",
    timestamp: 1698364800000, // 2023-10-27T00:00:00.000Z

    async up(driver: DriverInterface): Promise<void> {
        await driver.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    },

    async down(driver: DriverInterface): Promise<void> {
        await driver.execute(`DROP TABLE IF EXISTS users`);
    },
};

export default migration;
