/**
 * Base controller with JSON response helpers.
 */
export abstract class Controller {
    protected json(data: unknown, status = 200): Response {
        return Response.json(data, { status });
    }

    protected created(data: unknown): Response {
        return Response.json(data, { status: 201 });
    }

    protected noContent(): Response {
        return new Response(null, { status: 204 });
    }

    protected redirect(url: string): Response {
        return Response.redirect(url);
    }

    protected error(message: string, status = 400): Response {
        return Response.json({ error: message }, { status });
    }
}
