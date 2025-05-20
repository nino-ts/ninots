/**
 * Implementação de servidor HTTP otimizado para Bun
 *
 * Este módulo implementa um servidor HTTP utilizando as APIs nativas do Bun
 * para máxima performance e eficiência.
 */

import {
    serve,
    Server,
    type ServerWebSocket,
    file,
    type ServeOptions,
} from "bun";
import type { Router, Route } from "./routes";
import type { HttpRequest, HttpResponse } from "./middlewares/auth.middleware";
import { LoggerFactory } from "../../infrastructure/logging/logger-factory";
import { WebSocketData } from "./websocket.d";

// Tipos estendidos do Bun para usar no WebSocket
interface BunServeOptions extends ServeOptions {
    websocket?: {
        open?: (ws: ServerWebSocket<WebSocketData>) => void;
        message?: (
            ws: ServerWebSocket<WebSocketData>,
            message: string | Uint8Array
        ) => void;
        close?: (
            ws: ServerWebSocket<WebSocketData>,
            code: number,
            reason: string
        ) => void;
        drain?: (ws: ServerWebSocket<WebSocketData>) => void;
        error?: (ws: ServerWebSocket<WebSocketData>, error: Error) => void;
        data?: (req: Request) => WebSocketData;
    };
    tls?: {
        key: Blob;
        cert: Blob;
    };
    requestTimeout?: number;
    maxRequestHeaderCount?: number;
}

/**
 * Interface para manipuladores de WebSocket
 */
export interface WebSocketHandler {
    open?: (ws: ServerWebSocket<WebSocketData>) => void;
    message?: (
        ws: ServerWebSocket<WebSocketData>,
        message: string | Uint8Array
    ) => void;
    close?: (
        ws: ServerWebSocket<WebSocketData>,
        code: number,
        reason: string
    ) => void;
    drain?: (ws: ServerWebSocket<WebSocketData>) => void;
    error?: (ws: ServerWebSocket<WebSocketData>, error: Error) => void;
}

/**
 * Configuração para o servidor HTTP
 */
export interface HttpServerConfig {
    /** Porta para escutar (default: 3000) */
    port?: number;

    /** Host para escutar (default: "0.0.0.0") */
    hostname?: string;

    /** Diretório de arquivos estáticos */
    publicDir?: string;

    /** Se deve usar compressão */
    compression?: boolean;

    /** Se deve usar TLS/HTTPS */
    secure?: boolean;

    /** Caminho para certificado TLS */
    certFile?: string;

    /** Caminho para chave privada TLS */
    keyFile?: string;

    /** Timeout para conexões em ms (default: 30000) */
    requestTimeout?: number;

    /** Número máximo de headers (default: 128) */
    maxRequestHeaderCount?: number;

    /** Se deve permitir WebSockets */
    websockets?: boolean;

    /** Handlers para WebSockets por caminho */
    websocketHandlers?: Record<string, WebSocketHandler>;

    /** Configurações específicas do Bun */
    bunOptions?: Partial<ServeOptions>;
}

/**
 * Classe que gerencia um servidor HTTP usando recursos nativos do Bun
 */
export class HttpServer {
    private server?: Server;
    private router: Router;
    private config: Required<HttpServerConfig>;
    private logger = LoggerFactory.create("http-server");
    private startTime: number = 0;
    private wsHandlers: Record<string, WebSocketHandler> = {};

    /**
     * Construtor do servidor HTTP
     * @param router Roteador com as definições de rotas
     * @param config Configuração do servidor
     */
    constructor(router: Router, config: HttpServerConfig = {}) {
        this.router = router;

        // Valores padrão para configuração
        this.config = {
            port: config.port ?? 3000,
            hostname: config.hostname ?? "0.0.0.0",
            publicDir: config.publicDir ?? "./public",
            compression: config.compression ?? true,
            secure: config.secure ?? false,
            certFile: config.certFile ?? "",
            keyFile: config.keyFile ?? "",
            requestTimeout: config.requestTimeout ?? 30000,
            maxRequestHeaderCount: config.maxRequestHeaderCount ?? 128,
            websockets: config.websockets ?? false,
            websocketHandlers: config.websocketHandlers ?? {},
            bunOptions: config.bunOptions ?? {},
        };

        this.wsHandlers = this.config.websocketHandlers;
    }

