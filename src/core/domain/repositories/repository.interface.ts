/**
 * Interface base para repositórios
 */

/**
 * Interface genérica para repositórios
 * Define operações básicas de CRUD
 * @template T Tipo da entidade
 * @template ID Tipo do identificador
 */
export interface Repository<T, ID = number | string> {
    /**
     * Encontra uma entidade por seu identificador
     * @param id O identificador da entidade
     * @returns Promise que resolve para a entidade ou null se não encontrada
     */
    findById(id: ID): Promise<T | null>;

    /**
     * Encontra todas as entidades
     * @returns Promise que resolve para um array de entidades
     */
    findAll(): Promise<T[]>;

    /**
     * Salva uma entidade
     * @param entity A entidade a ser salva
     * @returns Promise que resolve para a entidade salva
     */
    save(entity: T): Promise<T>;

    /**
     * Remove uma entidade pelo seu identificador
     * @param id O identificador da entidade a ser removida
     * @returns Promise que resolve quando a entidade for removida
     */
    remove(id: ID): Promise<void>;
}
