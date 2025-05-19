/**
 * Configuração centralizada das rotas da aplicação
 */

import { Router } from "../routes";
import { corsMiddleware } from "../../../middlewares/cors";
import { createRateLimiter } from "../../../middlewares/rate-limiter";
import { swaggerMiddleware } from "../middlewares/swagger.middleware";
import { container } from "../../../../container";
import { UserController } from "../../../application/controllers/user.controller";
import {
    JwtAuthMiddleware,
    middlewareAdapter,
    RequestLoggerMiddleware,
} from "../middlewares/auth.middleware";

/**
 * Configura todas as rotas da aplicação
 * @param router Instância do router
 */
export function setupRoutes(router: Router): void {
    // Configurar middlewares globais
    router.use(
        corsMiddleware({
            origin: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            credentials: true,
        }),
        createRateLimiter({
            max: 100, // 100 requisições
            windowSize: 60, // em um período de 60 segundos
        })
    );

    // Configurar documentação Swagger
    router.get("/api-docs", (request) => {
        const swagger = swaggerMiddleware();
        return swagger(request, () =>
            Promise.resolve({ status: 404, body: { message: "Not found" } })
        );
    });

    router.get("/api-docs/:path", (request) => {
        const swagger = swaggerMiddleware();
        return swagger(request, () =>
            Promise.resolve({ status: 404, body: { message: "Not found" } })
        );
    });

    // Instanciar controladores necessários
    const userController = container.resolve<UserController>("UserController");

    // Middlewares comuns
    const loggerMiddleware = middlewareAdapter(new RequestLoggerMiddleware());
    const authMiddleware = middlewareAdapter(new JwtAuthMiddleware());

    // Rotas de usuário
    router.get("/users", (request) => userController.index(request), [
        loggerMiddleware,
    ]);

    router.get("/users/:id", (request) => userController.show(request), [
        loggerMiddleware,
    ]);

    router.post("/users", (request) => userController.store(request), [
        loggerMiddleware,
        UserController.validateCreateUser,
    ]);

    router.put("/users/:id", (request) => userController.update(request), [
        loggerMiddleware,
        authMiddleware,
        UserController.validateUpdateUser,
    ]);

    router.delete("/users/:id", (request) => userController.destroy(request), [
        loggerMiddleware,
        authMiddleware,
    ]);

    // Rota de saúde
    router.get("/health", () => {
        return {
            status: 200,
            body: {
                status: "ok",
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
            },
        };
    });
}
