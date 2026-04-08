import { Kernel, Command } from '@ninots/console';
import { bootstrap, createServeOptions } from '@/bootstrap/app';

/**
 * Create the CLI kernel.
 */
const kernel = new Kernel('Nino', '1.0.0');

// Register commands
kernel.add(new ServeCommand());
kernel.add(new RoutesCommand());
kernel.add(new CacheClearCommand());

/**
 * Serve command.
 *
 * Starts the HTTP server.
 */
class ServeCommand extends Command {
    protected signature = 'serve {--port=3000} {--hot}';
    protected description = 'Start the development server';

    /**
     * Handle the command.
     */
    public async handle(): Promise<void> {
        const app = await bootstrap();
        const port = this.option('port');

        this.info(`Starting Ninots server on port ${port}`);

        const serveOptions = createServeOptions(app);
        serveOptions.port = port;

        const server = Bun.serve(serveOptions);
        this.info(`Server running at ${server.url}`);
    }
}

/**
 * Routes command.
 *
 * Lists all registered routes.
 */
class RoutesCommand extends Command {
    protected signature = 'routes:list';
    protected description = 'List all registered routes';

    /**
     * Handle the command.
     */
    public async handle(): Promise<void> {
        this.info('Routes:');
        // TODO: Implement route listing
    }
}

/**
 * Cache clear command.
 *
 * Clears the application cache.
 */
class CacheClearCommand extends Command {
    protected signature = 'cache:clear';
    protected description = 'Clear the application cache';

    /**
     * Handle the command.
     */
    public async handle(): Promise<void> {
        // TODO: Implement cache clearing
        this.info('Cache cleared successfully');
    }
}

// Handle CLI input
kernel.handle(process.argv.slice(2));