    /**
     * Adiciona um manipulador de WebSocket para um caminho específico
     * @param path Caminho para o WebSocket
     * @param handler Manipulador do WebSocket
     */
    public addWebSocketHandler(path: string, handler: WebSocketHandler): void {
        this.wsHandlers[path] = handler;

        // Se o servidor já estiver em execução, recriamos para aplicar os novos handlers
        if (this.server) {
            this.logger.info(
                "Recriando servidor para aplicar novos handlers WebSocket"
            );
            this.stop();
            this.start();
        }
    }

    /**
     * Inicia o servidor
     */
    public start(): void {
        if (this.server) {
            this.logger.warn("Servidor já está em execução");
            return;
        }

        this.startTime = performance.now();

        // Configurar opções do servidor
        const options: BunServeOptions = {
            port: this.config.port,
            hostname: this.config.hostname,
            development: process.env.NODE_ENV !== "production",
            fetch: this.handleRequest.bind(this),
            reusePort: true, // Permite múltiplas instâncias compartilharem a mesma porta
            maxRequestBodySize: 1024 * 1024 * 50, // 50MB default
            ...this.config.bunOptions,
        };

        // Adicionar timeout e maxRequestHeaderCount se a versão do Bun suportar
        if (this.config.requestTimeout) {
            options.requestTimeout = this.config.requestTimeout;
        }

        if (this.config.maxRequestHeaderCount) {
            options.maxRequestHeaderCount = this.config.maxRequestHeaderCount;
        }

        // Adicionar TLS se configurado
        if (this.config.secure && this.config.certFile && this.config.keyFile) {
            options.tls = {
                cert: Bun.file(this.config.certFile),
                key: Bun.file(this.config.keyFile),
            };
        }

        // Configurar WebSockets se habilitados
        if (this.config.websockets) {
            options.websocket = {
                // Função para determinar se aceita uma conexão
                open: (ws: ServerWebSocket<WebSocketData>) => {
                    const pathHandler =
                        this.wsHandlers[ws.data.url] ||
                        this.findPatternMatchingHandler(ws.data.url);

                    if (pathHandler && pathHandler.open) {
                        pathHandler.open(ws);
                    } else {
                        // Se não há handler específico, uso comportamento padrão
                        this.logger.debug(
                            `Nova conexão WebSocket: ${ws.data.url}`
                        );
                    }
                },
                // Manipular mensagens recebidas
                message: (
                    ws: ServerWebSocket<WebSocketData>,
                    message: string | Uint8Array
                ) => {
                    const pathHandler =
                        this.wsHandlers[ws.data.url] ||
                        this.findPatternMatchingHandler(ws.data.url);

                    if (pathHandler && pathHandler.message) {
                        pathHandler.message(ws, message);
                    } else {
                        // Echo como fallback
                        ws.send(message);
                    }
                },
                // Lidar com fechamento de conexão
                close: (
                    ws: ServerWebSocket<WebSocketData>,
                    code: number,
                    reason: string
                ) => {
                    const pathHandler =
                        this.wsHandlers[ws.data.url] ||
                        this.findPatternMatchingHandler(ws.data.url);

                    if (pathHandler && pathHandler.close) {
                        pathHandler.close(ws, code, reason);
                    } else {
                        this.logger.debug(
                            `WebSocket fechado: ${ws.data.url} (${code})`
                        );
                    }
                },
                // Lidar com drenagem do buffer
                drain: (ws: ServerWebSocket<WebSocketData>) => {
                    const pathHandler =
                        this.wsHandlers[ws.data.url] ||
                        this.findPatternMatchingHandler(ws.data.url);

                    if (pathHandler && pathHandler.drain) {
                        pathHandler.drain(ws);
                    }
                },
                // Lidar com erros
                error: (ws: ServerWebSocket<WebSocketData>, error: Error) => {
                    const pathHandler =
                        this.wsHandlers[ws.data.url] ||
                        this.findPatternMatchingHandler(ws.data.url);

                    if (pathHandler && pathHandler.error) {
                        pathHandler.error(ws, error);
                    } else {
                        this.logger.error(`Erro em WebSocket: ${ws.data.url}`, {
                            error,
                        });
                    }
                },
                // Os dados a serem passados para cada WebSocket
                data: (req: Request) => {
                    return {
                        url: req.url,
                        headers: req.headers,
                    } as WebSocketData;
                },
            };
        }

        // Iniciar o servidor
        this.server = serve(options as ServeOptions);

        const protocol = this.config.secure ? "https" : "http";
        const startupTime = (performance.now() - this.startTime).toFixed(2);

        this.logger.info(
            `Servidor HTTP rodando em ${protocol}://${this.config.hostname}:${this.config.port} (${startupTime}ms)`
        );

        if (this.config.websockets) {
            this.logger.info(
                `Suporte a WebSockets ativado com ${
                    Object.keys(this.wsHandlers).length
                } handlers`
            );
        }
    }

