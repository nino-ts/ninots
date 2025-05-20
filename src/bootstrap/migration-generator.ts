/**
 * Gerador automático de migrações para ninorm
 */

import { AbstractModel } from "ninorm/src/Core/Model/AbstractModel";
import { DriverInterface } from "ninorm/src/Core/Contracts/DriverInterface";
import { LoggerFactory } from "../core/infrastructure/logging/logger-factory";
import { Migration, MigrationManager } from "./migrations";
import * as path from "node:path";
import * as fs from "node:fs";

const logger = LoggerFactory.create("migration-generator");

/**
 * Interface para representar um schema da base de dados
 */
interface DatabaseSchema {
    tables: Map<string, TableSchema>;
}

/**
 * Interface para representar o schema de uma tabela
 */
interface TableSchema {
    name: string;
    columns: Map<string, ColumnSchema>;
    primaryKeys: string[];
    foreignKeys: ForeignKeySchema[];
    indexes: IndexSchema[];
}

/**
 * Interface para representar o schema de uma coluna
 */
interface ColumnSchema {
    name: string;
    type: string;
    nullable: boolean;
    defaultValue?: string;
}

/**
 * Interface para representar um índice
 */
interface IndexSchema {
    name: string;
    columns: string[];
    unique: boolean;
}

/**
 * Interface para representar uma chave estrangeira
 */
interface ForeignKeySchema {
    name: string;
    columns: string[];
    referencedTable: string;
    referencedColumns: string[];
    onDelete?: string;
    onUpdate?: string;
}

/**
 * Tipo para representar diferentes operações de alteração de schema
 */
type SchemaChange =
    | { type: "create_table"; table: TableSchema }
    | { type: "drop_table"; tableName: string }
    | { type: "add_column"; tableName: string; column: ColumnSchema }
    | { type: "drop_column"; tableName: string; columnName: string }
    | {
          type: "modify_column";
          tableName: string;
          column: ColumnSchema;
          oldColumn: ColumnSchema;
      }
    | { type: "add_index"; tableName: string; index: IndexSchema }
    | { type: "drop_index"; tableName: string; indexName: string }
    | {
          type: "add_foreign_key";
          tableName: string;
          foreignKey: ForeignKeySchema;
      }
    | { type: "drop_foreign_key"; tableName: string; foreignKeyName: string };

/**
 * Classe para geração automática de migrações
 */
export class MigrationGenerator {
    private driver: DriverInterface;
    private migrationsDir: string;
    private migrationManager: MigrationManager;

    constructor(
        driver: DriverInterface,
        migrationsDir: string,
        migrationManager: MigrationManager
    ) {
        this.driver = driver;
        this.migrationsDir = migrationsDir;
        this.migrationManager = migrationManager;
    }

    /**
     * Lê o schema atual do banco de dados
     */
    public async getCurrentDatabaseSchema(): Promise<DatabaseSchema> {
        logger.info("Lendo schema atual do banco de dados");

        const schema: DatabaseSchema = {
            tables: new Map<string, TableSchema>(),
        };

        try {
            // Obter todas as tabelas
            const tables = await this.driver.getTables();

            // Para cada tabela, obter detalhes
            for (const tableName of tables) {
                // Ignorar tabela de migrações
                if (tableName === "_migrations") continue;

                const tableInfo = await this.driver.getTableInfo(tableName);
                const columns = await this.driver.getTableColumns(tableName);
                const primaryKeys = await this.driver.getPrimaryKeys(tableName);
                const foreignKeys = await this.driver.getForeignKeys(tableName);
                const indexes = await this.driver.getIndexes(tableName);

                const table: TableSchema = {
                    name: tableName,
                    columns: new Map<string, ColumnSchema>(),
                    primaryKeys,
                    foreignKeys: foreignKeys.map((fk) => ({
                        name: fk.name,
                        columns: fk.columns,
                        referencedTable: fk.referencedTable,
                        referencedColumns: fk.referencedColumns,
                        onDelete: fk.onDelete,
                        onUpdate: fk.onUpdate,
                    })),
                    indexes: indexes.map((idx) => ({
                        name: idx.name,
                        columns: idx.columns,
                        unique: idx.unique,
                    })),
                };

                // Adicionar colunas
                for (const column of columns) {
                    table.columns.set(column.name, {
                        name: column.name,
                        type: column.type,
                        nullable: column.nullable,
                        defaultValue: column.defaultValue,
                    });
                }

                schema.tables.set(tableName, table);
            }

            logger.debug(`Lidas ${schema.tables.size} tabelas do banco`);

            return schema;
        } catch (error) {
            logger.error("Erro ao ler schema do banco de dados", { error });
            throw new Error("Falha ao ler schema do banco de dados: " + error);
        }
    }

