/**
 * Rate limiter para controlar acesso a rotas
 */

import {
    HttpRequest,
    HttpResponse,
} from "../interfaces/http/middlewares/auth.middleware";

/**
 * Configuração para o rate limiter
 */
interface RateLimiterOptions {
    /**
     * Número máximo de requisições permitidas no intervalo
     */
    max: number;

    /**
     * Intervalo em segundos
     */
    windowSize: number;

    /**
     * Função para extrair o identificador da requisição
     * Por padrão usa o IP
     */
    keyGenerator?: (request: HttpRequest) => string;

    /**
     * Mensagem de erro quando o limite é excedido
     */
    message?: string;
}

/**
 * Implementação de Rate Limiter usando armazenamento em memória
 */
export function createRateLimiter(options: RateLimiterOptions) {
    // Configurações padrão
    const config = {
        max: options.max,
        windowSize: options.windowSize,
        keyGenerator:
            options.keyGenerator ||
            ((req: HttpRequest) =>
                req.headers["x-forwarded-for"] || "default-ip"),
        message:
            options.message || "Rate limit exceeded, please try again later.",
    };

    // Armazenamento das requisições
    // Chave: IP ou identificador do cliente, Valor: Array de timestamps
    const store: Record<string, number[]> = {};

    // Função para limpar timestamps antigos
    const cleanup = (key: string, now: number): void => {
        if (!store[key]) return;

        // Remover timestamps mais antigos que a janela de tempo
        const windowMs = config.windowSize * 1000;
        store[key] = store[key].filter(
            (timestamp) => now - timestamp < windowMs
        );

        // Se não há mais timestamps, remover a entrada
        if (store[key].length === 0) {
            delete store[key];
        }
    };

    // Middleware de rate limiting
    return async (
        request: HttpRequest,
        next: () => Promise<HttpResponse>
    ): Promise<HttpResponse> => {
        const key = config.keyGenerator(request);
        const now = Date.now();

        // Inicializar array se não existir
        if (!store[key]) {
            store[key] = [];
        }

        // Limpar timestamps antigos
        cleanup(key, now);

        // Verificar se o limite foi excedido
        if (store[key].length >= config.max) {
            // Calcular tempo restante para próxima requisição
            const oldestTimestamp = store[key][0];
            const resetTime = oldestTimestamp + config.windowSize * 1000 - now;
            const resetSeconds = Math.ceil(resetTime / 1000);

            return {
                status: 429, // Too Many Requests
                body: {
                    message: config.message,
                    retryAfter: resetSeconds,
                },
                headers: {
                    "Retry-After": String(resetSeconds),
                    "X-RateLimit-Limit": String(config.max),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": String(
                        Math.ceil(
                            (oldestTimestamp + config.windowSize * 1000) / 1000
                        )
                    ),
                },
            };
        }

        // Adicionar timestamp atual
        store[key].push(now);

        // Adicionar headers de rate limit
        const remainingRequests = config.max - store[key].length;
        const nextReset = Math.ceil((now + config.windowSize * 1000) / 1000);

        // Continuar para o próximo middleware com headers adicionais
        const response = await next();

        return {
            ...response,
            headers: {
                ...response.headers,
                "X-RateLimit-Limit": String(config.max),
                "X-RateLimit-Remaining": String(remainingRequests),
                "X-RateLimit-Reset": String(nextReset),
            },
        };
    };
}
