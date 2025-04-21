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

import { loadConfig } from './shared/config';
import { Server } from './infrastructure/http/server';

/**
 * Default port if not specified in environment variables.
 * Used by config loader to set server port.
 * @constant {number}
 */
const DEFAULT_PORT = 3000;

// Note: Environment configuration is now handled through the config loader
// that's used in the bootstrap function below.

/**
 * Initializes and starts the Ninots server instance.
 *
 * This asynchronous function sets up the router, creates the server instance,
 * and starts listening on the configured port. It also logs server
 * initialization details.
 */
async function bootstrap() {
  try {
    const config = loadConfig();
    const server = new Server(config);
    await server.start();
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
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
