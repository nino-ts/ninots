/**
 * Configuração de banco de dados para o Ninots
 */

import type { DriverInterface } from "ninorm/src/Core/Contracts/DriverInterface";
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

    /**
     * Configurações para migrações
     */
    migrations: {
        /**
         * Habilita a geração e aplicação automática de migrações
         * baseadas em mudanças nos modelos
         */
        autoMigrate: false,

        /**
         * Diretório onde as migrações são armazenadas
         */
        directory: "src/core/infrastructure/migrations",

        /**
         * Se deve aplicar migrações automaticamente na inicialização
         */
        autoRun: true,
    },
};
