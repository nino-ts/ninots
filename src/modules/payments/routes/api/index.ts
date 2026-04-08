import type { NextRequest } from '@ninots/http';
import { NextResponse } from '@ninots/http';
import { PaymentService } from '@/modules/payments/services/PaymentService';

/**
 * Payment module API routes.
 */
export const paymentRoutes = {
    '/payments': {
        GET: async (req: NextRequest) => {
            const service = new PaymentService();
            return NextResponse.json(await service.all());
        },
        POST: async (req: NextRequest) => {
            const service = new PaymentService();
            const data = await req.json();
            return NextResponse.json(await service.create(data), { status: 201 });
        },
    },
};
