/**
 * Middleware para CORS (Cross-Origin Resource Sharing)
 */

import {
    HttpRequest,
    HttpResponse,
} from "../interfaces/http/middlewares/auth.middleware";

/**
 * Opções de configuração para CORS
 */
export interface CorsOptions {
    /**
     * Origens permitidas
     * Pode ser:
     * - true para permitir qualquer origem (equivalente a *)
     * - Um array de strings com origens permitidas
     * - Uma função que recebe a origem e retorna se é permitida
     */
    origin?: boolean | string[] | ((origin: string) => boolean);

    /**
     * Métodos HTTP permitidos
     */
    methods?: string[];

    /**
     * Cabeçalhos permitidos
     */
    allowedHeaders?: string[];

    /**
     * Cabeçalhos expostos
     */
    exposedHeaders?: string[];

    /**
     * Se devem ser enviadas credenciais
     */
    credentials?: boolean;

    /**
     * Tempo em segundos que o navegador pode armazenar em cache os resultados preflight
     */
    maxAge?: number;
}

/**
 * Cria um middleware CORS
 * @param options Opções de configuração
 * @returns Middleware para CORS
 */
export function corsMiddleware(options: CorsOptions = {}) {
    // Configurações padrão
    const config = {
        origin: options.origin || true,
        methods: options.methods || [
            "GET",
            "HEAD",
            "PUT",
            "PATCH",
            "POST",
            "DELETE",
        ],
        allowedHeaders: options.allowedHeaders || [],
        exposedHeaders: options.exposedHeaders || [],
        credentials: options.credentials || false,
        maxAge: options.maxAge || 86400, // 24 horas
    };

    /**
     * Verifica se uma origem é permitida
     * @param origin Origem da requisição
     * @returns true se a origem for permitida
     */
    const isOriginAllowed = (origin: string): boolean => {
        if (config.origin === true) {
            return true;
        }

        if (Array.isArray(config.origin)) {
            return config.origin.includes(origin);
        }

        if (typeof config.origin === "function") {
            return config.origin(origin);
        }

        return false;
    };

    return async (
        request: HttpRequest,
        next: () => Promise<HttpResponse>
    ): Promise<HttpResponse> => {
        const origin = request.headers["origin"];
        const method = request.headers["access-control-request-method"];

        // Headers comuns para todas as respostas CORS
        const corsHeaders: Record<string, string> = {};

        // Configurar Access-Control-Allow-Origin
        if (origin && isOriginAllowed(origin)) {
            corsHeaders["Access-Control-Allow-Origin"] = origin;
        }

        // Configurar Vary para Origin
        corsHeaders["Vary"] = "Origin";

        // Configurar credenciais
        if (config.credentials) {
            corsHeaders["Access-Control-Allow-Credentials"] = "true";
        }

        // Configurar cabeçalhos expostos
        if (config.exposedHeaders && config.exposedHeaders.length) {
            corsHeaders["Access-Control-Expose-Headers"] =
                config.exposedHeaders.join(", ");
        }

        // Requisição preflight
        if (request.headers["access-control-request-method"]) {
            // Configurar métodos permitidos
            corsHeaders["Access-Control-Allow-Methods"] =
                config.methods.join(", ");

            // Configurar cabeçalhos permitidos
            const requestHeaders =
                request.headers["access-control-request-headers"];

            if (requestHeaders) {
                corsHeaders["Access-Control-Allow-Headers"] =
                    config.allowedHeaders.length > 0
                        ? config.allowedHeaders.join(", ")
                        : requestHeaders;
            }

            // Configurar max age
            if (config.maxAge !== undefined) {
                corsHeaders["Access-Control-Max-Age"] =
                    config.maxAge.toString();
            }

            // Para requisições OPTIONS preflight, retornar 204 No Content
            if (method) {
                return {
                    status: 204,
                    body: null,
                    headers: corsHeaders,
                };
            }
        }

        // Para requisições regulares, continuar e adicionar cabeçalhos CORS à resposta
        const response = await next();

        return {
            ...response,
            headers: {
                ...response.headers,
                ...corsHeaders,
            },
        };
    };
}
