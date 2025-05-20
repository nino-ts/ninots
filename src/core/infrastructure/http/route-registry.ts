/**
 * Registrador de rotas baseado em decoradores
 *
 * Este módulo integra os decoradores de controller com o sistema de roteamento,
 * processando os metadados dos controllers decorados para registrar suas rotas.
 */

import { Router } from "../interfaces/http/routes";
import {
    HttpRequest,
    HttpResponse,
} from "../interfaces/http/middlewares/auth.middleware";
import {
    controllerRegistry,
    getControllerRoutes,
} from "../../decorators/controller.decorator";
import { container } from "../../container";
import { LoggerFactory } from "../infrastructure/logging/logger-factory";

const logger = LoggerFactory.create("route-registry");

/**
 * Registra todas as rotas definidas com decoradores no router fornecido
 *
 * @param router Instância do router onde as rotas serão registradas
 */
export function registerControllerRoutes(router: Router): void {
    logger.info(
        `Registrando rotas de ${controllerRegistry.length} controladores`
    );

    for (const controllerClass of controllerRegistry) {
        const routes = getControllerRoutes(controllerClass);

        logger.debug(
            `Processando controller: ${controllerClass.name} com ${routes.length} rotas`
        );

        // Registrar cada rota definida pelo controller
        for (const route of routes) {
            // Criar handler que resolve o controller do container e chama o método apropriado
            const handler = async (
                request: HttpRequest
            ): Promise<HttpResponse> => {
                // Instanciar controller do container
                const controller = container.resolve(controllerClass);

                if (!controller) {
                    logger.error(
                        `Controller não encontrado no container: ${controllerClass.name}`
                    );
                    return {
                        status: 500,
                        body: { error: "Controller não registrado" },
                    };
                }

                // Verificar se o método existe
                if (typeof controller[route.methodName] !== "function") {
                    logger.error(
                        `Método não encontrado: ${controllerClass.name}.${route.methodName}`
                    );
                    return {
                        status: 500,
                        body: { error: "Método de controller não encontrado" },
                    };
                }

                try {
                    // Chamar o método do controller para processar a requisição
                    return await controller[route.methodName](request);
                } catch (error) {
                    logger.error(
                        `Erro ao executar controller: ${controllerClass.name}.${route.methodName}`,
                        { error }
                    );
                    return {
                        status: 500,
                        body: {
                            error: "Erro interno",
                            message:
                                process.env.NODE_ENV === "development"
                                    ? String(error)
                                    : undefined,
                        },
                    };
                }
            };

            // Registrar a rota no router
            switch (route.method) {
                case "GET":
                    router.get(route.path, handler, ...route.middlewares);
                    break;
                case "POST":
                    router.post(route.path, handler, ...route.middlewares);
                    break;
                case "PUT":
                    router.put(route.path, handler, ...route.middlewares);
                    break;
                case "PATCH":
                    router.patch(route.path, handler, ...route.middlewares);
                    break;
                case "DELETE":
                    router.delete(route.path, handler, ...route.middlewares);
                    break;
                default:
                    logger.warn(`Método HTTP não suportado: ${route.method}`);
                    continue;
            }

            logger.debug(
                `Registrada rota ${route.method} ${route.path} -> ${controllerClass.name}.${route.methodName}`
            );
        }
    }

    logger.info("Registro de rotas concluído");
}
