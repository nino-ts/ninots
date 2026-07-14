import type { NextFunction, Request, Response } from "@ninots/http";

/**
 * Authentication middleware.
 *
 * Ensures requests are authenticated.
 */
export function AuthMiddleware(_request: Request, next: NextFunction, _response: Response): Response | undefined {
    // TODO: Implement authentication check
    // const token = request.headers.get('Authorization');
    // if (!token || !isValidToken(token)) {
    //     return Response.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    return next();
}
