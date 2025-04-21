import { UsersController } from "./users.controller";

/**
 * Lista todos os usuários
 * GET /users
 */
export function GET(request: Request): Promise<Response> {
    const controller = new UsersController(request);
    return controller.listUsers();
}

/**
 * Cria um novo usuário
 * POST /users
 */
export function POST(request: Request): Promise<Response> {
    const controller = new UsersController(request);
    return controller.createUser();
} 