    /**
     * Obtém schema dos modelos ninorm
     */
    public getModelSchema(): DatabaseSchema {
        logger.info("Gerando schema a partir dos modelos ninorm");

        const schema: DatabaseSchema = {
            tables: new Map<string, TableSchema>(),
        };

        try {
            // Obter todos os modelos registrados
            const models = AbstractModel.getRegisteredModels();

            // Para cada modelo, extrair o schema
            for (const modelClass of models) {
                const metadata = AbstractModel.getModelMetadata(modelClass);
                if (!metadata) continue;

                const tableName = metadata.table;
                const table: TableSchema = {
                    name: tableName,
                    columns: new Map<string, ColumnSchema>(),
                    primaryKeys: [],
                    foreignKeys: [],
                    indexes: [],
                };

                // Adicionar colunas
                for (const [propName, column] of Object.entries(
                    metadata.columns || {}
                )) {
                    table.columns.set(column.name || propName, {
                        name: column.name || propName,
                        type: this.mapColumnType(column.type),
                        nullable: column.nullable !== false,
                        defaultValue: column.default,
                    });

                    // Verificar primary key
                    if (column.primary) {
                        table.primaryKeys.push(column.name || propName);
                    }

                    // Verificar índices
                    if (column.index) {
                        const indexName =
                            typeof column.index === "string"
                                ? column.index
                                : `idx_${tableName}_${column.name || propName}`;
                        const existingIndex = table.indexes.find(
                            (idx) => idx.name === indexName
                        );

                        if (existingIndex) {
                            existingIndex.columns.push(column.name || propName);
                        } else {
                            table.indexes.push({
                                name: indexName,
                                columns: [column.name || propName],
                                unique: column.unique === true,
                            });
                        }
                    }
                }

                // Adicionar relacionamentos
                for (const [propName, relation] of Object.entries(
                    metadata.relations || {}
                )) {
                    // Obter metadados do modelo relacionado
                    const relatedModelMetadata = AbstractModel.getModelMetadata(
                        relation.type
                    );
                    if (!relatedModelMetadata) continue;

                    const relatedTableName = relatedModelMetadata.table;

                    if (
                        relation.type === "one-to-many" ||
                        relation.type === "many-to-one"
                    ) {
                        // Para relacionamentos many-to-one, adicionar chave estrangeira
                        if (relation.type === "many-to-one") {
                            const foreignKeyName = `fk_${tableName}_${relation.referencedColumn}_${relatedTableName}`;
                            table.foreignKeys.push({
                                name: foreignKeyName,
                                columns: [relation.referencedColumn],
                                referencedTable: relatedTableName,
                                referencedColumns: [relation.targetColumn],
                                onDelete: relation.onDelete,
                                onUpdate: relation.onUpdate,
                            });
                        }
                    }
                }

                schema.tables.set(tableName, table);
            }

            logger.debug(
                `Geradas ${schema.tables.size} tabelas a partir dos modelos`
            );

            return schema;
        } catch (error) {
            logger.error("Erro ao gerar schema a partir dos modelos", {
                error,
            });
            throw new Error(
                "Falha ao gerar schema a partir dos modelos: " + error
            );
        }
    }

    /**
     * Mapeia tipos de coluna do ninorm para tipos SQL
     */
    private mapColumnType(type: string | undefined): string {
        if (!type) return "TEXT";

        switch (type.toLowerCase()) {
            case "string":
                return "TEXT";
            case "number":
                return "INTEGER";
            case "boolean":
                return "BOOLEAN";
            case "date":
                return "TIMESTAMP";
            case "object":
                return "JSON";
            case "array":
                return "JSON";
            default:
                return type;
        }
    }

