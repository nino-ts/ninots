/**
 * Middleware de autenticação para rotas HTTP
 */

/**
 * Interface para requisição HTTP
 */
export interface HttpRequest {
    /** Parâmetros da URL */
    params: Record<string, string>;
    /** Parâmetros da query string */
    query: Record<string, string>;
    /** Corpo da requisição */
    body: any;
    /** Cabeçalhos da requisição */
    headers: Record<string, string>;
    /** Usuário autenticado (se houver) */
    user?: any;
    /** URL completo da requisição */
    url?: string;
    /** Método HTTP */
    method: string;
    /** Requisição original do Bun */
    raw?: Request;
}

/**
 * Interface para resposta HTTP
 */
export interface HttpResponse {
    /** Status HTTP da resposta */
    status: number;
    /** Corpo da resposta */
    body: any;
    /** Cabeçalhos da resposta */
    headers?: Record<string, string>;
    /** Caminho do arquivo para enviar como resposta */
    file?: string;
    /** Stream para enviar como resposta */
    stream?: ReadableStream;
    /** Resposta do Bun diretamente */
    response?: Response;
}

/**
 * Interface para middleware de HTTP
 */
export interface HttpMiddleware {
    /**
     * Processa uma requisição HTTP
     * @param request Requisição HTTP
     * @param next Função para chamar o próximo middleware
     */
    process(
        request: HttpRequest,
        next: () => Promise<HttpResponse>
    ): Promise<HttpResponse>;
}

/**
 * Middleware de autenticação JWT
 */
export class JwtAuthMiddleware implements HttpMiddleware {
    // Implementação simplificada para fins de exemplo
    async process(
        request: HttpRequest,
        next: () => Promise<HttpResponse>
    ): Promise<HttpResponse> {
        const authHeader = request.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return {
                status: 401,
                body: { message: "Authentication token is required" },
            };
        }

        const token = authHeader.substring(7);

        try {
            // Aqui seria a validação real do token JWT
            // Por simplicidade, apenas simulo um usuário
            if (token === "invalid_token") {
                throw new Error("Invalid token");
            }

            // Token simulado válido
            request.user = { id: 1, name: "Test User" };

            // Continua para o próximo middleware ou controlador
            return await next();
        } catch (error) {
            return {
                status: 401,
                body: { message: "Unauthorized: invalid token" },
            };
        }
    }
}

/**
 * Middleware para logging de requisições
 */
export class RequestLoggerMiddleware implements HttpMiddleware {
    async process(
        request: HttpRequest,
        next: () => Promise<HttpResponse>
    ): Promise<HttpResponse> {
        const startTime = performance.now();

        // Log da requisição
        console.log(`[${new Date().toISOString()}] Request:`, {
            headers: request.headers,
            params: request.params,
            query: request.query,
        });

        // Passa para o próximo middleware
        const response = await next();

        // Log da resposta
        const endTime = performance.now();
        console.log(`[${new Date().toISOString()}] Response:`, {
            status: response.status,
            duration: `${(endTime - startTime).toFixed(2)}ms`,
        });

        return response;
    }
}
