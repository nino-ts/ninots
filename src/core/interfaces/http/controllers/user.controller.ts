/**
 * Controlador para operações de usuário
 */

import { BaseController } from "./base.controller";
import { HttpRequest, HttpResponse } from "../middlewares/auth.middleware";
import { UserService } from "../../../application/services/user.service";
import { Inject } from "../../../../container";
import {
    CreateUserDto,
    CreateUserCommand,
} from "../../../application/use-cases/create-user.use-case";
import { commandBus } from "../../../application/commands/command-bus";

/**
 * Controlador para endpoints relacionados a usuários
 */
export class UserController extends BaseController {
    /**
     * Serviço de usuário injetado via decorator
     */
    @Inject("UserService")
    private userService!: UserService;

    /**
     * Executa a lógica do controlador baseada no endpoint
     */
    async execute(request: HttpRequest): Promise<HttpResponse> {
        // Verificar qual operação foi solicitada através de um campo na requisição
        const operation = request.params.operation;

        switch (operation) {
            case "create":
                return await this.createUser(request);
            case "getById":
                return await this.getUserById(request);
            case "getAll":
                return await this.getAllUsers(request);
            case "update":
                return await this.updateUser(request);
            case "delete":
                return await this.deleteUser(request);
            default:
                return this.clientError(
                    `Operação não suportada: ${operation}`,
                    400
                );
        }
    }

    /**
     * Cria um novo usuário
     */
    private async createUser(request: HttpRequest): Promise<HttpResponse> {
        try {
            const userData = request.body as CreateUserDto;

            // Usar o padrão Command para criar o usuário
            const command = new CreateUserCommand(userData);
            const user = await commandBus.execute(command);

            return this.created({ user });
        } catch (error) {
            if (
                error instanceof Error &&
                error.message.includes("já está em uso")
            ) {
                return this.clientError(error.message, 409); // Conflict
            }
            throw error; // Será capturado pelo método handle
        }
    }

    /**
     * Obtém um usuário pelo ID
     */
    private async getUserById(request: HttpRequest): Promise<HttpResponse> {
        const id = parseInt(request.params.id);

        if (isNaN(id)) {
            return this.clientError("ID inválido", 400);
        }

        const user = await this.userService.getUserById(id);

        if (!user) {
            return this.clientError("Usuário não encontrado", 404);
        }

        return this.ok({ user });
    }

    /**
     * Obtém todos os usuários
     */
    private async getAllUsers(request: HttpRequest): Promise<HttpResponse> {
        const users = await this.userService.getAllUsers();
        return this.ok({ users });
    }

    /**
     * Atualiza um usuário existente
     */
    private async updateUser(request: HttpRequest): Promise<HttpResponse> {
        const id = parseInt(request.params.id);

        if (isNaN(id)) {
            return this.clientError("ID inválido", 400);
        }

        const userData = request.body;
        const user = await this.userService.updateUser(id, userData);

        if (!user) {
            return this.clientError("Usuário não encontrado", 404);
        }

        return this.ok({ user });
    }

    /**
     * Remove um usuário existente
     */
    private async deleteUser(request: HttpRequest): Promise<HttpResponse> {
        const id = parseInt(request.params.id);

        if (isNaN(id)) {
            return this.clientError("ID inválido", 400);
        }

        const deleted = await this.userService.deleteUser(id);

        if (!deleted) {
            return this.clientError("Usuário não encontrado", 404);
        }

        return this.noContent();
    }
}
