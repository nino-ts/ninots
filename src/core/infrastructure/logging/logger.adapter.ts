/**
 * Adapter para sistemas de logging legados
 *
 * DEPRECATED: Use o novo sistema de logging em logger.ts, console-logger.ts e logger-factory.ts
 */

import type { LoggerInterface, LogContext } from "./logger";

/**
 * Interface legada para manter compatibilidade com código existente
 */
export interface Logger {
    debug(message: string, context?: Record<string, any>): void;
    info(message: string, context?: Record<string, any>): void;
    warn(message: string, context?: Record<string, any>): void;
    error(message: string, context?: Record<string, any>): void;
}

/**
 * Adapter que usa o novo sistema de logging para implementar a interface antiga
 */
export class LegacyLoggerAdapter implements Logger {
    constructor(private newLogger: LoggerInterface) {}

    debug(message: string, context?: Record<string, any>): void {
        this.newLogger.debug(message, context as LogContext);
    }

    info(message: string, context?: Record<string, any>): void {
        this.newLogger.info(message, context as LogContext);
    }

    warn(message: string, context?: Record<string, any>): void {
        this.newLogger.warn(message, context as LogContext);
    }

    error(message: string, context?: Record<string, any>): void {
        this.newLogger.error(message, context as LogContext);
    }
}

/**
 * Factory legada para criar instâncias de logger
 *
 * DEPRECATED: Use o novo LoggerFactory de logger-factory.ts
 */
export class LoggerFactory {
    /**
     * Cria um logger do tipo especificado
     * @param _type Tipo de logger (ignorado, mantido por compatibilidade)
     * @returns Uma instância de Logger
     */
    static create(_type: "console" | "external"): Logger {
        // Importa o novo LoggerFactory dinamicamente para evitar dependência circular
        const { LoggerFactory: NewLoggerFactory } = require("./logger-factory");
        const newLogger = NewLoggerFactory.create();

        return new LegacyLoggerAdapter(newLogger);
    }
}
