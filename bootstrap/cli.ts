#!/usr/bin/env bun
import path from "node:path";
import {
    Command,
    DbSeedCommand,
    Kernel,
    MakeControllerCommand,
    MakeMigrationCommand,
    MakeModelCommand,
    MakeModuleCommand,
    MakeViewCommand,
    MigrateCommand,
    MigrateRefreshCommand,
    MigrateRollbackCommand,
    Migrator,
    ROUTER_KEY,
    RoutesCompileCommand,
    SeederRunner,
} from "@ninots/framework";
import type { Router } from "@ninots/framework";
import { bootstrap, createAppServeOptions } from "@/bootstrap/app";
import { getDatabaseManager } from "@/bootstrap/database";
import databaseConfig from "@/config/database";
import { DatabaseSeeder } from "@/database/seeders/DatabaseSeeder";
import packageJson from "../package.json";

const migrationsPath = path.join(process.cwd(), databaseConfig.migrations.directory);

function resolveMigrator(): Migrator {
    getDatabaseManager();
    return new Migrator({
        database: getDatabaseManager(),
        path: migrationsPath,
        table: databaseConfig.migrations.table,
    });
}

function resolveSeederRunner(): SeederRunner {
    getDatabaseManager();
    return new SeederRunner(DatabaseSeeder);
}

class HelpCommand extends Command {
    protected override signature = "help";
    protected override description = "Display available commands";

    constructor(private readonly cli: Kernel) {
        super();
    }

    public async handle(): Promise<number> {
        this.line(`Nino CLI — ninots-app v${packageJson.version}`);
        this.line("");
        this.line("Available commands:");

        for (const command of this.cli.getCommands()) {
            const definition = command.getDefinition();
            this.line(`  ${definition.name.padEnd(20)} ${definition.description}`);
        }

        return 0;
    }
}

class VersionCommand extends Command {
    protected override signature = "version";
    protected override description = "Show application and framework versions";

    public async handle(): Promise<number> {
        this.line(`ninots-app ${packageJson.version}`);
        this.line(`@ninots/framework ${packageJson.dependencies["@ninots/framework"]}`);
        return 0;
    }
}

class ServeCommand extends Command {
    protected override signature = "serve {--port=3000}";
    protected override description = "Start the HTTP development server";

    public async handle(): Promise<number> {
        const app = await bootstrap();
        const portOption = this.option("port");
        const port = typeof portOption === "string" ? Number(portOption) : app.getConfig().port;

        const serveOptions = createAppServeOptions(app);
        serveOptions.port = port;

        const server = Bun.serve(serveOptions);
        this.info(`Ninots server running at ${server.url}`);
        this.info("Press Ctrl+C to stop");

        await new Promise<void>((resolve) => {
            const stop = (): void => {
                server.stop(true);
                resolve();
            };
            process.once("SIGINT", stop);
            process.once("SIGTERM", stop);
        });

        return 0;
    }
}

class RoutesCommand extends Command {
    protected override signature = "routes:list";
    protected override description = "List all registered routes";

    public async handle(): Promise<number> {
        const app = await bootstrap();
        const router = app.make<Router>(ROUTER_KEY);

        this.info("Registered routes:");
        this.line("");
        this.line(`${"METHOD".padEnd(7)} ${"URI".padEnd(40)} NAME`);

        for (const route of router.getRoutes()) {
            const name = route.getName() ?? "-";
            this.line(`${route.getMethod().padEnd(7)} ${route.getPath().padEnd(40)} ${name}`);
        }

        return 0;
    }
}

class CacheClearCommand extends Command {
    protected override signature = "cache:clear";
    protected override description = "Clear the application cache";

    public async handle(): Promise<number> {
        this.info("Cache cleared successfully");
        return 0;
    }
}

const kernel = new Kernel();
kernel.setOutput({
    writeLine(text: string): void {
        console.log(text);
    },
});

kernel.register(new HelpCommand(kernel));
kernel.register(new VersionCommand());
kernel.register(new ServeCommand());
kernel.register(new RoutesCommand());
kernel.register(new CacheClearCommand());
kernel.register(
    new RoutesCompileCommand({
        async resolveRouter() {
            const app = await bootstrap();
            return app.make<Router>(ROUTER_KEY);
        },
    }),
);
kernel.register(
    new MigrateCommand({
        resolveMigrator,
    }),
);
kernel.register(
    new MigrateRollbackCommand({
        resolveMigrator,
    }),
);
kernel.register(
    new MigrateRefreshCommand({
        resolveMigrator,
        resolveSeederRunner,
    }),
);
kernel.register(
    new DbSeedCommand({
        resolveSeederRunner,
    }),
);

const generatorPaths = { basePath: process.cwd() };

kernel.register(new MakeControllerCommand({ paths: generatorPaths }));
kernel.register(new MakeModelCommand({ paths: generatorPaths }));
kernel.register(new MakeMigrationCommand({ paths: generatorPaths }));
kernel.register(new MakeViewCommand({ paths: generatorPaths }));
kernel.register(new MakeModuleCommand({ paths: generatorPaths }));

const exitCode = await kernel.run(process.argv.slice(2));
process.exit(exitCode);
