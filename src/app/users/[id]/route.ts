import { UsersController } from "../users.controller";

/**
 * Obtém um usuário específico
 * GET /users/[id]
 */
export function GET(request: Request): Promise<Response> {
    const controller = new UsersController(request);
    return controller.getUser();
}

/**
 * Atualiza um usuário específico
 * PUT /users/[id]
 */
export function PUT(request: Request): Promise<Response> {
    const controller = new UsersController(request);
    return controller.updateUser();
}

/**
 * Remove um usuário específico
 * DELETE /users/[id]
 */
export function DELETE(request: Request): Promise<Response> {
    const controller = new UsersController(request);
    return controller.deleteUser();
} 