import type { Middleware } from "@ninots/framework";

/**
 * CORS middleware placeholder — wire when HTTP pipeline needs it.
 */
export const CorsMiddleware: Middleware = async (request, next) => {
    return next(request);
};
