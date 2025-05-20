/**
 * Sistema de migração de banco de dados para o Ninots
 *
 * Este módulo integra o NinORM com o Ninots para gerenciar migrações
 * de banco de dados de forma automática ou manual.
 */

import { DriverInterface } from "ninorm/src/Core/Contracts/DriverInterface";
import { AbstractModel } from "ninorm/src/Core/Model/AbstractModel";
import { LoggerFactory } from "../core/infrastructure/logging/logger-factory";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join, basename } from "path";
import { createHash } from "crypto";

/**
 * Logger para o sistema de migrações
 */
const logger = LoggerFactory.create("migrations");

/**
 * Interface para migração
 */
export interface Migration {
    /**
     * Identificador único da migração
     */
    id: string;

    /**
     * Nome da migração
     */
    name: string;

    /**
     * Data de criação da migração
     */
    timestamp: number;

    /**
     * Método para aplicar a migração
     */
    up(driver: DriverInterface): Promise<void>;

    /**
     * Método para reverter a migração
     */
    down(driver: DriverInterface): Promise<void>;
}

/**
 * Interface para metadados de migração
 */
interface MigrationMetadata {
    id: string;
    name: string;
    timestamp: number;
    applied: boolean;
    appliedAt?: number;
    hash: string;
}

/**
 * Gerenciador de migrações
 */
export class MigrationManager {
    private driver: DriverInterface;
    private migrationsDir: string;
    private migrations: Migration[] = [];
    private appliedMigrations: Record<string, MigrationMetadata> = {};

    /**
     * Construtor do gerenciador de migrações
     * @param driver Driver de banco de dados
     * @param migrationsDir Diretório das migrações
     */
    constructor(
        driver: DriverInterface,
        migrationsDir: string = "./src/core/infrastructure/migrations"
    ) {
        this.driver = driver;
        this.migrationsDir = migrationsDir;
    }

    /**
     * Inicializa o gerenciador de migrações
     */
    async initialize(): Promise<void> {
        logger.info("Inicializando gerenciador de migrações");

        // Verifica se a tabela de migrações existe
        await this.ensureMigrationsTable();

        // Carrega as migrações do diretório
        await this.loadMigrations();

        // Carrega o estado das migrações do banco de dados
        await this.loadMigrationState();

        logger.info(
            `${
                Object.keys(this.appliedMigrations).length
            } migrações encontradas`
        );
    }

    /**
     * Garante que a tabela de migrações existe
     */
    private async ensureMigrationsTable(): Promise<void> {
        logger.debug("Verificando tabela de migrações");

        const tableExists = await this.driver.tableExists("_migrations");

        if (!tableExists) {
            logger.info("Criando tabela de migrações");

            await this.driver.execute(`
                CREATE TABLE _migrations (
                    id VARCHAR(36) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    timestamp BIGINT NOT NULL,
                    applied_at BIGINT NOT NULL,
                    hash VARCHAR(64) NOT NULL
                )
            `);
        }
    }

    /**
     * Carrega as migrações do diretório
     */
    private async loadMigrations(): Promise<void> {
        try {
            // Verifica se o diretório existe
            const files = readdirSync(this.migrationsDir)
                .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
                .sort();

            // Carrega cada arquivo de migração
            for (const file of files) {
                try {
                    const filePath = join(this.migrationsDir, file);
                    const migrationModule = await import(filePath);
                    const migration = migrationModule.default as Migration;

                    if (!migration || !migration.up || !migration.down) {
                        logger.warn(`Arquivo de migração inválido: ${file}`);
                        continue;
                    }

                    this.migrations.push(migration);

                    // Calcula o hash do arquivo
                    const fileContent = readFileSync(filePath, "utf8");
                    const hash = createHash("sha256")
                        .update(fileContent)
                        .digest("hex");

                    // Cria ou atualiza metadados
                    this.appliedMigrations[migration.id] = {
                        id: migration.id,
                        name: migration.name,
                        timestamp: migration.timestamp,
                        applied: false,
                        hash: hash,
                    };
                } catch (error) {
                    logger.error(`Erro ao carregar migração ${file}:`, {
                        error,
                    });
                }
            }
        } catch (error) {
            logger.error("Erro ao carregar migrações:", { error });
        }
    }

    /**
     * Carrega o estado das migrações do banco de dados
     */
    private async loadMigrationState(): Promise<void> {
        try {
            const result = await this.driver.query(
                "SELECT * FROM _migrations ORDER BY timestamp ASC"
            );

            for (const row of result) {
                const id = row.id;

                // Atualiza o estado da migração se já carregamos do arquivo
                if (this.appliedMigrations[id]) {
                    this.appliedMigrations[id].applied = true;
                    this.appliedMigrations[id].appliedAt = row.applied_at;
                } else {
                    // Migração existe no banco mas não no arquivo
                    this.appliedMigrations[id] = {
                        id: row.id,
                        name: row.name,
                        timestamp: row.timestamp,
                        applied: true,
                        appliedAt: row.applied_at,
                        hash: row.hash,
                    };

                    logger.warn(
                        `Migração ${row.name} existe no banco de dados mas não foi encontrada no diretório`
                    );
                }
            }
        } catch (error) {
            logger.error("Erro ao carregar estado das migrações:", { error });
        }
    }