    /**
     * Compara schemas para detectar mudanças
     */
    public compareSchemas(
        currentSchema: DatabaseSchema,
        targetSchema: DatabaseSchema
    ): SchemaChange[] {
        logger.info("Comparando schemas para detectar mudanças");

        const changes: SchemaChange[] = [];

        // Verificar tabelas que existem no destino mas não no atual (criar)
        for (const [tableName, table] of targetSchema.tables.entries()) {
            if (!currentSchema.tables.has(tableName)) {
                changes.push({ type: "create_table", table });
                continue;
            }

            const currentTable = currentSchema.tables.get(tableName)!;

            // Verificar colunas a adicionar
            for (const [columnName, column] of table.columns.entries()) {
                if (!currentTable.columns.has(columnName)) {
                    changes.push({ type: "add_column", tableName, column });
                } else {
                    // Verificar alterações na coluna
                    const currentColumn = currentTable.columns.get(columnName)!;
                    if (
                        column.type !== currentColumn.type ||
                        column.nullable !== currentColumn.nullable ||
                        column.defaultValue !== currentColumn.defaultValue
                    ) {
                        changes.push({
                            type: "modify_column",
                            tableName,
                            column,
                            oldColumn: currentColumn,
                        });
                    }
                }
            }

            // Verificar colunas a remover
            for (const columnName of currentTable.columns.keys()) {
                if (!table.columns.has(columnName)) {
                    changes.push({
                        type: "drop_column",
                        tableName,
                        columnName,
                    });
                }
            }

            // Verificar índices a adicionar
            for (const index of table.indexes) {
                const currentIndex = currentTable.indexes.find(
                    (idx) => idx.name === index.name
                );
                if (!currentIndex) {
                    changes.push({ type: "add_index", tableName, index });
                }
            }

            // Verificar índices a remover
            for (const currentIndex of currentTable.indexes) {
                const index = table.indexes.find(
                    (idx) => idx.name === currentIndex.name
                );
                if (!index) {
                    changes.push({
                        type: "drop_index",
                        tableName,
                        indexName: currentIndex.name,
                    });
                }
            }

            // Verificar chaves estrangeiras a adicionar
            for (const foreignKey of table.foreignKeys) {
                const currentForeignKey = currentTable.foreignKeys.find(
                    (fk) => fk.name === foreignKey.name
                );
                if (!currentForeignKey) {
                    changes.push({
                        type: "add_foreign_key",
                        tableName,
                        foreignKey,
                    });
                }
            }

            // Verificar chaves estrangeiras a remover
            for (const currentForeignKey of currentTable.foreignKeys) {
                const foreignKey = table.foreignKeys.find(
                    (fk) => fk.name === currentForeignKey.name
                );
                if (!foreignKey) {
                    changes.push({
                        type: "drop_foreign_key",
                        tableName,
                        foreignKeyName: currentForeignKey.name,
                    });
                }
            }
        }

        // Verificar tabelas que existem no atual mas não no destino (remover)
        for (const tableName of currentSchema.tables.keys()) {
            if (!targetSchema.tables.has(tableName)) {
                changes.push({ type: "drop_table", tableName });
            }
        }

        logger.debug(`Detectadas ${changes.length} mudanças no schema`);

        return changes;
    }

