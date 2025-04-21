/**
 * Tipos HTTP para o Ninots Framework
 * @module HttpTypes
 */

/**
 * Métodos HTTP suportados
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

/**
 * Status HTTP comuns
 */
export const enum HttpStatus {
    // 2xx - Sucesso
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    
    // 3xx - Redirecionamento
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
    
    // 4xx - Erro do cliente
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    CONFLICT = 409,
    GONE = 410,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    
    // 5xx - Erro do servidor
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504
}

/**
 * Interface para rotas registradas
 */
export interface Route {
    method: HttpMethod;
    path: string;
    handlerName: string | symbol;
}

/**
 * Interface para parâmetros de rota
 */
export type RouteParams = Record<string, string>;

/**
 * Interface para query strings
 */
export type QueryParams = Record<string, string | string[] | undefined>;

/**
 * Interface para headers HTTP
 */
export type HttpHeaders = Record<string, string>;

/**
 * Interface para resposta HTTP padronizada
 */
export interface HttpResponse<T = unknown> {
    data?: T;
    error?: {
        message: string;
        code: string;
        details?: unknown;
    };
    metadata: {
        timestamp: string;
        path?: string;
        method?: HttpMethod;
        duration?: number;
        [key: string]: unknown;
    };
}

/**
 * Tipo para meta-informações comuns
 */
export type HttpMetadata = {
    timestamp: string | number;
    path?: string;
    method?: HttpMethod;
    duration?: number;
    [key: string]: unknown;
};

/**
 * Tipo para erros da API
 */
export type HttpError = {
    message: string;
    code: string;
    details?: unknown;
};

/**
 * Interface para contexto de requisição
 */
export interface RequestContext {
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

/**
 * Tipo para manipuladores de rota
 */
export type RouteHandler = (context: RequestContext) => Response | Promise<Response>;

/**
 * Tipo para middlewares
 */
export type Middleware = (context: RequestContext, next: () => Promise<Response>) => Promise<Response>; 