/**
 * Tipos HTTP para o Ninots Framework
 * @module HttpTypes
 */

/**
 * Métodos HTTP suportados
 */
export declare type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

/**
 * Interface para rotas registradas
 */
export declare interface Route {
    method: HttpMethod;
    path: string;
    handlerName: string | symbol;
}

/**
 * Interface para parâmetros de rota
 */
export declare interface RouteParams {
    [key: string]: string;
}

/**
 * Interface para query strings
 */
export declare interface QueryParams {
    [key: string]: string | string[] | undefined;
}

/**
 * Interface para headers HTTP
 */
export declare interface HttpHeaders {
    [key: string]: string;
}

/**
 * Interface para resposta HTTP padronizada
 */
export declare interface HttpResponse<T = unknown> {
    data?: T;
    error?: {
        message: string;
        code: string;
        details?: unknown;
    };
    meta?: {
        timestamp: number;
        path: string;
        [key: string]: unknown;
    };
}

/**
 * Interface para contexto de requisição
 */
export declare interface RequestContext {
    request: Request;
    params: RouteParams;
    query: QueryParams;
    body?: unknown;
    headers: HttpHeaders;
    metadata: {
        startTime: number;
        [key: string]: unknown;
    };
} 