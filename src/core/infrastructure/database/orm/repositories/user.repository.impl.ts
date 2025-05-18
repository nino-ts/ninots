/**
 * Implementação do repositório de usuários
 */

import { User } from "../../../domain/entities/user.entity";
import { UserRepository } from "../../../domain/repositories/user.repository";
import { BaseRepository } from "./base.repository";

/**
 * Implementação do repositório de usuários usando o Ninorm
 */
export class UserRepositoryImpl
    extends BaseRepository<User>
    implements UserRepository
{
    /**
     * Cria uma nova instância do repositório de usuários
     */
    constructor() {
        super(User);
    }

    /**
     * Encontra um usuário pelo seu email
     * @param email Email do usuário
     * @returns O usuário encontrado ou null
     */
    async findByEmail(email: string): Promise<User | null> {
        const results = await this.createQueryBuilder()
            .where("email", "=", email)
            .limit(1)
            .get();

        return results[0] || null;
    }

    /**
     * Encontra usuários cujo nome contém o termo de busca
     * @param search Termo de busca
     * @returns Array de usuários correspondentes
     */
    async findByNameContaining(search: string): Promise<User[]> {
        return this.createQueryBuilder()
            .where("name", "LIKE", `%${search}%`)
            .get();
    }
}
