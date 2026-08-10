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
    RoutesCompileCommand,
} from "@ninots/console";
import { Migrator, SeederRunner } from "@ninots/orm";
import type { CacheManager } from "@ninots/cache";
import type { JobRegistry, QueueManager } from "@ninots/queue";
import { runQueueWork } from "@ninots/queue";
import { emitRouteRegistry, startRoutesAutoHook } from "@ninots/routing";
import { CACHE_MANAGER_KEY } from "@/app/Cache/createCacheServices";
import { JOB_REGISTRY_KEY, QUEUE_MANAGER_KEY } from "@/app/Queue/createQueueServices";
import { bootstrap, createAppServeOptions } from "@/bootstrap/app";
import { getDatabaseManager } from "@/bootstrap/database";
import { resolveFreshRouter } from "@/bootstrap/resolveFreshRouter";
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
        this.line(`@ninots/* direct packages (Sprint 14)`);
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

        const abortController = new AbortController();
        const server = Bun.serve(serveOptions);
        this.info(`Ninots server running at ${server.url}`);
        this.info("Press Ctrl+C to stop");

        if (app.getConfig().development) {
            this.info(`Client HMR demo: ${new URL("/hmr-demo", server.url).href}`);

            const routesArtifactRel = "types/routes.d.ts";
            const routesArtifactPath = path.join(process.cwd(), routesArtifactRel);

            startRoutesAutoHook({
                routesDirs: ["routes", "app/Modules"],
                // Isolated bootstrap kept for type + fallback; debounce uses cold subprocess
                // so Bun module cache cannot stale the registry (Fixes #47).
                resolveRouter: resolveFreshRouter,
                compileArtifact: async (): Promise<"written" | "unchanged"> => {
                    const artifact = Bun.file(routesArtifactPath);
                    const before = (await artifact.exists()) ? await artifact.text() : "";

                    const proc = Bun.spawn(["bun", "./nino", "routes:compile"], {
                        cwd: process.cwd(),
                        stdout: "pipe",
                        stderr: "pipe",
                    });
                    const [exitCode, stdout, stderr] = await Promise.all([
                        proc.exited,
                        new Response(proc.stdout).text(),
                        new Response(proc.stderr).text(),
                    ]);
                    if (exitCode !== 0) {
                        const detail = stderr.trim().length > 0 ? stderr.trim() : stdout.trim();
                        throw new Error(
                            detail.length > 0
                                ? `routes:compile exited ${exitCode}: ${detail}`
                                : `routes:compile exited ${exitCode}`,
                        );
                    }

                    const after = await Bun.file(routesArtifactPath).text();
                    return before === after ? "unchanged" : "written";
                },
                signal: abortController.signal,
                onWarn: (message: string) => {
                    this.warn(message);
                },
                onWritten: (outRel: string) => {
                    this.info(`✓ ${outRel} updated`);
                },
            }).catch((error: unknown) => {
                const msg = error instanceof Error ? error.message : String(error);
                this.warn(`routes auto-hook stopped: ${msg}`);
            });
        }

        await new Promise<void>((resolve) => {
            const stop = (): void => {
                abortController.abort();
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
        const router = await resolveFreshRouter();

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
        const app = await bootstrap();
        const cache = app.make<CacheManager>(CACHE_MANAGER_KEY);
        await cache.flush();
        this.info("Cache cleared successfully");
        return 0;
    }
}

class QueueWorkCommand extends Command {
    protected override signature = "queue:work {--queue=} {--sleep=1000}";
    protected override description = "Process jobs on the queue";

    public async handle(): Promise<number> {
        const app = await bootstrap();
        const manager = app.make<QueueManager>(QUEUE_MANAGER_KEY);
        const registry = app.make<JobRegistry>(JOB_REGISTRY_KEY);
        const queueOption = this.option("queue");
        const sleepOption = this.option("sleep");
        const sleepMs = typeof sleepOption === "string" && sleepOption.length > 0 ? Number(sleepOption) : 1000;
        const queueName = typeof queueOption === "string" && queueOption.length > 0 ? queueOption : undefined;

        const abortController = new AbortController();
        const stop = (): void => {
            abortController.abort();
        };
        process.once("SIGINT", stop);
        process.once("SIGTERM", stop);

        this.info(`Queue worker started (connection: ${manager.getDefaultConnection()})`);
        this.info("Press Ctrl+C to stop");

        await runQueueWork({
            queue: manager.connection(),
            registry,
            queueName,
            sleepMs: Number.isFinite(sleepMs) ? sleepMs : 1000,
            signal: abortController.signal,
            onError: (error, jobName) => {
                const msg = error instanceof Error ? error.message : String(error);
                this.warn(`Job [${jobName}] failed: ${msg}`);
            },
        });

        this.info("Queue worker stopped");
        return 0;
    }
}

const kernel = new Kernel();
// Help/list MUST reach process.stdout — silent writers yield empty spawnSync capture (Sprint 22).
kernel.setOutput({
    writeLine(text: string): void {
        process.stdout.write(`${text}\n`);
    },
});

kernel.register(new HelpCommand(kernel));
kernel.register(new VersionCommand());
kernel.register(new ServeCommand());
kernel.register(new RoutesCommand());
kernel.register(new CacheClearCommand());
kernel.register(new QueueWorkCommand());
kernel.register(
    new RoutesCompileCommand({
        resolveRouter: resolveFreshRouter,
        emitRouteRegistry: emitRouteRegistry as (routes: unknown[]) => string,
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
