/**
 * Gerenciador de transações para o Ninots
 */

import { TransactionInterface } from "ninorm/src/Core/Contracts/TransactionInterface";
import { DriverInterface } from "ninorm/src/Core/Contracts/DriverInterface";

/**
 * Gerenciador de transações para o Ninots
 * Fornece um wrapper para transações do Ninorm
 */
export class TransactionManager {
    /**
     * Cria um novo gerenciador de transações
     * @param driver Driver de banco de dados a ser usado
     */
    constructor(private driver: DriverInterface) {}

    /**
     * Executa uma operação em uma transação
     * @param callback Função a ser executada dentro da transação
     * @returns O resultado da função de callback
     * @throws Qualquer erro ocorrido durante a transação
     */
    async transaction<T>(
        callback: (transaction: TransactionInterface) => Promise<T>
    ): Promise<T> {
        const transaction = await this.driver.beginTransaction();

        try {
            const result = await callback(transaction);
            await transaction.commit();
            return result;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
