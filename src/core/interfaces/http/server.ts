/**
 * Implementação de servidor HTTP
 */

import { serve, Server, ServerWebSocket } from "bun";
import { Router, Route } from "./routes";
import { HttpRequest, HttpResponse } from "./middlewares/auth.middleware";

/**
 * Classe que gerencia um servidor HTTP usando Bun
 */
export class HttpServer {
    private server?: Server;
    private router: Router;

    /**
     * Construtor do servidor HTTP
     * @param router Roteador com as definições de rotas
     * @param port Porta para escutar (default: 3000)
     */
    constructor(router: Router, private port: number = 3000) {
        this.router = router;
    }

    /**
     * Inicia o servidor
     */
    public start(): void {
        if (this.server) {
            console.warn("Servidor já está em execução");
            return;
        }

        this.server = serve({
            port: this.port,
            fetch: this.handleRequest.bind(this),
        });

        console.log(`Servidor HTTP escutando na porta ${this.port}`);
    }

    /**
     * Para o servidor
     */
    public stop(): void {
        if (!this.server) {
            console.warn("Servidor não está em execução");
            return;
        }

        this.server.stop();
        this.server = undefined;
        console.log("Servidor HTTP parado");
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

            // Parsear query string
            const query: Record<string, string> = {};
            url.searchParams.forEach((value, key) => {
                query[key] = value;
            });

            // Parsear cabeçalhos
            const headers: Record<string, string> = {};
            request.headers.forEach((value, key) => {
                headers[key.toLowerCase()] = value;
            });

            // Parsear body se houver
            let body = undefined;
            if (request.body) {
                const contentType = headers["content-type"];

                if (contentType?.includes("application/json")) {
                    body = await request.json();
                } else if (
                    contentType?.includes("application/x-www-form-urlencoded")
                ) {
                    const formData = await request.formData();
                    body = Object.fromEntries(formData);
                } else if (contentType?.includes("multipart/form-data")) {
                    const formData = await request.formData();
                    body = Object.fromEntries(formData);
                } else {
                    body = await request.text();
                }
            }

            // Encontrar rota correspondente
            const matchingRoute = this.findMatchingRoute(method, path);

            if (!matchingRoute) {
                return new Response(
                    JSON.stringify({
                        error: "Rota não encontrada",
                    }),
                    {
                        status: 404,
                        headers: { "Content-Type": "application/json" },
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
            };

            // Aplicar middlewares globais e de rota
            const globalMiddlewares = this.router.getGlobalMiddlewares();
            const routeMiddlewares = matchingRoute.middlewares;
            const allMiddlewares = [...globalMiddlewares, ...routeMiddlewares];

            // Criar pipeline de middlewares
            let index = 0;

            const runMiddleware = async (): Promise<HttpResponse> => {
                if (index < allMiddlewares.length) {
                    const middleware = allMiddlewares[index++];
                    return middleware(httpRequest, runMiddleware);
                }

                // Último da cadeia é o handler da rota
                return matchingRoute.handler(httpRequest);
            };

            // Executar pipeline de middlewares
            const httpResponse = await runMiddleware();

            // Converter HttpResponse para Response do Bun
            return new Response(
                httpResponse.body !== null && httpResponse.body !== undefined
                    ? JSON.stringify(httpResponse.body)
                    : null,
                {
                    status: httpResponse.status,
                    headers: {
                        "Content-Type": "application/json",
                        ...httpResponse.headers,
                    },
                }
            );
        } catch (error) {
            console.error("Erro ao processar requisição:", error);

            return new Response(
                JSON.stringify({
                    error: "Erro interno do servidor",
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
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
                if (index < paramValues.length) {
                    params[name] = paramValues[index];
                }
            });
        }

        return params;
    }
}
