/**
 * File System Based Router for Ninots Framework
 *
 * Scans the `src/app` directory to automatically map file structure
 * to API routes and handles request dispatching.
 *
 * @module Core/Routing
 */

import { readdir } from 'node:fs/promises';
import path from 'node:path';

// Define a type for route handlers
// They receive the Bun Request and should return a Bun Response or Promise<Response>
type RouteHandler = (request: Request) => Response | Promise<Response>;

// Define a structure to store route information
interface RouteInfo {
  method: string; // GET, POST, PUT, DELETE, etc.
  handler: RouteHandler;
}

/**
 * Implements a file-system based router.
 *
 * Scans the `src/app` directory, maps files to routes, and handles
 * incoming requests by dynamically importing and executing the
 * appropriate handler based on the request method and path.
 */
export class FileSystemRouter {
  /**
   * Stores the discovered routes.
   * The key is the route path (e.g., '/', '/users', '/users/:id'),
   * and the value is an object mapping HTTP methods to handlers.
   * @private
   * @type {Map<string, Map<string, RouteHandler>>}
   */
  private routes: Map<string, Map<string, RouteHandler>> = new Map();

  /**
   * The base directory for scanning routes.
   * @private
   * @constant {string}
   */
  private readonly routesDir = path.join(process.cwd(), 'src', 'app');

  /**
   * Initializes the router by scanning the routes directory.
   * This method should be called before the server starts listening.
   * @public
   * @async
   */
  public async initialize(): Promise<void> {
    console.log(`[Router] Scanning for routes in ${this.routesDir}...`);
    this.routes.clear(); // Clear existing routes before rescanning
    await this.scanDirectory(this.routesDir);
    console.log(`[Router] Found ${this.routes.size} route paths.`);
    // Optional: Print discovered routes for debugging
    this.printRoutes(); // Activated for debugging
  }

  /**
   * Recursively scans a directory for route files.
   *
   * @param {string} dirPath - The absolute path to the directory to scan.
   * @param {string} [baseRoute=''] - The base route path accumulated so far.
   * @private
   * @async
   */
  private async scanDirectory(dirPath: string, baseRoute: string = ''): Promise<void> {
    try {
      const entries = await readdir(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const routePart = this.getRoutePart(entry.name);

        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          await this.scanDirectory(fullPath, path.join(baseRoute, routePart));
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))) {
          // Process route files (e.g., index.ts, users.ts, [id].ts)
          const routePath = path.join(baseRoute, routePart === 'index' ? '' : routePart);
          await this.registerRouteFile(fullPath, routePath || '/'); // Ensure root is '/'
        }
      }
    } catch (error: any) {
      // Handle cases where the directory might not exist initially
      if (error.code === 'ENOENT' && dirPath === this.routesDir) {
        console.warn(`[Router] Routes directory ${this.routesDir} not found. No routes loaded.`);
      } else {
        console.error(`[Router] Error scanning directory ${dirPath}:`, error);
      }
    }
  }

  /**
   * Extracts the route part from a filename (removes extension, handles index).
   *
   * @param {string} filename - The name of the file or directory.
   * @returns {string} The corresponding route part.
   * @private
   */
  private getRoutePart(filename: string): string {
    const nameWithoutExt = filename.replace(/\.(ts|js)$/, '');
    // Basic handling for dynamic segments like [id] -> :id (can be expanded)
    return nameWithoutExt.replace(/\[([^\]]+)\]/g, ':$1');
  }

  /**
   * Dynamically imports a route file and registers its handlers.
   *
   * @param {string} filePath - The absolute path to the route file.
   * @param {string} routePath - The calculated route path.
   * @private
   * @async
   */
  private async registerRouteFile(filePath: string, routePath: string): Promise<void> {
    try {
      // Use dynamic import to load the module
      const module = await import(filePath);
      let routeHandlers = this.routes.get(routePath);
      if (!routeHandlers) {
        routeHandlers = new Map<string, RouteHandler>();
        this.routes.set(routePath, routeHandlers);
      }

      // Look for exported functions named after HTTP methods (uppercase)
      for (const exportName in module) {
        const potentialHandler = module[exportName];
        const upperExportName = exportName.toUpperCase();

        if (typeof potentialHandler === 'function' &&
            ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'].includes(upperExportName))
        {
          if (routeHandlers.has(upperExportName)) {
             console.warn(`[Router] Duplicate handler for ${upperExportName} ${routePath} in ${filePath}. Overwriting.`);
          }
          routeHandlers.set(upperExportName, potentialHandler as RouteHandler);
          // console.log(`[Router] Registered ${upperExportName} ${routePath}`);
        }
      }
    } catch (error) {
      console.error(`[Router] Failed to import or register route file ${filePath}:`, error);
    }
  }

  /**
   * Handles an incoming request by finding and executing the appropriate handler.
   *
   * @param {Request} request - The incoming Bun Request object.
   * @returns {Promise<Response>} A promise resolving to the Bun Response.
   * @public
   * @async
   */
  public async handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method.toUpperCase();
    console.log(`[Router] Handling request: ${method} ${pathname}`); // Added log

    // TODO: Implement more sophisticated route matching (e.g., with parameters :id)
    // For now, simple exact match
    const routeHandlers = this.routes.get(pathname);

    if (routeHandlers) {
      const handler = routeHandlers.get(method);
      if (handler) {
        try {
          // Execute the handler
          const response = await handler(request);
          // Ensure it's a Response object
          return response instanceof Response ? response : new Response(String(response));
        } catch (error) {
          console.error(`[Router] Error executing handler for ${method} ${pathname}:`, error);
          return new Response('Internal Server Error', { status: 500 });
        }
      } else {
        // Method Not Allowed
        return new Response('Method Not Allowed', { status: 405 });
      }
    } else {
      // Not Found
      console.log(`[Router] No route found for: ${method} ${pathname}`); // Added log
      return new Response('Not Found', { status: 404 });
    }
  }

   /**
   * Prints the discovered routes to the console (for debugging).
   * @private
   */
  private printRoutes(): void {
    console.log('[Router] Discovered Routes:');
    if (this.routes.size === 0) {
      console.log('  No routes found.');
      return;
    }
    this.routes.forEach((handlers, path) => {
      handlers.forEach((_, method) => {
        console.log(`  ${method} ${path}`);
      });
    });
  }
}
