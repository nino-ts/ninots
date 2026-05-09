import type { NextRequest } from "@ninots/http";
import { NextResponse } from "@ninots/http";
import { NotificationService } from "@/modules/notifications/services/NotificationService";

/**
 * Notification module API routes.
 */
export const notificationRoutes = {
    "/notifications": {
        GET: async (_req: NextRequest) => {
            const service = new NotificationService();
            return NextResponse.json(await service.all());
        },
        POST: async (req: NextRequest) => {
            const service = new NotificationService();
            const data = await req.json();
            return NextResponse.json(await service.create(data), { status: 201 });
        },
    },
};