    /**
     * Para o servidor
     */
    public stop(): void {
        if (!this.server) {
            this.logger.warn("Servidor não está em execução");
            return;
        }

        this.server.stop();
        this.server = undefined as unknown as Server;
        this.logger.info("Servidor HTTP parado");
    }

    /**
     * Encontra um handler de WebSocket baseado em pattern matching
     */
    private findPatternMatchingHandler(
        url: string
    ): WebSocketHandler | undefined {
        const parsedUrl = new URL(url);
        const path = parsedUrl.pathname;

        // Procurar um handler que corresponda ao padrão de URL
        for (const pattern in this.wsHandlers) {
            // Converter padrão para regex (semelhante ao que fazemos para rotas HTTP)
            const regexPattern = pattern.replace(/:[a-zA-Z0-9_]+/g, "([^/]+)");
            const regex = new RegExp(`^${regexPattern}$`);

            if (regex.test(path)) {
                return this.wsHandlers[pattern];
            }
        }

        return undefined;
    }

    /**
     * Manipula uma requisição HTTP
     * @param request Requisição HTTP do Bun
     * @returns Resposta HTTP
     */
    private async handleRequest(request: Request): Promise<Response> {
        try {
            const url = new URL(request.url);
            const path = url.pathname;
            const method = request.method;

            // Verificar se é uma requisição para arquivo estático
            if (method === "GET" && this.config.publicDir) {
                const staticResponse = await this.tryServeStaticFile(path);
                if (staticResponse) return staticResponse;
            }

            // Parsear query string usando API do Bun
            const query = Object.fromEntries(url.searchParams);

            // Parsear cabeçalhos de forma eficiente
            const headers: Record<string, string> = {};
            request.headers.forEach((value, key) => {
                headers[key.toLowerCase()] = value;
            });

            // Parsear body se houver, usando os métodos otimizados do Bun
            let body = undefined;

            if (method !== "GET" && method !== "HEAD" && request.body) {
                const contentType = headers["content-type"] || "";

                try {
                    if (contentType.includes("application/json")) {
                        body = await request.json();
                    } else if (
                        contentType.includes(
                            "application/x-www-form-urlencoded"
                        )
                    ) {
                        body = Object.fromEntries(await request.formData());
                    } else if (contentType.includes("multipart/form-data")) {
                        const formData = await request.formData();

                        // Processar formData de maneira otimizada
                        const result: Record<string, any> = {};

                        for (const [key, value] of formData.entries()) {
                            // Tratar arquivos de maneira especial
                            if (
                                value instanceof Blob ||
                                value instanceof File
                            ) {
                                result[key] = value;
                            } else {
                                result[key] = value;
                            }
                        }

                        body = result;
                    } else {
                        // Para outros tipos de conteúdo, usar o texto bruto
                        body = await request.text();
                    }
                } catch (err) {
                    this.logger.warn("Erro ao parsear body da requisição", {
                        error: err,
                        contentType,
                    });
                }
            }

            // Encontrar rota correspondente
            const matchingRoute = this.findMatchingRoute(method, path);

            if (!matchingRoute) {
                this.logger.debug(`Rota não encontrada: ${method} ${path}`);
                return new Response(
                    JSON.stringify({
                        error: "Rota não encontrada",
                        path,
                        method,
                    }),
                    {
                        status: 404,
                        headers: {
                            "Content-Type": "application/json",
                            "X-Powered-By": "Ninots",
                        },
                    }
                );
            }

            // Extrair parâmetros da URL
            const params = this.extractPathParams(path, matchingRoute.path);

            // Criar objeto de requisição para os middlewares e handler
            const httpRequest: HttpRequest = {
                params,
                query,
                body,
                headers,
                url: request.url,
                method,
                raw: request, // Acesso à requisição original se necessário
            };

            // Aplicar middlewares globais e de rota
            const globalMiddlewares = this.router.getGlobalMiddlewares();
            const routeMiddlewares = matchingRoute.middlewares || [];
            const allMiddlewares = [...globalMiddlewares, ...routeMiddlewares];

            // Criar pipeline de middlewares
            let index = 0;

            const runMiddleware = async (): Promise<HttpResponse> => {
                if (index < allMiddlewares.length) {
                    const middleware = allMiddlewares[index++];
                    if (middleware) {
                        return await middleware(httpRequest, runMiddleware);
                    }
                }

                // Último da cadeia é o handler da rota
                return await matchingRoute.handler(httpRequest);
            };

            // Executar pipeline de middlewares
            const httpResponse = await runMiddleware();

            // Verificar se a resposta contém um arquivo ou stream
            if (httpResponse.file) {
                // Otimizado para servir arquivos usando Bun.file
                return new Response(Bun.file(httpResponse.file), {
                    status: httpResponse.status || 200,
                    headers: {
                        "X-Powered-By": "Ninots",
                        ...httpResponse.headers,
                    },
                });
            }

            // Verificar se a resposta já é um objeto Response
            if (httpResponse.response instanceof Response) {
                return httpResponse.response;
            }

            // Verificar se é uma resposta em stream
            if (httpResponse.stream) {
                return new Response(httpResponse.stream, {
                    status: httpResponse.status || 200,
                    headers: {
                        "X-Powered-By": "Ninots",
                        ...httpResponse.headers,
                    },
                });
            }

            // Resposta JSON padrão
            const contentType =
                httpResponse.headers?.["content-type"] ||
                httpResponse.headers?.["Content-Type"] ||
                "application/json";

            // Converter HttpResponse para Response do Bun
            return new Response(
                httpResponse.body !== null && httpResponse.body !== undefined
                    ? contentType.includes("application/json")
                        ? JSON.stringify(httpResponse.body)
                        : String(httpResponse.body)
                    : null,
                {
                    status: httpResponse.status || 200,
                    headers: {
                        "Content-Type": contentType,
                        "X-Powered-By": "Ninots",
                        ...httpResponse.headers,
                    },
                }
            );
        } catch (error) {
            this.logger.error("Erro ao processar requisição", { error });

            return new Response(
                JSON.stringify({
                    error: "Erro interno do servidor",
                    message:
                        process.env.NODE_ENV === "development"
                            ? String(error)
                            : undefined,
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                        "X-Powered-By": "Ninots",
                    },
                }
            );
        }
    }

