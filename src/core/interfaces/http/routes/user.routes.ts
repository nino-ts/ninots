/**
 * Definição das rotas de usuário
 */

import { Router } from "../routes";
import { container } from "../../../../container";
import { UserController } from "../../../application/controllers/user.controller";
import {
    JwtAuthMiddleware,
    RequestLoggerMiddleware,
    middlewareAdapter,
} from "../middlewares/auth.middleware";

/**
 * Configura as rotas para usuários
 * @param router Instância do router
 */
export function setupUserRoutes(router: Router): void {
    // Carregar o controlador
    const userController = container.resolve<UserController>("UserController");

    // Middlewares comuns
    const loggerMiddleware = middlewareAdapter(new RequestLoggerMiddleware());
    const authMiddleware = middlewareAdapter(new JwtAuthMiddleware());

    // Rotas de usuário
    router.get(
        "/users",
        (request) => userController.index(request),
        loggerMiddleware
    );

    router.get(
        "/users/:id",
        (request) => userController.show(request),
        loggerMiddleware
    );

    router.post(
        "/users",
        (request) => userController.store(request),
        loggerMiddleware,
        UserController.validateCreateUser
    );

    router.put(
        "/users/:id",
        (request) => userController.update(request),
        loggerMiddleware,
        authMiddleware,
        UserController.validateUpdateUser
    );

    router.delete(
        "/users/:id",
        (request) => userController.destroy(request),
        loggerMiddleware,
        authMiddleware
    );
}