    /**
     * Gera SQL para as alterações detectadas
     */
    public generateSql(changes: SchemaChange[]): {
        upSql: string;
        downSql: string;
    } {
        logger.info("Gerando SQL para as mudanças detectadas");

        let upSql = "";
        let downSql = "";

        // Agrupar mudanças para processar em ordem correta
        const createTables = changes.filter(
            (change) => change.type === "create_table"
        );
        const dropTables = changes.filter(
            (change) => change.type === "drop_table"
        );
        const addColumns = changes.filter(
            (change) => change.type === "add_column"
        );
        const dropColumns = changes.filter(
            (change) => change.type === "drop_column"
        );
        const modifyColumns = changes.filter(
            (change) => change.type === "modify_column"
        );
        const addIndexes = changes.filter(
            (change) => change.type === "add_index"
        );
        const dropIndexes = changes.filter(
            (change) => change.type === "drop_index"
        );
        const addForeignKeys = changes.filter(
            (change) => change.type === "add_foreign_key"
        );
        const dropForeignKeys = changes.filter(
            (change) => change.type === "drop_foreign_key"
        );

        // Processar na ordem correta para migração up

        // 1. Drop foreign keys (para evitar conflitos)
        for (const change of dropForeignKeys) {
            upSql += this.generateDropForeignKeySQL(
                change as {
                    type: "drop_foreign_key";
                    tableName: string;
                    foreignKeyName: string;
                }
            );
            downSql =
                this.generateAddForeignKeySQL(
                    change as {
                        type: "drop_foreign_key";
                        tableName: string;
                        foreignKeyName: string;
                    }
                ) + downSql;
        }

        // 2. Drop indexes
        for (const change of dropIndexes) {
            upSql += this.generateDropIndexSQL(
                change as {
                    type: "drop_index";
                    tableName: string;
                    indexName: string;
                }
            );
            downSql =
                this.generateAddIndexSQL(
                    change as {
                        type: "drop_index";
                        tableName: string;
                        indexName: string;
                    }
                ) + downSql;
        }

        // 3. Drop columns
        for (const change of dropColumns) {
            upSql += this.generateDropColumnSQL(
                change as {
                    type: "drop_column";
                    tableName: string;
                    columnName: string;
                }
            );
            downSql =
                this.generateAddColumnSQL(
                    change as {
                        type: "drop_column";
                        tableName: string;
                        columnName: string;
                    }
                ) + downSql;
        }

        // 4. Create tables
        for (const change of createTables) {
            upSql += this.generateCreateTableSQL(
                change as { type: "create_table"; table: TableSchema }
            );
            downSql =
                this.generateDropTableSQL(
                    change as { type: "create_table"; table: TableSchema }
                ) + downSql;
        }

        // 5. Add/modify columns
        for (const change of addColumns) {
            upSql += this.generateAddColumnSQL(
                change as {
                    type: "add_column";
                    tableName: string;
                    column: ColumnSchema;
                }
            );
            downSql =
                this.generateDropColumnSQL(
                    change as {
                        type: "add_column";
                        tableName: string;
                        column: ColumnSchema;
                    }
                ) + downSql;
        }

        for (const change of modifyColumns) {
            upSql += this.generateModifyColumnSQL(
                change as {
                    type: "modify_column";
                    tableName: string;
                    column: ColumnSchema;
                    oldColumn: ColumnSchema;
                }
            );
            downSql =
                this.generateModifyColumnSQL({
                    type: "modify_column",
                    tableName: (
                        change as {
                            type: "modify_column";
                            tableName: string;
                            column: ColumnSchema;
                            oldColumn: ColumnSchema;
                        }
                    ).tableName,
                    column: (
                        change as {
                            type: "modify_column";
                            tableName: string;
                            column: ColumnSchema;
                            oldColumn: ColumnSchema;
                        }
                    ).oldColumn,
                    oldColumn: (
                        change as {
                            type: "modify_column";
                            tableName: string;
                            column: ColumnSchema;
                            oldColumn: ColumnSchema;
                        }
                    ).column,
                }) + downSql;
        }

        // 6. Add indexes
        for (const change of addIndexes) {
            upSql += this.generateAddIndexSQL(
                change as {
                    type: "add_index";
                    tableName: string;
                    index: IndexSchema;
                }
            );
            downSql =
                this.generateDropIndexSQL(
                    change as {
                        type: "add_index";
                        tableName: string;
                        index: IndexSchema;
                    }
                ) + downSql;
        }

        // 7. Add foreign keys
        for (const change of addForeignKeys) {
            upSql += this.generateAddForeignKeySQL(
                change as {
                    type: "add_foreign_key";
                    tableName: string;
                    foreignKey: ForeignKeySchema;
                }
            );
            downSql =
                this.generateDropForeignKeySQL(
                    change as {
                        type: "add_foreign_key";
                        tableName: string;
                        foreignKey: ForeignKeySchema;
                    }
                ) + downSql;
        }

        // 8. Drop tables (no final para evitar conflitos)
        for (const change of dropTables) {
            upSql += this.generateDropTableSQL(
                change as { type: "drop_table"; tableName: string }
            );
            downSql =
                this.generateCreateTableSQL(
                    change as { type: "drop_table"; tableName: string }
                ) + downSql;
        }

        logger.debug(
            `SQL gerado: ${upSql.split("\n").length} linhas (up) e ${
                downSql.split("\n").length
            } linhas (down)`
        );

        return { upSql, downSql };
    }