    /**
     * Tenta servir um arquivo estático
     * @param path Caminho relativo do arquivo
     */
    private async tryServeStaticFile(path: string): Promise<Response | null> {
        // Normalizar o caminho e adicionar index.html para diretórios
        if (path.endsWith("/")) {
            path += "index.html";
        }

        // Remover / inicial para o caminho relativo
        const relativePath = path.startsWith("/") ? path.substring(1) : path;

        // Construir caminho completo do arquivo
        const filePath = `${this.config.publicDir}/${relativePath}`;

        try {
            const fileObj = Bun.file(filePath);

            // Verificar se o arquivo existe
            const exists = await fileObj.exists();
            if (!exists) return null;

            // Definir Content-Type baseado na extensão do arquivo
            const contentType = fileObj.type || this.getMimeType(filePath);

            // Servir o arquivo otimizadamente usando o Bun.file
            return new Response(fileObj, {
                headers: {
                    "Content-Type": contentType,
                    "X-Powered-By": "Ninots",
                    "Cache-Control": "public, max-age=86400", // Cache de 1 dia
                },
            });
        } catch (error) {
            this.logger.debug(
                `Erro ao tentar servir arquivo estático: ${filePath}`,
                { error }
            );
            return null;
        }
    }

    /**
     * Determina o tipo MIME baseado na extensão do arquivo
     */
    private getMimeType(filePath: string): string {
        const extension = filePath.split(".").pop()?.toLowerCase() || "";

        const mimeTypes: Record<string, string> = {
            html: "text/html",
            htm: "text/html",
            css: "text/css",
            js: "text/javascript",
            mjs: "text/javascript",
            json: "application/json",
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            svg: "image/svg+xml",
            webp: "image/webp",
            ico: "image/x-icon",
            txt: "text/plain",
            pdf: "application/pdf",
            xml: "application/xml",
            zip: "application/zip",
            mp3: "audio/mpeg",
            mp4: "video/mp4",
            webm: "video/webm",
            woff: "font/woff",
            woff2: "font/woff2",
            ttf: "font/ttf",
            otf: "font/otf",
            eot: "application/vnd.ms-fontobject",
        };

        return mimeTypes[extension] || "application/octet-stream";
    }

