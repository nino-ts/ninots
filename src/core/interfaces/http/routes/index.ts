/**
 * Configuração de rotas HTTP
 */

import { UserController } from "../controllers/user.controller";
import {
    HttpRequest,
    HttpResponse,
    JwtAuthMiddleware,
    RequestLoggerMiddleware,
} from "../middlewares/auth.middleware";

/**
 * Interface para um manipulador de rota
 */
export type RouteHandler = (request: HttpRequest) => Promise<HttpResponse>;

/**
 * Definição de uma rota
 */
export interface Route {
    /** Método HTTP */
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    /** Caminho da rota */
    path: string;
    /** Manipulador da rota */
    handler: RouteHandler;
    /** Middlewares a aplicar à rota */
    middlewares: Array<
        (
            req: HttpRequest,
            next: () => Promise<HttpResponse>
        ) => Promise<HttpResponse>
    >;
}

/**
 * Configurador de rotas
 */
export class Router {
    private routes: Route[] = [];
    private globalMiddlewares: Array<
        (
            req: HttpRequest,
            next: () => Promise<HttpResponse>
        ) => Promise<HttpResponse>
    > = [];

    /**
     * Adiciona um middleware global que é aplicado a todas as rotas
     */
    public use(
        middleware: (
            req: HttpRequest,
            next: () => Promise<HttpResponse>
        ) => Promise<HttpResponse>
    ): Router {
        this.globalMiddlewares.push(middleware);
        return this;
    }

    /**
     * Registra uma rota GET
     */
    public get(
        path: string,
        handler: RouteHandler,
        middlewares: Array<
            (
                req: HttpRequest,
                next: () => Promise<HttpResponse>
            ) => Promise<HttpResponse>
        > = []
    ): Router {
        this.addRoute("GET", path, handler, middlewares);
        return this;
    }

    /**
     * Registra uma rota POST
     */
    public post(
        path: string,
        handler: RouteHandler,
        middlewares: Array<
            (
                req: HttpRequest,
                next: () => Promise<HttpResponse>
            ) => Promise<HttpResponse>
        > = []
    ): Router {
        this.addRoute("POST", path, handler, middlewares);
        return this;
    }

    /**
     * Registra uma rota PUT
     */
    public put(
        path: string,
        handler: RouteHandler,
        middlewares: Array<
            (
                req: HttpRequest,
                next: () => Promise<HttpResponse>
            ) => Promise<HttpResponse>
        > = []
    ): Router {
        this.addRoute("PUT", path, handler, middlewares);
        return this;
    }

    /**
     * Registra uma rota PATCH
     */
    public patch(
        path: string,
        handler: RouteHandler,
        middlewares: Array<
            (
                req: HttpRequest,
                next: () => Promise<HttpResponse>
            ) => Promise<HttpResponse>
        > = []
    ): Router {
        this.addRoute("PATCH", path, handler, middlewares);
        return this;
    }

    /**
     * Registra uma rota DELETE
     */
    public delete(
        path: string,
        handler: RouteHandler,
        middlewares: Array<
            (
                req: HttpRequest,
                next: () => Promise<HttpResponse>
            ) => Promise<HttpResponse>
        > = []
    ): Router {
        this.addRoute("DELETE", path, handler, middlewares);
        return this;
    }

    /**
     * Adiciona uma rota ao router
     */
    private addRoute(
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
        path: string,
        handler: RouteHandler,
        middlewares: Array<
            (
                req: HttpRequest,
                next: () => Promise<HttpResponse>
            ) => Promise<HttpResponse>
        >
    ): void {
        this.routes.push({
            method,
            path,
            handler,
            middlewares,
        });
    }

    /**
     * Obtém todas as rotas registradas
     */
    public getRoutes(): Route[] {
        return this.routes;
    }

    /**
     * Obtém os middlewares globais
     */
    public getGlobalMiddlewares(): Array<
        (
            req: HttpRequest,
            next: () => Promise<HttpResponse>
        ) => Promise<HttpResponse>
    > {
        return this.globalMiddlewares;
    }
}

/**
 * Definição das rotas de usuário
 */
export function setupUserRoutes(router: Router): void {
    const userController = new UserController();
    const jwtMiddleware = new JwtAuthMiddleware();
    const loggerMiddleware = new RequestLoggerMiddleware();

    const handle = (req: HttpRequest) => userController.handle(req);

    // Rotas públicas
    router.post(
        "/api/users",
        (req) => {
            req.params.operation = "create";
            return handle(req);
        },
        [loggerMiddleware.process.bind(loggerMiddleware)]
    );

    // Rotas protegidas
    router.get(
        "/api/users",
        (req) => {
            req.params.operation = "getAll";
            return handle(req);
        },
        [
            loggerMiddleware.process.bind(loggerMiddleware),
            jwtMiddleware.process.bind(jwtMiddleware),
        ]
    );

    router.get(
        "/api/users/:id",
        (req) => {
            req.params.operation = "getById";
            return handle(req);
        },
        [
            loggerMiddleware.process.bind(loggerMiddleware),
            jwtMiddleware.process.bind(jwtMiddleware),
        ]
    );

    router.put(
        "/api/users/:id",
        (req) => {
            req.params.operation = "update";
            return handle(req);
        },
        [
            loggerMiddleware.process.bind(loggerMiddleware),
            jwtMiddleware.process.bind(jwtMiddleware),
        ]
    );

    router.delete(
        "/api/users/:id",
        (req) => {
            req.params.operation = "delete";
            return handle(req);
        },
        [
            loggerMiddleware.process.bind(loggerMiddleware),
            jwtMiddleware.process.bind(jwtMiddleware),
        ]
    );
}

// Criar e configurar o router principal
export function createRouter(): Router {
    const router = new Router();

    // Adicionar middleware global de logging
    router.use(
        new RequestLoggerMiddleware().process.bind(
            new RequestLoggerMiddleware()
        )
    );

    // Configurar rotas
    setupUserRoutes(router);

    return router;
}
