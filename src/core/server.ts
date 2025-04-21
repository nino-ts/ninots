/**
 * Core HTTP Server for Ninots Framework
 *
 * This module defines the main server class responsible for handling
 * HTTP requests using Bun's native server.
 *
 * @module Core/Server
 */

import type { Server } from 'bun';
import type { FileSystemRouter } from './routing';

/**
 * Represents the Ninots HTTP server.
 *
 * Encapsulates Bun's native HTTP server, integrates with the routing system,
 * and manages the request lifecycle.
 */
export class NinotsServer {
  /**
   * The router instance responsible for matching requests to handlers.
   * @private
   */
  private router: FileSystemRouter;

  /**
   * The underlying Bun server instance.
   * @private
   * @type {Server | null}
   */
  private bunServer: Server | null = null;

  /**
   * Creates an instance of NinotsServer.
   * @param {FileSystemRouter} router - The router instance to use for request handling.
   */
  constructor(router: FileSystemRouter) {
    this.router = router;
  }

  /**
   * Starts the HTTP server and begins listening on the specified port.
   *
   * @param {number} port - The port number to listen on.
   */
  public listen(port: number): void {
    if (this.bunServer) {
      console.warn('[NinotsServer] ⚠️ Servidor já está em execução.');
      return;
    }

    try {
      const startTime = new Date();
      console.log(`[NinotsServer] 🚀 Iniciando servidor às ${startTime.toLocaleTimeString()}`);
      
      this.bunServer = Bun.serve({
        port: port,
        /**
         * Handles incoming HTTP requests.
         * Delegates request processing to the router.
         *
         * @param {Request} request - The incoming request object.
         * @returns {Promise<Response>} A promise resolving to the response.
         */
        fetch: async (request: Request): Promise<Response> => {
          const requestId = Math.random().toString(36).substring(2, 10);
          const startTime = Date.now();
          const url = new URL(request.url);
          
          console.log(`[NinotsServer] 📥 #${requestId} Requisição recebida: ${request.method} ${url.pathname}`);
          
          try {
            // Log request details in development mode
            if (process.env.NODE_ENV !== 'production') {
              const headers: Record<string, string> = {};
              request.headers.forEach((value, key) => {
                headers[key] = value;
              });
              
              // Log request details if it's not a GET request
              if (request.method !== 'GET') {
                try {
                  // Clone the request to read the body without consuming it
                  const clonedReq = request.clone();
                  const contentType = request.headers.get('content-type') || '';
                  
                  if (contentType.includes('application/json')) {
                    const body = await clonedReq.json().catch(() => ({}));
                    console.log(`[NinotsServer] 📝 #${requestId} Body:`, JSON.stringify(body, null, 2));
                  }
                } catch (error) {
                  console.log(`[NinotsServer] ⚠️ #${requestId} Não foi possível ler o corpo da requisição:`, error);
                }
              }
            }
            
            // Delegate to the router to find and execute the handler
            const response = await this.router.handleRequest(request);
            
            const duration = Date.now() - startTime;
            console.log(`[NinotsServer] ✅ #${requestId} Resposta enviada: ${response.status} (${duration}ms)`);
            
            return response;
          } catch (error) {
            const duration = Date.now() - startTime;
            console.error(`[NinotsServer] ❌ #${requestId} Erro ao processar requisição (${duration}ms):`, error);
            
            if (error instanceof Error) {
              console.error(`[NinotsServer] #${requestId} Stack trace:`, error.stack);
            }
            
            // Basic error response
            return new Response(JSON.stringify({
              error: 'Internal Server Error',
              message: error instanceof Error ? error.message : 'Um erro inesperado ocorreu',
              path: url.pathname,
              timestamp: new Date().toISOString()
            }), { 
              status: 500,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }
        },
        /**
         * Handles errors occurring during server operation.
         *
         * @param {Error} error - The error object.
         * @returns {Response | undefined} An optional response to send back.
         */
        error: (error: Error): Response | undefined => {
          console.error('[NinotsServer] 🔥 Erro crítico no servidor:', error);
          console.error('[NinotsServer] Stack trace:', error.stack);
          
          // Return a generic error response
          return new Response(JSON.stringify({
            error: 'Internal Server Error',
            message: error.message,
            timestamp: new Date().toISOString()
          }), { 
            status: 500,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        },
      });

      console.log(`[NinotsServer] 🚀 Servidor iniciado em http://localhost:${this.bunServer.port}`);
      console.log(`[NinotsServer] 🌐 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[NinotsServer] ⏱️  Tempo de inicialização: ${Date.now() - startTime.getTime()}ms`);

    } catch (error) {
      console.error(`[NinotsServer] Failed to start server on port ${port}:`, error);
      process.exit(1);
    }
  }

  /**
   * Stops the HTTP server.
   */
  public stop(): void {
    if (this.bunServer) {
      this.bunServer.stop(true); // true for graceful shutdown
      this.bunServer = null;
      console.log('[NinotsServer] Server stopped.');
    } else {
      console.warn('[NinotsServer] Server is not running.');
    }
  }
}