    /**
     * Encontra uma rota correspondente à requisição
     * @param method Método HTTP
     * @param path Caminho da URL
     * @returns Rota correspondente ou undefined se não encontrar
     */
    private findMatchingRoute(method: string, path: string): Route | undefined {
        const routes = this.router.getRoutes();

        // Encontrar rota exata
        let matchingRoute = routes.find(
            (route) =>
                route.method === method &&
                this.pathMatchesRoute(path, route.path)
        );

        return matchingRoute;
    }

    /**
     * Verifica se um caminho corresponde a um padrão de rota
     * @param path Caminho real da requisição
     * @param routePath Padrão de caminho da rota
     */
    private pathMatchesRoute(path: string, routePath: string): boolean {
        // Converter padrões de rota para regex
        const routePathRegex = routePath.replace(/:[a-zA-Z0-9_]+/g, "([^/]+)");

        const regex = new RegExp(`^${routePathRegex}$`);
        return regex.test(path);
    }

    /**
     * Extrai parâmetros de rota do caminho da URL
     * @param path Caminho real da requisição
     * @param routePath Padrão de caminho da rota
     */
    private extractPathParams(
        path: string,
        routePath: string
    ): Record<string, string> {
        const params: Record<string, string> = {};

        // Se não há parâmetros na rota, retorna objeto vazio
        if (!routePath.includes(":")) {
            return params;
        }

        // Extrai nomes de parâmetros do padrão de rota
        const paramNames = routePath
            .split("/")
            .filter((segment) => segment.startsWith(":"))
            .map((segment) => segment.substring(1));

        // Extrai valores de parâmetros do caminho real
        const routeRegex = routePath.replace(/:[a-zA-Z0-9_]+/g, "([^/]+)");

        const regex = new RegExp(`^${routeRegex}$`);
        const matches = path.match(regex);

        if (matches && matches.length > 1) {
            // O primeiro elemento é o match completo, ignoramos
            const paramValues = matches.slice(1);

            // Associa nomes de parâmetros com seus valores
            paramNames.forEach((name, index) => {
                const value = paramValues[index];
                if (value !== undefined) {
                    params[name] = value;
                }
            });
        }

        return params;
    }
}
