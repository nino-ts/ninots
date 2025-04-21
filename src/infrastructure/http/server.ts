import { type Serve, type Server as BunServer } from "bun";
import { Config } from '../../shared/config';
import { BaseError } from '../../shared/errors/base.error';
import { HttpHeaders, HttpMethod, HttpResponse, RequestContext } from '../../shared/types/http';

/**
 * Servidor HTTP do Ninots Framework
 * 
 * Implementa um servidor HTTP usando as APIs nativas do Bun.
 * Inclui suporte a CORS, tratamento de erros e logging.
 * 
 * @class Server
 */
export class Server {
    private server: BunServer;

    constructor(private readonly config: Config) { }

    /**
     * Inicia o servidor HTTP
     * 
     * @throws {Error} Se houver erro ao iniciar o servidor
     * @returns {Promise<void>}
     */
    async start(): Promise<void> {
        const { port, name } = this.config.app;
        const { enabled: corsEnabled, origin: corsOrigin } = this.config.cors;

        this.server = Bun.serve({
            port,
            hostname: "0.0.0.0",
            development: this.config.app.environment === 'development',
            fetch: async (request: Request, server: BunServer) => {
                try {
                    // Cria o contexto da requisição
                    const context: RequestContext = {
                        request,
                        params: {},
                        query: {},
                        body: await request.json().catch(() => ({})),
                        headers: Object.fromEntries(request.headers.entries()) as HttpHeaders,
                        metadata: {
                            startTime: Date.now(),
                            method: request.method as HttpMethod,
                            path: new URL(request.url).pathname
                        }
                    };

                    // Adiciona headers CORS se habilitado
                    const headers: HttpHeaders = {
                        'Server': name,
                        'Content-Type': 'application/json',
                    };

                    if (corsEnabled) {
                        headers['Access-Control-Allow-Origin'] = corsOrigin;
                        headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
                        headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

                        // Responde a requisições OPTIONS para CORS
                        if (context.metadata.method === 'OPTIONS') {
                            return new Response(null, { headers });
                        }
                    }

                    // TODO: Implementar roteamento e middleware
                    const responseData: HttpResponse<{ message: string }> = {
                        data: { message: 'Hello from Ninots!' },
                        metadata: {
                            timestamp: new Date().toISOString(),
                            path: context.metadata.path,
                            method: context.metadata.method,
                            duration: Date.now() - context.metadata.startTime
                        }
                    };

                    return new Response(
                        JSON.stringify(responseData),
                        {
                            status: 200,
                            headers
                        }
                    );
                } catch (error) {
                    return this.handleError(error);
                }
            },
            error(error: Error) {
                console.error('[Server Error]:', error);
                const errorResponse: HttpResponse<never> = {
                    error: {
                        message: 'Internal Server Error',
                        code: 'INTERNAL_SERVER_ERROR',
                    },
                    metadata: {
                        timestamp: new Date().toISOString()
                    }
                };

                return new Response(
                    JSON.stringify(errorResponse),
                    {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }
        });

        console.log(`🚀 Server running at http://localhost:${port}`);
    }

    /**
     * Trata erros da aplicação e retorna respostas HTTP apropriadas
     * 
     * @param error - Erro capturado
     * @returns {Response} Resposta HTTP formatada com o erro
     */
    private handleError(error: unknown): Response {
        if (error instanceof BaseError) {
            const errorResponse: HttpResponse<never> = {
                error: {
                    message: error.message,
                    code: error.code,
                    details: error.details,
                },
                metadata: {
                    timestamp: new Date().toISOString()
                }
            };

            return new Response(
                JSON.stringify(errorResponse),
                {
                    status: error.statusCode,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        console.error('[Unhandled Error]:', error);
        const errorResponse: HttpResponse<never> = {
            error: {
                message: 'Internal Server Error',
                code: 'INTERNAL_SERVER_ERROR',
            },
            metadata: {
                timestamp: new Date().toISOString()
            }
        };

        return new Response(
            JSON.stringify(errorResponse),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    /**
     * Para o servidor HTTP
     * 
     * @returns {void}
     */
    public stop(): void {
        if (this.server) {
            this.server.stop();
        }
    }
} 