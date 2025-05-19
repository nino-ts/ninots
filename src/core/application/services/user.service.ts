/**
 * Serviço de aplicação para usuários
 */

import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { Inject } from "../../../container";
import {
    LogMethod,
    Benchmark,
} from "../../../shared/decorators/method.decorators";
import { eventBus } from "../../domain/events/event-bus";

/**
 * Serviço responsável pela lógica de aplicação relacionada a usuários
 */
export class UserService {
    /**
     * Repositório de usuários injetado via decorator
     */
    @Inject("UserRepository")
    private userRepository!: UserRepository;

    /**
     * Cria um novo usuário
     * @param userData Dados do usuário
     * @returns O usuário criado
     */
    @LogMethod()
    @Benchmark()
    public async createUser(userData: {
        name: string;
        email: string;
        password: string;
    }): Promise<User> {
        // Verificar se o email já está em uso
        const existingUser = await this.userRepository.findByEmail(
            userData.email
        );

        if (existingUser) {
            throw new Error(`Email já está em uso: ${userData.email}`);
        }

        // Criar a entidade de usuário
        const user = new User();
        user.name = userData.name;
        user.email = userData.email;

        // Aqui seria feito o hash da senha em uma aplicação real
        user.password = userData.password;

        // Salvar o usuário
        await this.userRepository.save(user);

        // Publicar evento de criação de usuário
        await eventBus.publish("user.created", user);

        return user;
    }

    /**
     * Obtém um usuário pelo ID
     * @param id ID do usuário
     * @returns O usuário encontrado ou null
     */
    public async getUserById(id: number): Promise<User | null> {
        return await this.userRepository.findById(id);
    }

    /**
     * Obtém todos os usuários
     * @returns Lista de usuários
     */
    public async getAllUsers(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    /**
     * Atualiza um usuário existente
     * @param id ID do usuário
     * @param userData Dados a atualizar
     * @returns O usuário atualizado ou null se não encontrado
     */
    @LogMethod()
    public async updateUser(
        id: number,
        userData: Partial<Omit<User, "id">>
    ): Promise<User | null> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            return null;
        }

        // Atualizar os campos
        Object.assign(user, userData);

        // Salvar as alterações
        await this.userRepository.save(user);

        // Publicar evento de atualização
        await eventBus.publish("user.updated", user);

        return user;
    }

    /**
     * Remove um usuário pelo ID
     * @param id ID do usuário
     * @returns Se o usuário foi removido com sucesso
     */
    public async deleteUser(id: number): Promise<boolean> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            return false;
        }

        // Remover o usuário
        await this.userRepository.delete(id);

        // Publicar evento de remoção
        await eventBus.publish("user.deleted", { id });

        return true;
    }
}
