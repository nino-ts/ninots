import type { Request, NextFunction, Response } from '@ninots/http';

/**
 * Authentication middleware.
 *
 * Ensures requests are authenticated.
 */
export function AuthMiddleware(
    request: Request,
    next: NextFunction,
    response: Response
): Response | void {
    // TODO: Implement authentication check
    // const token = request.headers.get('Authorization');
    // if (!token || !isValidToken(token)) {
    //     return Response.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    return next();
}
