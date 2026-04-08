import type { Request } from '@ninots/http';
import { Response } from '@ninots/http';

/**
 * Verify webhook signature middleware.
 *
 * Validates payment webhook signatures.
 */
export function VerifyWebhookSignature(
    request: Request,
    next: () => Response | Promise<Response>,
    response: Response
): Response | void {
    // TODO: Implement webhook signature verification
    // const signature = request.headers.get('x-webhook-signature');
    // if (!isValidSignature(signature)) {
    //     return Response.json({ error: 'Invalid signature' }, { status: 401 });
    // }
    return next();
}
