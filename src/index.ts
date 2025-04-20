/**
 * Ninots Framework Entry Point
 *
 * This file initializes and starts the Ninots application server.
 * It loads environment variables, sets up the core server,
 * configures routing, and begins listening for incoming requests.
 *
 * @module NinotsApp
 */

// Although Bun automatically loads .env files, explicit imports can be used
// for clarity or more complex loading scenarios if needed in the future.
// import * as dotenv from 'dotenv';
// dotenv.config();

import { NinotsServer } from './core/server';
import { FileSystemRouter } from './core/routing';

/**
 * Default port if not specified in environment variables.
 * @constant {number}
 */
const DEFAULT_PORT = 3000;

/**
 * Retrieves the server port from environment variables or uses the default.
 * @constant {number}
 */
const port = parseInt(process.env.PORT || `${DEFAULT_PORT}`, 10);

/**
 * Application environment (development, production, etc.).
 * Defaults to 'development'.
 * @constant {string}
 */
const environment = process.env.NODE_ENV || 'development';

/**
 * Initializes and starts the Ninots server instance.
 *
 * This asynchronous function sets up the router, creates the server instance,
 * and starts listening on the configured port. It also logs server
 * initialization details.
 */
async function bootstrap() {
  try {
    console.log(`[Ninots] Initializing server in ${environment} mode...`);

    // 1. Initialize the router (scans src/app)
    const router = new FileSystemRouter();
    await router.initialize(); // Assuming an async initialization to scan files
    console.log('[Ninots] Router initialized.');

    // 2. Create the server instance
    const server = new NinotsServer(router);
    console.log('[Ninots] Server instance created.');

    // 3. Start listening
    server.listen(port);
    // Server's listen method should handle the console log for listening

  } catch (error) {
    console.error('[Ninots] Failed to bootstrap application:', error);
    process.exit(1); // Exit if bootstrap fails
  }
}

// Start the application
bootstrap();

// Basic error handling for unhandled promise rejections or uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception thrown:', error);
  // Application specific logging, cleanup, and exit logic here
  process.exit(1);
});
