/**
 * Sistema de roteamento para HTTP
 */

import {
    HttpRequest,
    HttpResponse,
    HttpMiddleware,
} from "./middlewares/auth.middleware";

/**
 * Tipo para função manipuladora de rota
 */
export type RouteHandler = (
    request: HttpRequest
) => Promise<HttpResponse> | HttpResponse;

/**
 * Tipo para função middleware
 */
export type MiddlewareFunc = (
    request: HttpRequest,
    next: () => Promise<HttpResponse>
) => Promise<HttpResponse>;

/**
 * Interface para definição de rota
 */
export interface Route {
    /** Método HTTP */
    method: string;
    /** Caminho da rota */
    path: string;
    /** Handler da rota */
    handler: RouteHandler;
    /** Middlewares específicos da rota */
    middlewares: MiddlewareFunc[];
}

/**
 * Interface para o sistema de roteamento
 */
export interface Router {
    /** Adiciona uma rota GET */
    get(
        path: string,
        handler: RouteHandler,
        ...middlewares: MiddlewareFunc[]
    ): void;
    /** Adiciona uma rota POST */
    post(
        path: string,
        handler: RouteHandler,
        ...middlewares: MiddlewareFunc[]
    ): void;
    /** Adiciona uma rota PUT */
    put(
        path: string,
        handler: RouteHandler,
        ...middlewares: MiddlewareFunc[]
    ): void;
    /** Adiciona uma rota PATCH */
    patch(
        path: string,
        handler: RouteHandler,
        ...middlewares: MiddlewareFunc[]
    ): void;
    /** Adiciona uma rota DELETE */
    delete(
        path: string,
        handler: RouteHandler,
        ...middlewares: MiddlewareFunc[]
    ): void;
    /** Adiciona um middleware global */
    use(...middlewares: MiddlewareFunc[]): void;
    /** Obtém todas as rotas registradas */
    getRoutes(): Route[];
    /** Obtém todos os middlewares globais */
    getGlobalMiddlewares(): MiddlewareFunc[];
}

/**
 * Implementação do sistema de roteamento
 */
class RouterImpl implements Router {
    private routes: Route[] = [];
    private globalMiddlewares: MiddlewareFunc[] = [];

    /**
     * Adiciona uma rota para um método HTTP específico
     * @param method Método HTTP
     * @param path Caminho da rota
     * @param handler Manipulador da rota
     * @param middlewares Middlewares específicos da rota
     */
    private addRoute(
        method: string,
        path: string,
        handler: RouteHandler,
        middlewares: MiddlewareFunc[]
    ): void {
        // Normalizando o path para garantir que comece com /
        if (!path.startsWith("/")) {
            path = `/${path}`;
        }

        this.routes.push({
            method,
            path,
            handler,
            middlewares,
        });
    }

    /**
     * Adiciona uma rota GET
     * @param path Caminho da rota
     * @param handler Manipulador da rota
     * @param middlewares Middlewares específicos da rota
     */
    get(
        path: string,
        handler: RouteHandler,
        ...middlewares: MiddlewareFunc[]
    ): void {
        this.addRoute("GET", path, handler, middlewares);
    }

    /**
     * Adiciona uma rota POST
     * @param path Caminho da rota
     * @param handler Manipulador da rota
     * @param middlewares Middlewares específicos da rota
     */
    post(
        path: string,
        handler: RouteHandler,
        ...middlewares: MiddlewareFunc[]
    ): void {
        this.addRoute("POST", path, handler, middlewares);
    }

    /**
     * Adiciona uma rota PUT
     * @param path Caminho da rota
     * @param handler Manipulador da rota
     * @param middlewares Middlewares específicos da rota
     */
    put(
        path: string,
        handler: RouteHandler,
        ...middlewares: MiddlewareFunc[]
    ): void {
        this.addRoute("PUT", path, handler, middlewares);
    }

    /**
     * Adiciona uma rota PATCH
     * @param path Caminho da rota
     * @param handler Manipulador da rota
     * @param middlewares Middlewares específicos da rota
     */
    patch(
        path: string,
        handler: RouteHandler,
        ...middlewares: MiddlewareFunc[]
    ): void {
        this.addRoute("PATCH", path, handler, middlewares);
    }

    /**
     * Adiciona uma rota DELETE
     * @param path Caminho da rota
     * @param handler Manipulador da rota
     * @param middlewares Middlewares específicos da rota
     */
    delete(
        path: string,
        handler: RouteHandler,
        ...middlewares: MiddlewareFunc[]
    ): void {
        this.addRoute("DELETE", path, handler, middlewares);
    }

    /**
     * Adiciona middleware(s) global(is)
     * @param middlewares Middlewares a serem adicionados
     */
    use(...middlewares: MiddlewareFunc[]): void {
        this.globalMiddlewares.push(...middlewares);
    }

    /**
     * Retorna todas as rotas registradas
     */
    getRoutes(): Route[] {
        return this.routes;
    }

    /**
     * Retorna todos os middlewares globais
     */
    getGlobalMiddlewares(): MiddlewareFunc[] {
        return this.globalMiddlewares;
    }
}

/**
 * Cria uma nova instância do Router
 * @returns Uma nova instância configurada
 */
export function createRouter(): Router {
    return new RouterImpl();
}

/**
 * Adapter para transformar classes HttpMiddleware em funções middleware
 * @param middleware Instância de HttpMiddleware
 * @returns Função middleware compatível
 */
export function middlewareAdapter(middleware: HttpMiddleware): MiddlewareFunc {
    return (request: HttpRequest, next: () => Promise<HttpResponse>) => {
        return middleware.process(request, next);
    };
}
