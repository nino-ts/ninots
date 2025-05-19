/**
 * Repository Factory - Implementação do Factory Pattern
 *
 * Este módulo fornece uma fábrica genérica para criar repositórios,
 * seguindo o princípio Factory Pattern.
 */

import { Repository } from "../core/domain/repositories/repository.interface";
import { BaseEntity } from "../core/domain/entities/base.entity";
import { container } from "./index";

/**
 * Fábrica de Repositórios
 * Implementa o padrão Factory para criar instâncias de repositórios
 */
export class RepositoryFactory {
    /**
     * Cria um repositório para a entidade especificada
     * @param token Token de identificação do repositório no container
     * @returns Uma instância do repositório
     */
    public static create<T extends BaseEntity, ID = number | string>(
        token: string
    ): Repository<T, ID> {
        // Resolver o repositório do container de DI
        if (!container.has(token)) {
            throw new Error(
                `Repositório não registrado para o token: ${token}`
            );
        }

        return container.resolve<Repository<T, ID>>(token);
    }
}
