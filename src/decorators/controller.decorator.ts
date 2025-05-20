/**
 * Decoradores para controllers HTTP
 *
 * Este módulo fornece decoradores que simplificam a definição de controladores
 * e rotas para a aplicação HTTP, seguindo um padrão similar a frameworks como
 * NestJS mas com implementação mais leve e otimizada para Bun.
 */

import "reflect-metadata";
import { container } from "../container";
import { Type } from "../shared/types";
import { RouteDefinition } from "../core/interfaces/http/routes";

// Chaves de metadados
const CONTROLLER_PREFIX_KEY = "ninots:controller:prefix";
const CONTROLLER_ROUTES_KEY = "ninots:controller:routes";

/**
 * Classes de controller são registradas aqui para processamento posterior
 */
export const controllerRegistry: Type<any>[] = [];

/**
 * Decorator para marcar uma classe como um Controller HTTP
 *
 * @example
 * ```
 * @Controller('/users')
 * export class UserController {
 *   // ...
 * }
 * ```
 *
 * @param prefix Prefixo opcional para todas as rotas do controller
 */
export function Controller(prefix: string = "") {
    return function (target: Type<any>) {
        Reflect.defineMetadata(CONTROLLER_PREFIX_KEY, prefix, target);

        // Registra o controller para processamento posterior
        controllerRegistry.push(target);

        // Registra o controller no container
        container.register(target.name, target);

        return target;
    };
}

/**
 * Decorator para definir um método como rota HTTP GET
 *
 * @example
 * ```
 * @Get('/:id')
 * async getUser(req: HttpRequest): Promise<HttpResponse> {
 *   // ...
 * }
 * ```
 *
 * @param path Caminho da rota
 */
export function Get(path: string = "") {
    return createRouteDecorator("GET", path);
}

/**
 * Decorator para definir um método como rota HTTP POST
 *
 * @example
 * ```
 * @Post('/')
 * async createUser(req: HttpRequest): Promise<HttpResponse> {
 *   // ...
 * }
 * ```
 *
 * @param path Caminho da rota
 */
export function Post(path: string = "") {
    return createRouteDecorator("POST", path);
}

/**
 * Decorator para definir um método como rota HTTP PUT
 *
 * @param path Caminho da rota
 */
export function Put(path: string = "") {
    return createRouteDecorator("PUT", path);
}

/**
 * Decorator para definir um método como rota HTTP PATCH
 *
 * @param path Caminho da rota
 */
export function Patch(path: string = "") {
    return createRouteDecorator("PATCH", path);
}

/**
 * Decorator para definir um método como rota HTTP DELETE
 *
 * @param path Caminho da rota
 */
export function Delete(path: string = "") {
    return createRouteDecorator("DELETE", path);
}

/**
 * Decorator para definir middlewares em um método de rota
 *
 * @example
 * ```
 * @Get('/protected')
 * @UseMiddlewares(authMiddleware)
 * getProtectedResource(req: HttpRequest): HttpResponse {
 *   // ...
 * }
 * ```
 *
 * @param middlewares Middlewares a serem aplicados à rota
 */
export function UseMiddlewares(...middlewares: any[]) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        let routes: RouteDefinition[] =
            Reflect.getMetadata(CONTROLLER_ROUTES_KEY, target.constructor) ||
            [];

        const route = routes.find((r) => r.methodName === propertyKey);
        if (route) {
            route.middlewares = [...(route.middlewares || []), ...middlewares];
        }

        Reflect.defineMetadata(
            CONTROLLER_ROUTES_KEY,
            routes,
            target.constructor
        );

        return descriptor;
    };
}

/**
 * Utilitário para criar decoradores de rota
 */
function createRouteDecorator(method: string, path: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        // Garantir que temos um array de rotas para este controlador
        let routes: RouteDefinition[] =
            Reflect.getMetadata(CONTROLLER_ROUTES_KEY, target.constructor) ||
            [];

        // Adicionar nova definição de rota
        routes.push({
            method,
            path,
            methodName: propertyKey,
            middlewares: [],
        });

        // Atualizar metadados com a rota adicionada
        Reflect.defineMetadata(
            CONTROLLER_ROUTES_KEY,
            routes,
            target.constructor
        );

        return descriptor;
    };
}

/**
 * Extrai as definições de rota de uma classe controller
 *
 * @param controller Classe controller decorada
 * @returns Definições de rotas configuradas
 */
export function getControllerRoutes(controller: Type<any>): RouteDefinition[] {
    const prefix = Reflect.getMetadata(CONTROLLER_PREFIX_KEY, controller) || "";
    const routes = Reflect.getMetadata(CONTROLLER_ROUTES_KEY, controller) || [];

    // Normalizar prefixo para garantir padrão
    const normalizedPrefix = prefix.startsWith("/") ? prefix : `/${prefix}`;

    return routes.map((route: RouteDefinition) => {
        // Normalizar caminho da rota
        let path = route.path.startsWith("/") ? route.path : `/${route.path}`;

        // Combinar prefixo com caminho
        path = `${normalizedPrefix}${path}`.replace(/\/\//g, "/");

        // Se o resultado for string vazia, usar '/'
        if (path === "") {
            path = "/";
        }

        return {
            ...route,
            path,
            controllerClass: controller,
        };
    });
}
