import type { NextRequest } from '@ninots/http';
import { NextResponse } from '@ninots/http';
import { UserService } from '@/modules/users/services/UserService';
import { Validate } from '@ninots/validation';
import { CreateUserRequest } from '@/modules/users/requests/CreateUserRequest';

/**
 * Create a new user.
 *
 * POST /api/users
 *
 * @param request - The incoming HTTP request
 * @returns JSON response with created user
 */
@Validate(CreateUserRequest)
export async function POST(request: NextRequest): Promise<typeof NextResponse> {
    const usersService = new UserService();
    const data = await request.json();
    const user = await usersService.create(data);
    return NextResponse.json(user, { status: 201 });
}
