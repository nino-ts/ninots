/**
 * Caso de uso para criação de usuário
 */

import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { eventBus } from "../../domain/events/event-bus";
import { Inject } from "../../../container";
import { Command } from "../commands/command-bus";
import {
    Validator,
    NotEmptyValidation,
    EmailValidation,
} from "../../infrastructure/validation/validation.strategy";

/**
 * DTO para criação de usuário
 */
export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
}

/**
 * Comando para criar um usuário
 */
export class CreateUserCommand implements Command<User> {
    /**
     * Construtor do comando
     * @param userData Dados para criar o usuário
     */
    constructor(public readonly userData: CreateUserDto) {}

    /**
     * Repositório de usuários injetado via decorator
     */
    @Inject("UserRepository")
    private userRepository!: UserRepository;

    /**
     * Executa o comando de criação de usuário
     * @returns O usuário criado
     */
    async execute(): Promise<User> {
        // Validar os dados de entrada
        this.validateUserData();

        // Verificar se o email já está em uso
        const existingUser = await this.userRepository.findByEmail(
            this.userData.email
        );

        if (existingUser) {
            throw new Error(`Email já está em uso: ${this.userData.email}`);
        }

        // Criar a entidade de usuário
        const user = new User();
        user.name = this.userData.name;
        user.email = this.userData.email;

        // Hash da senha (numa aplicação real)
        user.password = this.userData.password; // Simplificado para exemplo

        // Salvar o usuário
        await this.userRepository.save(user);

        // Publicar evento de usuário criado
        await eventBus.publish("user.created", user);

        return user;
    }

    /**
     * Valida os dados de entrada do usuário
     * @throws Error se a validação falhar
     */
    private validateUserData(): void {
        // Validar nome
        const nameValidator = new Validator<string>().addStrategy(
            new NotEmptyValidation("name")
        );

        if (!nameValidator.validate(this.userData.name)) {
            throw new Error(nameValidator.getErrors().join(", "));
        }

        // Validar email
        const emailValidator = new Validator<string>()
            .addStrategy(new NotEmptyValidation("email"))
            .addStrategy(new EmailValidation("email"));

        if (!emailValidator.validate(this.userData.email)) {
            throw new Error(emailValidator.getErrors().join(", "));
        }

        // Validar senha
        const passwordValidator = new Validator<string>().addStrategy(
            new NotEmptyValidation("password")
        );

        if (!passwordValidator.validate(this.userData.password)) {
            throw new Error(passwordValidator.getErrors().join(", "));
        }
    }
}
