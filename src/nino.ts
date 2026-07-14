import { Command, Kernel } from "@ninots/framework";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { bootstrap, createAppServeOptions } from "@/bootstrap/app";
import { layout as apiLayout } from "@/routes/api/layout";
import { layout as wsLayout } from "@/routes/ws/layout";
import packageJson from "../package.json";

/**
 * Help command — lists registered CLI commands.
 */
class HelpCommand extends Command {
    protected signature = "help";
    protected description = "Display available commands";

    private readonly cli: Kernel;

    constructor(cli: Kernel) {
        super();
        this.cli = cli;
    }

    public async handle(): Promise<number> {
        this.line(`Nino CLI — ninots-app v${packageJson.version}`);
        this.line("");
        this.line("Available commands:");

        for (const command of this.cli.getCommands()) {
            const definition = command.getDefinition();
            this.line(`  ${definition.name.padEnd(16)} ${definition.description}`);
        }

        return 0;
    }
}

/**
 * Version command.
 */
class VersionCommand extends Command {
    protected signature = "version";
    protected description = "Show application and framework versions";

    public async handle(): Promise<number> {
        this.line(`ninots-app ${packageJson.version}`);
        this.line(`@ninots/framework ${packageJson.dependencies["@ninots/framework"]}`);
        return 0;
    }
}

/**
 * Serve command — starts the HTTP server.
 */
class ServeCommand extends Command {
    protected signature = "serve {--port=3000}";
    protected description = "Start the HTTP development server";

