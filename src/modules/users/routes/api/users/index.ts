import type { NextRequest } from "@ninots/http";
import { NextResponse } from "@ninots/http";
import { UserService } from "@/modules/users/services/UserService";

/**
 * User module API routes.
 */
export const userRoutes = {
    "/users": {
        GET: async (_req: NextRequest) => {
            const service = new UserService();
            return NextResponse.json(await service.all());
        },
        POST: async (req: NextRequest) => {
            const service = new UserService();
            const data = await req.json();
            return NextResponse.json(await service.create(data), { status: 201 });
        },
    },
};