    // Métodos auxiliares para gerar SQL

    private generateCreateTableSQL(change: {
        type: "create_table";
        table: TableSchema;
    }): string {
        const { table } = change;
        let sql = `CREATE TABLE ${table.name} (\n`;

        // Adicionar colunas
        const columnDefs = Array.from(table.columns.values()).map((column) => {
            let def = `  ${column.name} ${column.type}`;
            if (!column.nullable) def += " NOT NULL";
            if (column.defaultValue) def += ` DEFAULT ${column.defaultValue}`;
            return def;
        });

        // Adicionar primary key
        if (table.primaryKeys.length > 0) {
            columnDefs.push(`  PRIMARY KEY (${table.primaryKeys.join(", ")})`);
        }

        sql += columnDefs.join(",\n");
        sql += "\n);\n\n";

        return sql;
    }

    private generateDropTableSQL(
        change:
            | { type: "drop_table"; tableName: string }
            | { type: "create_table"; table: TableSchema }
    ): string {
        const tableName =
            "tableName" in change ? change.tableName : change.table.name;
        return `DROP TABLE IF EXISTS ${tableName};\n\n`;
    }

    private generateAddColumnSQL(
        change:
            | { type: "add_column"; tableName: string; column: ColumnSchema }
            | { type: "drop_column"; tableName: string; columnName: string }
    ): string {
        if ("column" in change) {
            const { tableName, column } = change;
            let sql = `ALTER TABLE ${tableName} ADD COLUMN ${column.name} ${column.type}`;
            if (!column.nullable) sql += " NOT NULL";
            if (column.defaultValue) sql += ` DEFAULT ${column.defaultValue}`;
            return sql + ";\n\n";
        }
        return "";
    }

    private generateDropColumnSQL(
        change:
            | { type: "drop_column"; tableName: string; columnName: string }
            | { type: "add_column"; tableName: string; column: ColumnSchema }
    ): string {
        if ("columnName" in change) {
            const { tableName, columnName } = change;
            return `ALTER TABLE ${tableName} DROP COLUMN ${columnName};\n\n`;
        } else {
            const { tableName, column } = change;
            return `ALTER TABLE ${tableName} DROP COLUMN ${column.name};\n\n`;
        }
    }

    private generateModifyColumnSQL(change: {
        type: "modify_column";
        tableName: string;
        column: ColumnSchema;
        oldColumn: ColumnSchema;
    }): string {
        const { tableName, column } = change;
        let sql = `ALTER TABLE ${tableName} MODIFY COLUMN ${column.name} ${column.type}`;
        if (!column.nullable) sql += " NOT NULL";
        if (column.defaultValue) sql += ` DEFAULT ${column.defaultValue}`;
        return sql + ";\n\n";
    }

    private generateAddIndexSQL(
        change:
            | { type: "add_index"; tableName: string; index: IndexSchema }
            | { type: "drop_index"; tableName: string; indexName: string }
    ): string {
        if ("index" in change) {
            const { tableName, index } = change;
            return `CREATE ${index.unique ? "UNIQUE " : ""}INDEX ${
                index.name
            } ON ${tableName} (${index.columns.join(", ")});\n\n`;
        }
        return "";
    }

    private generateDropIndexSQL(
        change:
            | { type: "drop_index"; tableName: string; indexName: string }
            | { type: "add_index"; tableName: string; index: IndexSchema }
    ): string {
        if ("indexName" in change) {
            const { indexName } = change;
            return `DROP INDEX IF EXISTS ${indexName};\n\n`;
        } else {
            const { index } = change;
            return `DROP INDEX IF EXISTS ${index.name};\n\n`;
        }
    }

    private generateAddForeignKeySQL(
        change:
            | {
                  type: "add_foreign_key";
                  tableName: string;
                  foreignKey: ForeignKeySchema;
              }
            | {
                  type: "drop_foreign_key";
                  tableName: string;
                  foreignKeyName: string;
              }
    ): string {
        if ("foreignKey" in change) {
            const { tableName, foreignKey } = change;
            let sql = `ALTER TABLE ${tableName} ADD CONSTRAINT ${
                foreignKey.name
            } FOREIGN KEY (${foreignKey.columns.join(", ")}) 
        REFERENCES ${
            foreignKey.referencedTable
        } (${foreignKey.referencedColumns.join(", ")})`;

            if (foreignKey.onDelete) sql += ` ON DELETE ${foreignKey.onDelete}`;
            if (foreignKey.onUpdate) sql += ` ON UPDATE ${foreignKey.onUpdate}`;

            return sql + ";\n\n";
        }
        return "";
    }

