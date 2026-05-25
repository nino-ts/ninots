/**
 * CORS middleware.
 *
 * Adds Cross-Origin Resource Sharing headers to responses.
 */
export type NextFunction = () => Response | void;

export function CorsMiddleware(
    request: globalThis.Request,
    next: NextFunction,
    response: globalThis.Response
): Response | void {
    // TODO: Implement CORS headers
    // response.headers.set('Access-Control-Allow-Origin', '*');
    // response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return next();
}
