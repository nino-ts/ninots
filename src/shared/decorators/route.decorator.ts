import { HttpMethod } from '../types/http';

/**
 * Opções para o decorador de rota
 */
export interface RouteOptions {
  path: string;
  method: HttpMethod;
  middlewares?: Array<(req: Request) => Promise<Response | void>>;
}

/**
 * Armazena metadados de rota
 */
const routeMetadataMap = new Map<Function, RouteOptions[]>();

/**
 * Decorador para definir uma rota em um método de controlador
 * 
 * Exemplo de uso:
 * ```typescript
 * class UserController {
 *   @Route({ path: '/users', method: 'GET' })
 *   public async getUsers(req: Request): Promise<Response> {
 *     // ...
 *   }
 * }
 * ```
 */
export function Route(options: RouteOptions) {
  return function(
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const targetConstructor = target.constructor as Function;
    
    if (!routeMetadataMap.has(targetConstructor)) {
      routeMetadataMap.set(targetConstructor, []);
    }
    
    const routes = routeMetadataMap.get(targetConstructor)!;
    routes.push({
      ...options,
      path: options.path
    });
    
    return descriptor;
  };
}

/**
 * Decoradores de métodos HTTP específicos
 */
export const Get = (path: string, middlewares?: RouteOptions['middlewares']) => 
  Route({ path, method: 'GET', middlewares });

export const Post = (path: string, middlewares?: RouteOptions['middlewares']) => 
  Route({ path, method: 'POST', middlewares });

export const Put = (path: string, middlewares?: RouteOptions['middlewares']) => 
  Route({ path, method: 'PUT', middlewares });

export const Delete = (path: string, middlewares?: RouteOptions['middlewares']) => 
  Route({ path, method: 'DELETE', middlewares });

export const Patch = (path: string, middlewares?: RouteOptions['middlewares']) => 
  Route({ path, method: 'PATCH', middlewares });

export const Options = (path: string, middlewares?: RouteOptions['middlewares']) => 
  Route({ path, method: 'OPTIONS', middlewares });

export const Head = (path: string, middlewares?: RouteOptions['middlewares']) => 
  Route({ path, method: 'HEAD', middlewares });

/**
 * Obtém os metadados de rota para um controlador
 */
export function getRouteMetadata(constructor: Function): RouteOptions[] {
  return routeMetadataMap.get(constructor) || [];
} 