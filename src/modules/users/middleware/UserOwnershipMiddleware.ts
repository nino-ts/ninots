import type { Request, NextFunction, Response } from '@ninots/http';

/**
 * User ownership middleware.
 *
 * Ensures users can only access their own resources.
 */
export function UserOwnershipMiddleware(
    request: Request,
    next: NextFunction,
    response: Response
): Response | void {
    // TODO: Implement ownership check
    // const userId = request.param('id');
    // const authenticatedUserId = request.user?.id;
    // if (userId !== authenticatedUserId) {
    //     return Response.json({ error: 'Forbidden' }, { status: 403 });
    // }
    return next();
}
