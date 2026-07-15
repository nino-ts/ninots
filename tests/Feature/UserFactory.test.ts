import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { User } from "@/app/Models/User";
import { setupTestDatabase, teardownTestDatabase } from "@/tests/support/database";

describe("UserFactory", () => {
    beforeEach(async () => {
        await setupTestDatabase();
    });

    afterEach(async () => {
        await teardownTestDatabase();
    });

    test("creates a persisted user with factory defaults", async () => {
        const user = await User.factory().create();

        expect(user.id).toBeDefined();
        expect(user.name).toBeString();
        expect(user.email).toContain("@");
    });

    test("count() creates multiple users", async () => {
        const users = await User.factory(2).create();

        expect(users).toHaveLength(2);
        expect(users[0]?.email).not.toBe(users[1]?.email);
    });

    test("state() overrides attributes without hardcoded fixtures", async () => {
        const user = await User.factory()
            .state({ name: "Seeded Nova" })
            .create();

        expect(user.name).toBe("Seeded Nova");
    });
});
