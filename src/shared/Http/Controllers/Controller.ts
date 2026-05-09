import { Response } from "@ninots/http";

/**
 * Base controller.
 *
 * Provides common response helpers for all controllers.
 */
export abstract class Controller {
    /**
     * Return a JSON response.
     *
     * @param data - The response data
     * @param status - The HTTP status code
     * @returns JSON response
     */
    protected json(data: unknown, status = 200): Response {
        return Response.json(data, status);
    }

    /**
     * Return a created response.
     *
     * @param data - The response data
     * @returns JSON response with 201 status
     */
    protected created(data: unknown): Response {
        return Response.json(data, 201);
    }

    /**
     * Return a no content response.
     *
     * @returns Response with 204 status
     */
    protected noContent(): Response {
        return new Response(null, { status: 204 });
    }

    /**
     * Return a redirect response.
     *
     * @param url - The URL to redirect to
     * @returns Redirect response
     */
    protected redirect(url: string): Response {
        return Response.redirect(url);
    }

    /**
     * Return an error response.
     *
     * @param message - The error message
     * @param status - The HTTP status code
     * @returns JSON error response
     */
    protected error(message: string, status = 400): Response {
        return Response.json({ error: message }, status);
    }
}
