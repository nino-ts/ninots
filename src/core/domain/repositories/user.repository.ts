/**
 * Interface para o repositório de usuários
 */

import { User } from "../entities/user.entity";
import { Repository } from "./repository.interface";

/**
 * Interface que define as operações específicas para o repositório de usuários
 */
export interface UserRepository extends Repository<User, number> {
    /**
     * Encontra um usuário pelo seu email
     * @param email O email do usuário
     * @returns Promise que resolve para o usuário ou null se não encontrado
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Encontra usuários cujo nome contém o termo de busca
     * @param search Termo de busca
     * @returns Promise que resolve para um array de usuários
     */
    findByNameContaining(search: string): Promise<User[]>;
}
