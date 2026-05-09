import type { NextRequest, RouteContext } from "@ninots/http";
import { NextResponse } from "@ninots/http";
import { PaymentService } from "@/modules/payments/services/PaymentService";

/**
 * Refund a payment.
 *
 * POST /api/payments/:id/refund
 *
 * @param request - The incoming HTTP request
 * @param ctx - The route context with params
 * @returns JSON response with refund details
 */
export async function POST(_request: NextRequest, ctx: RouteContext<"/payments/[id]">): Promise<typeof NextResponse> {
    const { id } = await ctx.params;
    const paymentService = new PaymentService();
    const refund = await paymentService.refund(Number(id));
    return NextResponse.json(refund);
}
