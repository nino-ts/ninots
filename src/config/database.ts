/**
 * Configuração de banco de dados para o Ninots
 */

import { DriverInterface } from "ninorm/src/Core/Contracts/DriverInterface";
import { SQLiteDriver } from "ninorm/src/Infrastructure/Database/Driver/SQLite/SQLiteDriver";

/**
 * Cria um driver SQLite
 * @param filename Nome do arquivo do banco de dados
 * @returns Uma instância do driver SQLite
 */
function createSQLiteDriver(filename: string = ":memory:"): DriverInterface {
    return new SQLiteDriver(filename);
}

export default {
    /**
     * Conexão padrão a ser utilizada
     */
    default: "sqlite",

    /**
     * Configurações de conexões disponíveis
     */
    connections: {
        /**
         * Configuração para SQLite
         */
        sqlite: {
            driver: createSQLiteDriver("./database.sqlite"),
        },
    },
};
