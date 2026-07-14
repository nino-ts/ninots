import type { Request, Response } from "@ninots/http";

/**
 * Verify webhook signature middleware.
 *
 * Validates payment webhook signatures.
 */
export function VerifyWebhookSignature(
    _request: Request,
    next: () => Response | Promise<Response>,
    _response: Response,
): Response | undefined {
    // TODO: Implement webhook signature verification
    // const signature = request.headers.get('x-webhook-signature');
    // if (!isValidSignature(signature)) {
    //     return Response.json({ error: 'Invalid signature' }, { status: 401 });
    // }
    return next();
}