    private generateDropForeignKeySQL(
        change:
            | {
                  type: "drop_foreign_key";
                  tableName: string;
                  foreignKeyName: string;
              }
            | {
                  type: "add_foreign_key";
                  tableName: string;
                  foreignKey: ForeignKeySchema;
              }
    ): string {
        if ("foreignKeyName" in change) {
            const { tableName, foreignKeyName } = change;
            return `ALTER TABLE ${tableName} DROP CONSTRAINT ${foreignKeyName};\n\n`;
        } else {
            const { tableName, foreignKey } = change;
            return `ALTER TABLE ${tableName} DROP CONSTRAINT ${foreignKey.name};\n\n`;
        }
    }

    /**
     * Gera e aplica uma migração automaticamente
     */
    public async generateMigration(name: string): Promise<string> {
        logger.info(`Gerando migração automática: ${name}`);

        try {
            // Obter schemas atual e alvo
            const currentSchema = await this.getCurrentDatabaseSchema();
            const modelSchema = this.getModelSchema();

            // Comparar schemas
            const changes = this.compareSchemas(currentSchema, modelSchema);

            // Se não houver mudanças, retornar
            if (changes.length === 0) {
                logger.info(
                    "Nenhuma mudança detectada, não há necessidade de migração"
                );
                return "";
            }

            // Gerar SQL
            const { upSql, downSql } = this.generateSql(changes);

            // Criar arquivo de migração
            const timestamp = Date.now();
            const safeName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
            const migrationId = `${timestamp}_${safeName}`;
            const fileName = `${migrationId}.ts`;
            const filePath = path.join(this.migrationsDir, fileName);

            // Template do arquivo
            const template = `/**
 * Migração: ${name} (gerada automaticamente)
 * Gerada em: ${new Date().toISOString()}
 */
import { DriverInterface } from "ninorm/src/Core/Contracts/DriverInterface";
import { Migration } from "../../../bootstrap/migrations";

const migration: Migration = {
    id: "${migrationId}",
    name: "${name}",
    timestamp: ${timestamp},
    
    async up(driver: DriverInterface): Promise<void> {
        // Migração gerada automaticamente pelo MigrationGenerator
        ${upSql
            .split("\n")
            .map((line) => `await driver.execute(\`${line}\`);`)
            .join("\n        ")}
    },
    
    async down(driver: DriverInterface): Promise<void> {
        // Migração gerada automaticamente pelo MigrationGenerator
        ${downSql
            .split("\n")
            .map((line) => `await driver.execute(\`${line}\`);`)
            .join("\n        ")}
    }
};

export default migration;
`;

            // Garantir que o diretório existe
            if (!fs.existsSync(this.migrationsDir)) {
                fs.mkdirSync(this.migrationsDir, { recursive: true });
            }

            // Escrever o arquivo
            fs.writeFileSync(filePath, template, "utf8");

            logger.info(`Migração gerada: ${fileName}`);

            return filePath;
        } catch (error) {
            logger.error("Erro ao gerar migração automática", { error });
            throw new Error("Falha ao gerar migração: " + error);
        }
    }

    /**
     * Atualiza automaticamente o schema do banco para corresponder aos modelos
     */
    public async autoMigrate(): Promise<boolean> {
        logger.info("Iniciando auto-migração");

        try {
            // Gerar migração
            const migrationPath = await this.generateMigration(
                "auto_migration"
            );

            if (!migrationPath) {
                logger.info("Nenhuma migração necessária");
                return false;
            }

            // Aplicar migração
            await this.migrationManager.migrateUp();

            logger.info("Auto-migração aplicada com sucesso");
            return true;
        } catch (error) {
            logger.error("Erro ao aplicar auto-migração", { error });
            throw new Error("Falha ao auto-migrar: " + error);
        }
    }
}
