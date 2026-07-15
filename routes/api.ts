import type { Application, Router, RouteParams } from "@ninots/framework";
import { UsersController } from "@/app/Http/Controllers/UsersController";

/**
 * API routes.
 */
export function registerApiRoutes(router: Router, app: Application): void {
    const users = app.make<UsersController>(UsersController.name);

    router.group({ prefix: "/api" }, () => {
        router.get("/users", () => users.list());
        router.post("/users", (request) => users.create(request));
        router.get("/users/:id", (request, params?: RouteParams) => users.show(request, params));
        router.put("/users/:id", (request, params?: RouteParams) => users.update(request, params));
        router.delete("/users/:id", (request, params?: RouteParams) => users.destroy(request, params));
    });
}
