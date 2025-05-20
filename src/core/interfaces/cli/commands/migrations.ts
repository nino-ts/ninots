/**
 * CLI para migração de banco de dados
 */

import { DriverInterface } from "ninorm/src/Core/Contracts/DriverInterface";
import { MigrationManager } from "../../../bootstrap/migrations";
import { LoggerFactory } from "../../infrastructure/logging/logger-factory";
import databaseConfig from "../../../config/database";
import { AbstractModel } from "ninorm/src/Core/Model/AbstractModel";
import path from "node:path";

const logger = LoggerFactory.create("cli-migrations");

/**
 * Comando para migração
 */
export async function runMigrationCommand(args: string[]): Promise<void> {
    if (args.length < 1) {
        console.log("Uso: migrations <comando> [options]");
        console.log("Comandos disponíveis:");
        console.log("  list      - Lista todas as migrações");
        console.log("  create    - Cria uma nova migração");
        console.log("  up        - Aplica migrações pendentes");
        console.log("  down      - Reverte a última migração");
        console.log("  status    - Verifica o estado das migrações");
        return;
    }

    const command = args[0];
    const migrationsDir = path.join(
        process.cwd(),
        "src/core/infrastructure/migrations"
    );

    try {
        // Inicializa o driver do banco de dados
        logger.info("Inicializando conexão com o banco de dados");
        const connection = databaseConfig.connections[databaseConfig.default];
        const driver = connection.driver;

        // Configura o driver global para os modelos
        AbstractModel.useDriver(driver);

        // Conecta ao banco de dados
        await driver.connect();

        // Inicializa o gerenciador de migrações
        logger.info("Inicializando gerenciador de migrações");
        const migrationManager = new MigrationManager(driver, migrationsDir);
        await migrationManager.initialize();

        // Executa o comando específico
        switch (command) {
            case "list":
                await listMigrations(migrationManager);
                break;
            case "create":
                await createMigration(migrationManager, args.slice(1));
                break;
            case "up":
                await migrateUp(migrationManager);
                break;
            case "down":
                await migrateDown(migrationManager);
                break;
            case "status":
                await checkStatus(migrationManager);
                break;
            default:
                logger.error(`Comando desconhecido: ${command}`);
                break;
        }

        // Fecha a conexão com o banco de dados
        await driver.disconnect();
    } catch (error) {
        logger.error(`Erro ao executar comando de migração: ${error}`);
    }
}

/**
 * Lista todas as migrações
 */
async function listMigrations(
    migrationManager: MigrationManager
): Promise<void> {
    const migrations = migrationManager.listMigrations();

    console.log("\nMigrações:\n");
    console.log("ID                                        | Status   | Nome");
    console.log(
        "------------------------------------------|---------|--------------------------"
    );

    migrations.forEach((migration) => {
        const status = migration.applied ? "APLICADA" : "PENDENTE";
        const date = migration.timestamp
            ? new Date(migration.timestamp).toISOString()
            : "-";
        console.log(
            `${migration.id.padEnd(40)} | ${status.padEnd(8)} | ${
                migration.name
            }`
        );
    });

    console.log("\n");
}

/**
 * Cria uma nova migração
 */
async function createMigration(
    migrationManager: MigrationManager,
    args: string[]
): Promise<void> {
    if (args.length < 1) {
        logger.error("Nome da migração não fornecido");
        console.log("Uso: migrations create <nome_da_migracao>");
        return;
    }

    const name = args[0];
    const filePath = migrationManager.createMigrationFile(name);

    logger.info(`Migração criada: ${filePath}`);
}

/**
 * Aplica migrações pendentes
 */
async function migrateUp(migrationManager: MigrationManager): Promise<void> {
    if (migrationManager.hasPendingMigrations()) {
        logger.info("Aplicando migrações pendentes");
        await migrationManager.migrateUp();
        logger.info("Migrações aplicadas com sucesso");
    } else {
        logger.info("Não há migrações pendentes para aplicar");
    }
}

/**
 * Reverte a última migração
 */
async function migrateDown(migrationManager: MigrationManager): Promise<void> {
    logger.info("Revertendo última migração");
    await migrationManager.migrateDown();
}

/**
 * Verifica o estado das migrações
 */
async function checkStatus(migrationManager: MigrationManager): Promise<void> {
    const hasPending = migrationManager.hasPendingMigrations();

    if (hasPending) {
        logger.info("Existem migrações pendentes para serem aplicadas");
    } else {
        logger.info("Todas as migrações foram aplicadas");
    }

    // Exibe a lista de migrações
    await listMigrations(migrationManager);
}
