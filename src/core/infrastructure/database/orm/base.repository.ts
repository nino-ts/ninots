/**
 * Implementação base para repositórios usando o Ninorm
 */

import { AbstractModel } from "ninorm/src/Core/Model/AbstractModel";
import { QueryBuilder } from "ninorm/src/Core/Query/QueryBuilder";
import { Repository } from "../../../domain/repositories/repository.interface";

/**
 * Implementação base de repositório que utiliza o Ninorm
 * @template T Tipo da entidade que estende AbstractModel
 * @template ID Tipo do identificador
 */
export abstract class BaseRepository<
    T extends AbstractModel,
    ID = number | string
> implements Repository<T, ID>
{
    /**
     * Construtor do repositório base
     * @param entityClass Classe de entidade
     */
    constructor(protected entityClass: (new () => T) & typeof AbstractModel) {}

    /**
     * Cria um construtor de consultas para a entidade
     * @returns Um QueryBuilder configurado para a entidade
     */
    protected createQueryBuilder(): QueryBuilder<T> {
        return this.entityClass.createQueryBuilder();
    }

    /**
     * Encontra uma entidade por seu ID
     * @param id ID da entidade
     * @returns A entidade encontrada ou null
     */
    async findById(id: ID): Promise<T | null> {
        return this.entityClass.findById(id as any);
    }

    /**
     * Encontra todas as entidades
     * @returns Array com todas as entidades
     */
    async findAll(): Promise<T[]> {
        return this.createQueryBuilder().get();
    }

    /**
     * Salva uma entidade no banco de dados
     * @param entity Entidade a ser salva
     * @returns A entidade salva
     */
    async save(entity: T): Promise<T> {
        await entity.save();
        return entity;
    }

    /**
     * Remove uma entidade do banco de dados
     * @param id ID da entidade a ser removida
     */
    async remove(id: ID): Promise<void> {
        const entity = await this.findById(id);
        if (entity) {
            await entity.delete();
        }
    }
}
