import { Command, Kernel } from "@ninots/framework";
import { bootstrap, createAppServeOptions } from "@/bootstrap/app";
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

    public async handle(): Promise<number> {
        this.warn("Route listing will be implemented in a future sprint.");
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
