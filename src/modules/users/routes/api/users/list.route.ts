import type { NextRequest } from "@ninots/http";
import { NextResponse } from "@ninots/http";
import { UserService } from "@/modules/users/services/UserService";

/**
 * List all users.
 *
 * GET /api/users
 *
 * @param request - The incoming HTTP request
 * @returns JSON response with users list
 */
export async function GET(_request: NextRequest): Promise<typeof NextResponse> {
    const usersService = new UserService();
    const users = await usersService.all();
    return NextResponse.json(users);
}
