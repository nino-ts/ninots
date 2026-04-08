import type { NextRequest, RouteContext } from '@ninots/http';
import { NextResponse } from '@ninots/http';
import { UserService } from '@/modules/users/services/UserService';

/**
 * Delete a specific user.
 *
 * DELETE /api/users/:id
 *
 * @param _req - The incoming HTTP request
 * @param ctx - The route context with params
 * @returns No content response
 */
export async function DELETE(
    _req: NextRequest,
    ctx: RouteContext<'/users/[id]'>
): Promise<typeof NextResponse> {
    const { id } = await ctx.params;
    const usersService = new UserService();
    await usersService.delete(Number(id));
    return new NextResponse(null, { status: 204 });
}
