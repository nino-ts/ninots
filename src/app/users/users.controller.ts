import { BaseController } from "../base.controller";
import { type UserType } from "@domain/entities/user.entity";
import { Get, Put, Delete, Post } from "@shared/decorators/route.decorator";
import { HttpStatus } from "@shared/types/http";
import { UserService, type CreateUserInput } from "@domain/services/user.service";

/**
 * Controlador para operações com usuários
 */
export class UsersController extends BaseController {
    private request: Request;
    private url: URL;
    private userService: UserService;

    constructor(request: Request) {
        super();
        this.request = request;
        this.url = new URL(request.url);
        this.userService = UserService.getInstance();
    }

    /**
     * Obtém o caminho da requisição atual
     */
    protected override getRequestPath(): string {
        return this.url.pathname;
    }

    /**
     * Obtém o ID do usuário da URL
     */
    private getUserId(): number {
        return parseInt(this.url.pathname.split('/').pop() || '0');
    }

    /**
     * Lista todos os usuários
     * GET /users
     */
    @Get('/users')
    public async listUsers(): Promise<Response> {
        const users = this.userService.getAllUsers();
        return this.createResponse(users);
    }

    /**
     * Cria um novo usuário
     * POST /users
     */
    @Post('/users')
    public async createUser(): Promise<Response> {
        try {
            const body = await this.request.json() as CreateUserInput;
            
            try {
                const user = this.userService.createUser(body);
                return this.createResponse(user, HttpStatus.CREATED);
            } catch (error) {
                return this.createErrorResponse(
                    "Dados inválidos",
                    "INVALID_DATA",
                    HttpStatus.BAD_REQUEST,
                    error
                );
            }
        } catch (error) {
            return this.createErrorResponse(
                "Erro ao criar usuário",
                "USER_CREATE_ERROR",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Obtém um usuário específico
     * GET /users/:id
     */
    @Get('/users/:id')
    public async getUser(): Promise<Response> {
        const id = this.getUserId();
        const user = this.userService.getUserById(id);

        if (!user) {
            return this.createErrorResponse(
                "Usuário não encontrado",
                "USER_NOT_FOUND",
                HttpStatus.NOT_FOUND
            );
        }

        return this.createResponse(user);
    }

    /**
     * Atualiza um usuário específico
     * PUT /users/:id
     */
    @Put('/users/:id')
    public async updateUser(): Promise<Response> {
        try {
            const id = this.getUserId();
            const body = await this.request.json() as Partial<UserType>;

            try {
                const user = this.userService.updateUser(id, body);
                
                if (!user) {
                    return this.createErrorResponse(
                        "Usuário não encontrado",
                        "USER_NOT_FOUND",
                        HttpStatus.NOT_FOUND
                    );
                }
                
                return this.createResponse(user);
            } catch (error) {
                return this.createErrorResponse(
                    "Dados inválidos",
                    "INVALID_DATA",
                    HttpStatus.BAD_REQUEST,
                    error
                );
            }
        } catch (error) {
            return this.createErrorResponse(
                "Erro ao atualizar usuário",
                "USER_UPDATE_ERROR",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Remove um usuário específico
     * DELETE /users/:id
     */
    @Delete('/users/:id')
    public async deleteUser(): Promise<Response> {
        const id = this.getUserId();
        const deleted = this.userService.deleteUser(id);

        if (!deleted) {
            return this.createErrorResponse(
                "Usuário não encontrado",
                "USER_NOT_FOUND",
                HttpStatus.NOT_FOUND
            );
        }

        return new Response(null, { status: HttpStatus.NO_CONTENT });
    }
} 