import type { Request, NextFunction, Response } from '@ninots/http';

/**
 * CORS middleware.
 *
 * Adds Cross-Origin Resource Sharing headers to responses.
 */
export function CorsMiddleware(
    request: Request,
    next: NextFunction,
    response: Response
): Response | void {
    // TODO: Implement CORS headers
    // response.headers.set('Access-Control-Allow-Origin', '*');
    // response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return next();
}
