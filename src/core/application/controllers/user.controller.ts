/**
 * Controlador de usuários
 * Implementa o padrão MVC - Controller
 */

import { z } from "zod";
import {
    HttpRequest,
    HttpResponse,
} from "../../interfaces/http/middlewares/auth.middleware";
import { UserService } from "../services/user.service";
import { Inject } from "../../../container";
import { validationMiddleware } from "../../validations/validation";

/**
 * Esquema de validação para criação de usuário
 */
const createUserSchema = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    password: z.string().min(6),
});

/**
 * Esquema de validação para atualização de usuário
 */
const updateUserSchema = z.object({
    name: z.string().min(3).max(100).optional(),
    email: z.string().email().optional(),
});

/**
 * Controlador para operações relacionadas a usuários
 * Seguindo o padrão RESTful
 */
export class UserController {
    /**
     * Serviço de usuário injetado via decorator
     */
    @Inject("UserService")
    private userService!: UserService;

    /**
     * Middleware de validação para criação de usuário
     */
    static validateCreateUser = validationMiddleware(createUserSchema);

    /**
     * Middleware de validação para atualização de usuário
     */
    static validateUpdateUser = validationMiddleware(updateUserSchema);

    /**
     * Lista todos os usuários
     * @param request Requisição HTTP
     */
    async index(_request: HttpRequest): Promise<HttpResponse> {
        try {
            const users = await this.userService.getAllUsers();

            return {
                status: 200,
                body: users,
            };
        } catch (error) {
            return {
                status: 500,
                body: { message: "Erro ao listar usuários" },
            };
        }
    }

    /**
     * Exibe um usuário específico
     * @param request Requisição HTTP
     */
    async show(request: HttpRequest): Promise<HttpResponse> {
        try {
            const id = Number(request.params.id);

            if (isNaN(id)) {
                return {
                    status: 400,
                    body: { message: "ID inválido" },
                };
            }

            const user = await this.userService.getUserById(id);

            if (!user) {
                return {
                    status: 404,
                    body: { message: "Usuário não encontrado" },
                };
            }

            return {
                status: 200,
                body: user,
            };
        } catch (error) {
            return {
                status: 500,
                body: { message: "Erro ao buscar usuário" },
            };
        }
    }

    /**
     * Cria um novo usuário
     * @param request Requisição HTTP
     */
    async store(request: HttpRequest): Promise<HttpResponse> {
        try {
            // A validação já foi feita pelo middleware
            const userData = request.body;

            const user = await this.userService.createUser(userData);

            return {
                status: 201,
                body: user,
            };
        } catch (error: any) {
            if (error.message?.includes("já está em uso")) {
                return {
                    status: 409,
                    body: { message: error.message },
                };
            }

            return {
                status: 500,
                body: { message: "Erro ao criar usuário" },
            };
        }
    }

    /**
     * Atualiza um usuário existente
     * @param request Requisição HTTP
     */
    async update(request: HttpRequest): Promise<HttpResponse> {
        try {
            const id = Number(request.params.id);

            if (isNaN(id)) {
                return {
                    status: 400,
                    body: { message: "ID inválido" },
                };
            }

            // A validação já foi feita pelo middleware
            const userData = request.body;

            const user = await this.userService.updateUser(id, userData);

            if (!user) {
                return {
                    status: 404,
                    body: { message: "Usuário não encontrado" },
                };
            }

            return {
                status: 200,
                body: user,
            };
        } catch (error) {
            return {
                status: 500,
                body: { message: "Erro ao atualizar usuário" },
            };
        }
    }

    /**
     * Remove um usuário
     * @param request Requisição HTTP
     */
    async destroy(request: HttpRequest): Promise<HttpResponse> {
        try {
            const id = Number(request.params.id);

            if (isNaN(id)) {
                return {
                    status: 400,
                    body: { message: "ID inválido" },
                };
            }

            const deleted = await this.userService.deleteUser(id);

            if (!deleted) {
                return {
                    status: 404,
                    body: { message: "Usuário não encontrado" },
                };
            }

            return {
                status: 204,
                body: null,
            };
        } catch (error) {
            return {
                status: 500,
                body: { message: "Erro ao excluir usuário" },
            };
        }
    }
}
