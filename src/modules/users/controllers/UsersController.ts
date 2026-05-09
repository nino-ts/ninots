import { Inject } from "@ninots/container";
import type { Request } from "@ninots/http";
import type { UserService } from "@/modules/users/services/UserService";
import { Controller } from "@/shared/Http/Controllers/Controller";

/**
 * Users controller.
 *
 * Handles user-related HTTP requests.
 */
export class UsersController extends Controller {
    @Inject()
    private usersService: UserService;

    /**
     * List all users.
     *
     * @returns JSON response with users list
     */
    public async list(): Promise<Response> {
        return this.json(await this.usersService.all());
    }

    /**
     * Create a new user.
     *
     * @param request - The incoming HTTP request
     * @returns JSON response with created user
     */
    public async create(request: Request): Promise<Response> {
        const data = await request.json();
        return this.created(await this.usersService.create(data));
    }

    /**
     * Show a specific user.
     *
     * @param request - The incoming HTTP request
     * @returns JSON response with user
     */
    public async show(request: Request): Promise<Response> {
        const id = request.param("id");
        return this.json(await this.usersService.find(Number(id)));
    }

    /**
     * Update a specific user.
     *
     * @param request - The incoming HTTP request
     * @returns JSON response with updated user
     */
    public async update(request: Request): Promise<Response> {
        const id = request.param("id");
        const data = await request.json();
        return this.json(await this.usersService.update(Number(id), data));
    }

    /**
     * Delete a specific user.
     *
     * @param request - The incoming HTTP request
     * @returns No content response
     */
    public async destroy(request: Request): Promise<Response> {
        await this.usersService.delete(Number(request.param("id")));
        return this.noContent();
    }
}
