import type { NextRequest, RouteContext } from "@ninots/http";
import { NextResponse } from "@ninots/http";
import { UserService } from "@/modules/users/services/UserService";

/**
 * Show a specific user.
 *
 * GET /api/users/:id
 *
 * @param _req - The incoming HTTP request
 * @param ctx - The route context with params
 * @returns JSON response with user
 */
export async function GET(_req: NextRequest, ctx: RouteContext<"/users/[id]">): Promise<typeof NextResponse> {
    const { id } = await ctx.params;
    const usersService = new UserService();
    const user = await usersService.find(Number(id));
    return NextResponse.json(user);
}
