import type { NextRequest, RouteContext } from "@ninots/http";
import { NextResponse } from "@ninots/http";
import { Validate } from "@ninots/validation";
import { UpdateUserRequest } from "@/modules/users/requests/UpdateUserRequest";
import { UserService } from "@/modules/users/services/UserService";

/**
 * Update a specific user.
 *
 * PUT /api/users/:id
 *
 * @param _req - The incoming HTTP request
 * @param ctx - The route context with params
 * @returns JSON response with updated user
 */
@Validate(UpdateUserRequest)
export async function PUT(_req: NextRequest, ctx: RouteContext<"/users/[id]">): Promise<typeof NextResponse> {
    const { id } = await ctx.params;
    const usersService = new UserService();
    const data = await _req.json();
    const user = await usersService.update(Number(id), data);
    return NextResponse.json(user);
}
