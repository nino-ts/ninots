import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { EVENT_DISPATCHER_KEY } from "@ninots/framework";
import type { EventDispatcher } from "@ninots/framework";
import { UserService } from "@/app/Services/UserService";
import { User } from "@/app/Models/User";
import { bootstrap } from "@/bootstrap/app";
import { setupTestDatabase, teardownTestDatabase } from "@/tests/support/database";

describe("UserService with Factory", () => {
    beforeEach(async () => {
        await setupTestDatabase();
    });

    afterEach(async () => {
        await teardownTestDatabase();
    });

    test("creates users using factory-generated attributes", async () => {
        const app = await bootstrap();
        const events = app.make<EventDispatcher>(EVENT_DISPATCHER_KEY);
        const service = new UserService(events);

        const template = await User.factory().make();
        const created = await service.create({
            email: template.email,
            name: template.name,
            password: template.password,
        });

        const found = await service.find(created.id as number);

        expect(found?.email).toBe(template.email);
        expect(found?.name).toBe(template.name);
    });
});
