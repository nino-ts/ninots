import type { Application, Router, RouteParams } from "@ninots/framework";
import { UsersController } from "@/app/Http/Controllers/UsersController";

// -- nino:api-imports --

/**
 * API routes.
 */
export function registerApiRoutes(router: Router, app: Application): void {
    // -- nino:api-bindings --
    const users = app.make<UsersController>(UsersController.name);

    router.group({ prefix: "/api" }, () => {
        router.get("/users", () => users.list()).name("users.index");
        router.post("/users", (request: Request) => users.create(request)).name("users.store");
        router
            .get("/users/:id", (request: Request, params?: RouteParams) => users.show(request, params))
            .name("users.show");
        router
            .put("/users/:id", (request: Request, params?: RouteParams) => users.update(request, params))
            .name("users.update");
        router
            .delete("/users/:id", (request: Request, params?: RouteParams) => users.destroy(request, params))
            .name("users.destroy");

        // -- nino:api-routes --
    });
}
