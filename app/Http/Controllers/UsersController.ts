import type { RouteParams } from "@ninots/framework";
import type { UserService } from "@/app/Services/UserService";
import { Controller } from "@/app/Http/Controllers/Controller";

/**
 * Users HTTP controller.
 */
export class UsersController extends Controller {
    constructor(private readonly usersService: UserService) {
        super();
    }

    public async list(): Promise<Response> {
        return this.json(await this.usersService.all());
    }

    public async create(request: Request): Promise<Response> {
        const data = (await request.json()) as Record<string, unknown>;
        return this.created(await this.usersService.create(data));
    }

    public async show(_request: Request, params?: RouteParams): Promise<Response> {
        return this.json(await this.usersService.find(Number(params?.id)));
    }

    public async update(request: Request, params?: RouteParams): Promise<Response> {
        const data = (await request.json()) as Record<string, unknown>;
        return this.json(await this.usersService.update(Number(params?.id), data));
    }

    public async destroy(_request: Request, params?: RouteParams): Promise<Response> {
        await this.usersService.delete(Number(params?.id));
        return this.noContent();
    }
}
