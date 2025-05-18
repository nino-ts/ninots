/**
 * Inicialização do banco de dados para o Ninots
 */

import databaseConfig from "../config/database";
import { AbstractModel } from "ninorm/src/Core/Model/AbstractModel";
import { DriverInterface } from "ninorm/src/Core/Contracts/DriverInterface";

/**
 * Classe adaptadora para gerenciar a conexão com o banco de dados
 */
export class DatabaseAdapter {
    constructor(private driver: DriverInterface) {}

    /**
     * Conecta ao banco de dados
     */
    async connect(): Promise<void> {
        return this.driver.connect();
    }

    /**
     * Desconecta do banco de dados
     */
    async disconnect(): Promise<void> {
        return this.driver.disconnect();
    }

    /**
     * Obtém o driver de banco de dados ativo
     */
    getDriver(): DriverInterface {
        return this.driver;
    }
}

/**
 * Inicializa a conexão com o banco de dados
 * @returns Um adaptador de banco de dados configurado
 */
export async function initDatabase(): Promise<DatabaseAdapter> {
    const connection = databaseConfig.connections[databaseConfig.default];
    const driver = connection.driver;

    // Configura o driver global para os modelos
    AbstractModel.useDriver(driver);

    // Conecta ao banco de dados
    await driver.connect();

    const adapter = new DatabaseAdapter(driver);
    return adapter;
}

/**
 * Fecha a conexão com o banco de dados
 * @param adapter O adaptador de banco de dados a ser fechado
 */
export async function closeDatabase(adapter: DatabaseAdapter): Promise<void> {
    await adapter.disconnect();
}