    public async handle(): Promise<number> {
        const app = await bootstrap();
        const portOption = this.option("port");
        const port = typeof portOption === "string" ? Number(portOption) : app.getConfig().port;

        const serveOptions = createAppServeOptions(app);
        serveOptions.port = port;

        const server = Bun.serve(serveOptions);
        this.info(`Ninots server running at ${server.url}`);
        this.info("Press Ctrl+C to stop");

        // Keep the event loop alive until the process is interrupted.
        // Without this, kernel.run returns and process.exit() kills Bun.serve.
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

/**
 * Routes command — placeholder for route listing.
 */
class RoutesCommand extends Command {
    protected signature = "routes:list";
    protected description = "List all registered routes";
    private readonly HTTP_VERBS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"]);

    private looksLikePathKeyedTree(value: unknown): boolean {
        if (typeof value !== "object" || value === null || Array.isArray(value)) {
            return false;
        }
        const keys = Object.keys(value as object);
        return keys.length > 0 && keys.every((k) => k.startsWith("/"));
    }

    private isHttpRouteMap(value: unknown): value is Record<string, Record<string, unknown>> {
        if (!this.looksLikePathKeyedTree(value)) {
            return false;
        }
        const root = value as Record<string, unknown>;
        for (const pathKey of Object.keys(root)) {
            const inner = root[pathKey];
            if (typeof inner !== "object" || inner === null || Array.isArray(inner)) {
                return false;
            }
            const innerKeys = Object.keys(inner as object);
            if (innerKeys.length === 0 || !innerKeys.some((k) => this.HTTP_VERBS.has(k.toUpperCase()))) {
                return false;
            }
        }
        return true;
    }

    private isWsRouteMap(value: unknown): value is Record<string, Record<string, unknown>> {
        if (!this.looksLikePathKeyedTree(value)) {
            return false;
        }
        const root = value as Record<string, unknown>;
        for (const pathKey of Object.keys(root)) {
            const inner = root[pathKey] as Record<string, unknown>;
            if (typeof inner !== "object" || inner === null || Array.isArray(inner)) {
                return false;
            }
            const innerKeys = Object.keys(inner);
            if (innerKeys.length === 0) {
                return false;
            }
            if (innerKeys.some((k) => this.HTTP_VERBS.has(k.toUpperCase()))) {
                return false;
            }
            if (!innerKeys.some((k) => typeof inner[k] === "function")) {
                return false;
            }
        }
        return true;
    }

    private async collectRelativePaths(globPattern: string, cwd: string): Promise<string[]> {
        const glob = new Bun.Glob(globPattern);
        const out: string[] = [];
        for await (const rel of glob.scan({ cwd, onlyFiles: true })) {
            if (rel.endsWith(".test.ts")) {
                continue;
            }
            out.push(rel);
        }
        out.sort();
        return out;
    }

    private async discoverHttpRouteModules(
        srcDir: string,
    ): Promise<{ routes: Record<string, Record<string, unknown>>; file: string }[]> {
        const result: { routes: Record<string, Record<string, unknown>>; file: string }[] = [];
        const relPaths = await this.collectRelativePaths("modules/**/routes/api/index.ts", srcDir);
        for (const rel of relPaths) {
            const full = path.join(srcDir, rel);
            let mod: Record<string, unknown>;
            try {
                mod = (await import(pathToFileURL(full).href)) as Record<string, unknown>;
            } catch {
                continue;
            }
            for (const val of Object.values(mod)) {
                if (this.isHttpRouteMap(val)) {
                    result.push({ routes: val, file: rel.split(path.sep).join("/") });
                }
            }
        }
        return result;
    }

    private async discoverWsRouteModules(
        srcDir: string,
    ): Promise<{ routes: Record<string, Record<string, unknown>>; file: string }[]> {
        const result: { routes: Record<string, Record<string, unknown>>; file: string }[] = [];
        const relPaths = await this.collectRelativePaths("modules/**/routes/ws/**/*.ts", srcDir);
        for (const rel of relPaths) {
            const full = path.join(srcDir, rel);
            let mod: Record<string, unknown>;
            try {
                mod = (await import(pathToFileURL(full).href)) as Record<string, unknown>;
            } catch {
                continue;
            }
            for (const val of Object.values(mod)) {
                if (this.isWsRouteMap(val)) {
                    result.push({ routes: val, file: rel.split(path.sep).join("/") });
                }
            }
        }
        return result;
    }

    /**
     * Label transport: standard HTTP verbs vs WebSocket lifecycle / custom keys.
     */
    private resolveProtocol(handlerKey: string): "HTTP" | "WS" {
        return this.HTTP_VERBS.has(handlerKey.toUpperCase()) ? "HTTP" : "WS";
    }

    /**
     * Handle the command.
     */
    public async handle(): Promise<number> {
        const httpModules = await this.discoverHttpRouteModules(import.meta.dir);
        const wsModules = await this.discoverWsRouteModules(import.meta.dir);

        const printed = new Set<string>();

        this.info("Registered routes:");
        this.line("");

        this.info(`[HTTP ROUTES LIST]`);
        for (const { routes, file } of httpModules) {
            for (const [routePath, methods] of Object.entries(routes)) {
                for (const method of Object.keys(methods as object)) {
                    const protocol = this.resolveProtocol(method);
                    const dedupeKey = `http|${apiLayout.prefix}|${routePath}|${method}`;
                    if (printed.has(dedupeKey)) {
                        continue;
                    }
                    printed.add(dedupeKey);
                    this.line(`[${protocol}:${method}] - ${apiLayout.prefix}${routePath} - ${file}`);
                }
            }
        }
        this.line("");

        this.info(`[WS ROUTES LIST]`);
        for (const { routes, file } of wsModules) {
            for (const [routePath, handlers] of Object.entries(routes)) {
                for (const event of Object.keys(handlers as object)) {
                    const protocol = this.resolveProtocol(event);
                    const dedupeKey = `ws|${wsLayout.prefix}|${routePath}|${event}`;
                    if (printed.has(dedupeKey)) {
                        continue;
                    }
                    printed.add(dedupeKey);
                    this.line(`[${protocol}:${event}] - ${wsLayout.prefix}${routePath} - ${file}`);
                }
            }
        }
        return 0;
    }
}

/**
 * Cache clear command — placeholder.
 */
class CacheClearCommand extends Command {
    protected signature = "cache:clear";
    protected description = "Clear the application cache";

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

const exitCode = await kernel.run(process.argv.slice(2));
process.exit(exitCode);
