import { BaseController } from "../base.controller";

/**
 * Controlador para operações com usuários
 */
export declare class UsersController extends BaseController {
    private request: Request;
    private url: URL;

    constructor(request: Request);

    /**
     * Obtém o caminho da requisição atual
     */
    protected getRequestPath(): string;

    /**
     * Obtém o ID do usuário da URL
     */
    private getUserId(): number;

    /**
     * Obtém um usuário específico
     */
    public getUser(): Promise<Response>;

    /**
     * Atualiza um usuário específico
     */
    public updateUser(): Promise<Response>;

    /**
     * Remove um usuário específico
     */
    public deleteUser(): Promise<Response>;
} 