    /**
     * Verifica se existem migrações pendentes
     */
    hasPendingMigrations(): boolean {
        return this.migrations.some(
            (migration) => !this.appliedMigrations[migration.id]?.applied
        );
    }

    /**
     * Lista todas as migrações
     */
    listMigrations(): MigrationMetadata[] {
        return Object.values(this.appliedMigrations).sort(
            (a, b) => a.timestamp - b.timestamp
        );
    }

    /**
     * Aplica todas as migrações pendentes
     */
    async migrateUp(): Promise<void> {
        logger.info("Aplicando migrações pendentes");

        // Filtra migrações que não foram aplicadas
        const pendingMigrations = this.migrations
            .filter(
                (migration) => !this.appliedMigrations[migration.id]?.applied
            )
            .sort((a, b) => a.timestamp - b.timestamp);

        if (pendingMigrations.length === 0) {
            logger.info("Não há migrações pendentes");
            return;
        }

        logger.info(
            `${pendingMigrations.length} migrações pendentes para aplicar`
        );

        // Aplica cada migração pendente
        for (const migration of pendingMigrations) {
            try {
                logger.info(`Aplicando migração: ${migration.name}`);

                // Executa a migração
                await migration.up(this.driver);

                // Registra a migração aplicada
                const now = Date.now();
                await this.driver.execute(
                    "INSERT INTO _migrations (id, name, timestamp, applied_at, hash) VALUES (?, ?, ?, ?, ?)",
                    [
                        migration.id,
                        migration.name,
                        migration.timestamp,
                        now,
                        this.appliedMigrations[migration.id]?.hash || "",
                    ]
                );

                // Atualiza o estado em memória
                this.appliedMigrations[migration.id] = {
                    ...this.appliedMigrations[migration.id],
                    applied: true,
                    appliedAt: now,
                };

                logger.info(`Migração aplicada com sucesso: ${migration.name}`);
            } catch (error) {
                logger.error(`Erro ao aplicar migração ${migration.name}:`, {
                    error,
                });
                throw new Error(
                    `Falha ao aplicar migração ${migration.name}: ${error}`
                );
            }
        }

        logger.info("Todas as migrações foram aplicadas com sucesso");
    }

    /**
     * Reverte a última migração aplicada
     */
    async migrateDown(): Promise<void> {
        logger.info("Revertendo última migração");

        // Encontra a última migração aplicada
        const appliedMigrations = this.migrations
            .filter(
                (migration) => this.appliedMigrations[migration.id]?.applied
            )
            .sort((a, b) => b.timestamp - a.timestamp);

        if (appliedMigrations.length === 0) {
            logger.info("Não há migrações para reverter");
            return;
        }

        const lastMigration = appliedMigrations[0];

        try {
            logger.info(`Revertendo migração: ${lastMigration.name}`);

            // Executa o método down
            await lastMigration.down(this.driver);

            // Remove o registro da migração
            await this.driver.execute("DELETE FROM _migrations WHERE id = ?", [
                lastMigration.id,
            ]);

            // Atualiza o estado em memória
            this.appliedMigrations[lastMigration.id] = {
                ...this.appliedMigrations[lastMigration.id],
                applied: false,
                appliedAt: undefined,
            };

            logger.info(
                `Migração revertida com sucesso: ${lastMigration.name}`
            );
        } catch (error) {
            logger.error(`Erro ao reverter migração ${lastMigration.name}:`, {
                error,
            });
            throw new Error(
                `Falha ao reverter migração ${lastMigration.name}: ${error}`
            );
        }
    }

    /**
     * Cria um novo arquivo de migração
     * @param name Nome da migração
     */
    createMigrationFile(name: string): string {
        const timestamp = Date.now();
        const safeName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
        const migrationId = `${timestamp}_${safeName}`;
        const fileName = `${migrationId}.ts`;
        const filePath = join(this.migrationsDir, fileName);

        const template = `/**
 * Migração: ${name}
 * Gerada em: ${new Date().toISOString()}
 */
import { DriverInterface } from "ninorm/src/Core/Contracts/DriverInterface";
import { Migration } from "../../../bootstrap/migrations";

const migration: Migration = {
    id: "${migrationId}",
    name: "${name}",
    timestamp: ${timestamp},
    
    async up(driver: DriverInterface): Promise<void> {
        // Implemente a migração aqui
        // Exemplo:
        // await driver.execute(\`
        //     CREATE TABLE users (
        //         id INTEGER PRIMARY KEY,
        //         name TEXT NOT NULL,
        //         email TEXT UNIQUE NOT NULL
        //     )
        // \`);
    },
    
    async down(driver: DriverInterface): Promise<void> {
        // Implemente a reversão da migração aqui
        // Exemplo:
        // await driver.execute(\`DROP TABLE IF EXISTS users\`);
    }
};

export default migration;
`;

        writeFileSync(filePath, template, "utf8");
        logger.info(`Migração criada: ${fileName}`);

        return filePath;
    }
}

/**
 * Função auxiliar para gerar um esquema a partir dos modelos
 * @param driver Driver de banco de dados
 * @returns String com SQL para criação das tabelas
 */
export async function generateSchemaFromModels(
    driver: DriverInterface
): Promise<string> {
    // Este é um exemplo simplificado, na implementação real
    // seria preciso analisar os metadados dos modelos e gerar o esquema

    return "-- Esquema gerado automaticamente\n";
}
