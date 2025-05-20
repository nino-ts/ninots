/**
 * Configuração de rotas HTTP
 */

import { createRouter } from "../routes";
import { registerControllerRoutes } from "../../../infrastructure/http/route-registry";
import { LoggerFactory } from "../../../infrastructure/logging/logger-factory";
import { RequestLoggerMiddleware } from "../middlewares/auth.middleware";
import { middlewareAdapter } from "../routes";

// Importar todos os controllers aqui para garantir que sejam carregados
// e registrados antes de configurar as rotas
import "../controllers/example.controller";
import "../controllers/user.controller";

const logger = LoggerFactory.create("routes");

/**
 * Configura todas as rotas da aplicação
 * @returns Router configurado
 */
export function setupRoutes() {
    // Criar router
    const router = createRouter();

    // Adicionar middlewares globais
    router.use(middlewareAdapter(new RequestLoggerMiddleware()));

    // Registrar rotas de controllers decorados
    registerControllerRoutes(router);

    // Logs sobre as rotas registradas
    const routeCount = router.getRoutes().length;
    logger.info(`Total de ${routeCount} rotas registradas`);

    return router;
}
