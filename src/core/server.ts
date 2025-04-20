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
      console.warn('[NinotsServer] Server is already running.');
      return;
    }

    try {
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
          try {
            // Delegate to the router to find and execute the handler
            const response = await this.router.handleRequest(request);
            return response;
          } catch (error) {
            console.error('[NinotsServer] Error handling request:', error);
            // Basic error response
            return new Response('Internal Server Error', { status: 500 });
          }
        },
        /**
         * Handles errors occurring during server operation.
         *
         * @param {Error} error - The error object.
         * @returns {Response | undefined} An optional response to send back.
         */
        error: (error: Error): Response | undefined => {
          console.error('[NinotsServer] Bun.serve error:', error);
          // Return a generic error response
          return new Response('Internal Server Error', { status: 500 });
        },
      });

      console.log(`[NinotsServer] Listening on http://localhost:${this.bunServer.port}`);

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
