import { afterEach, describe, expect, test } from "bun:test";
import path from "node:path";
import {
    Kernel,
    MigrateCommand,
    MigrateRefreshCommand,
    MigrateRollbackCommand,
    Migrator,
} from "@ninots/framework";
import databaseConfig from "@/config/database";
import { setupTestDatabase, teardownTestDatabase } from "@/tests/support/database";

const migrationsPath = path.join(process.cwd(), databaseConfig.migrations.directory);

function createMigrateKernel(migrator: Migrator): Kernel {
    const kernel = new Kernel();
    kernel.setOutput({
        writeLine(_text: string): void {},
    });
    kernel.register(new MigrateCommand({ resolveMigrator: () => migrator }));
    kernel.register(new MigrateRollbackCommand({ resolveMigrator: () => migrator }));
    kernel.register(new MigrateRefreshCommand({ resolveMigrator: () => migrator }));
    return kernel;
}

describe("migrate lifecycle (rollback + refresh)", () => {
    afterEach(async () => {
        await teardownTestDatabase();
    });

    test("kernel registers migrate:rollback and migrate:refresh", () => {
        const kernel = new Kernel();
        kernel.register(
            new MigrateRollbackCommand({
                resolveMigrator: () => {
                    throw new Error("resolveMigrator should not run for registration checks");
                },
            }),
        );
        kernel.register(
            new MigrateRefreshCommand({
                resolveMigrator: () => {
                    throw new Error("resolveMigrator should not run for registration checks");
                },
            }),
        );

        expect(kernel.findCommand("migrate:rollback")?.getDefinition().name).toBe("migrate:rollback");
        expect(kernel.findCommand("migrate:refresh")?.getDefinition().name).toBe("migrate:refresh");
        expect(kernel.findCommand("migrate:rollback")?.getDefinition().description).toContain("Rollback");
        expect(kernel.findCommand("migrate:refresh")?.getDefinition().description).toContain("Reset");
    });

    test("migrate then rollback reverts the last batch", async () => {
        const database = await setupTestDatabase();
        const migrator = new Migrator({
            database,
            path: migrationsPath,
            table: databaseConfig.migrations.table,
        });

        const tablesBefore = await database
            .connection()
            .query<{ name: string }>("SELECT name FROM sqlite_master WHERE type = 'table'");
        expect(tablesBefore.map((row) => row.name)).toContain("users");

        const kernel = createMigrateKernel(migrator);
        const exitCode = await kernel.run(["migrate:rollback"]);

        expect(exitCode).toBe(0);

        const tablesAfter = await database
            .connection()
            .query<{ name: string }>("SELECT name FROM sqlite_master WHERE type = 'table'");
        expect(tablesAfter.map((row) => row.name)).not.toContain("users");
        expect(await migrator.getLastBatchNumber()).toBe(0);
    });

    test("migrate:refresh restores a clean post-migrate schema", async () => {
        const database = await setupTestDatabase();
        await database.connection().run(
            "INSERT INTO users (email, name, password) VALUES ('stale@ninots.test', 'Stale', 'secret')",
        );

        const migrator = new Migrator({
            database,
            path: migrationsPath,
            table: databaseConfig.migrations.table,
        });
        const kernel = createMigrateKernel(migrator);

        const exitCode = await kernel.run(["migrate:refresh"]);
        expect(exitCode).toBe(0);

        const rows = await database.connection().query<{ email: string }>("SELECT email FROM users");
        expect(rows).toHaveLength(0);
        expect(await migrator.getLastBatchNumber()).toBe(1);

        const tables = await database
            .connection()
            .query<{ name: string }>("SELECT name FROM sqlite_master WHERE type = 'table'");
        expect(tables.map((row) => row.name)).toContain("users");
    });

    test("migrate:rollback with --step=1 reverts a single migration", async () => {
        const database = await setupTestDatabase();
        const migrator = new Migrator({
            database,
            path: migrationsPath,
            table: databaseConfig.migrations.table,
        });
        const kernel = createMigrateKernel(migrator);

        const exitCode = await kernel.run(["migrate:rollback", "--step=1"]);
        expect(exitCode).toBe(0);

        const tables = await database
            .connection()
            .query<{ name: string }>("SELECT name FROM sqlite_master WHERE type = 'table'");
        expect(tables.map((row) => row.name)).not.toContain("users");
    });
});

describe("CLI bootstrap registers migrate lifecycle commands", () => {
    test("nino help lists migrate:rollback and migrate:refresh", async () => {
        const proc = Bun.spawn(["bun", "./nino", "help"], {
            cwd: process.cwd(),
            stdout: "pipe",
            stderr: "pipe",
        });
        const stdout = await new Response(proc.stdout).text();
        const exitCode = await proc.exited;

        expect(exitCode).toBe(0);
        expect(stdout).toContain("migrate:rollback");
        expect(stdout).toContain("migrate:refresh");
    });
});
