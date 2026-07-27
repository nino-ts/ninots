import type { Middleware } from "@ninots/middleware";
type NextHandler = (request: Request) => Response | Promise<Response>;

/**
 * CORS middleware placeholder — wire when HTTP pipeline needs it.
 */
export const CorsMiddleware: Middleware = async (request: Request, next: NextHandler) => {
    return next(request);
};
