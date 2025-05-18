/**
 * Entidade base para o Ninots
 * Estende a classe AbstractModel do Ninorm
 */

import { AbstractModel } from "ninorm/src/Core/Model/AbstractModel";

/**
 * Classe base para todas as entidades do Ninots
 * Fornece funcionalidades adicionais específicas do framework
 */
export abstract class BaseEntity extends AbstractModel {
    /**
     * Carimbo de data de criação
     */
    createdAt?: Date;

    /**
     * Carimbo de data de atualização
     */
    updatedAt?: Date;

    /**
     * Atualiza os carimbos de data antes de salvar
     * @returns Promise resolvida após o salvamento
     */
    async save(): Promise<void> {
        const now = new Date();

        if (!this.createdAt) {
            this.createdAt = now;
        }

        this.updatedAt = now;

        return super.save();
    }

    /**
     * Serializa a entidade para um objeto simples
     * @returns Um objeto representando a entidade
     */
    toJSON(): Record<string, any> {
        const obj: Record<string, any> = {};

        // Obtém todas as propriedades enumeráveis
        for (const key in this) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                obj[key] = this[key];
            }
        }

        return obj;
    }
}
