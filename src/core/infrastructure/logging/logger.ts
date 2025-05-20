/**
 * Sistema de logging aprimorado para o Ninots
 *
 * Este sistema implementa o padrão Strategy para permitir múltiplos
 * backends de log com configurações personalizáveis.
 */

/**
 * Níveis de log suportados
 */
export enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal",
}

/**
 * Interface para contexto de log
 */
export interface LogContext {
    [key: string]: any;
    timestamp?: Date;
    module?: string;
}

/**
 * Interface base para todos os loggers
 */
export interface LoggerInterface {
    debug(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, context?: LogContext): void;
    fatal(message: string, context?: LogContext): void;
    log(level: LogLevel, message: string, context?: LogContext): void;
}

/**
 * Opções de configuração para Logger
 */
export interface LoggerOptions {
    minLevel?: LogLevel;
    useColors?: boolean;
    includeTimestamp?: boolean;
    timestampFormat?: string;
}

/**
 * Implementação base para logger
 */
export abstract class AbstractLogger implements LoggerInterface {
    protected options: LoggerOptions;

    /**
     * Construtor do logger
     * @param options Opções de configuração
     */
    constructor(options?: LoggerOptions) {
        this.options = {
            minLevel: LogLevel.DEBUG,
            useColors: true,
            includeTimestamp: true,
            timestampFormat: "ISO", // 'ISO' | 'UTC' | 'LOCALE'
            ...options,
        };
    }

    /**
     * Método abstrato que cada implementação deve fornecer
     */
    protected abstract writeLog(
        level: LogLevel,
        formattedMessage: string,
        rawMessage: string,
        context?: LogContext
    ): void;

    /**
     * Formata uma mensagem de log
     */
    protected formatMessage(
        level: LogLevel,
        message: string,
        context?: LogContext
    ): string {
        let timestamp = "";

        if (this.options.includeTimestamp) {
            const now = context?.timestamp || new Date();
            switch (this.options.timestampFormat) {
                case "UTC":
                    timestamp = `[${now.toUTCString()}] `;
                    break;
                case "LOCALE":
                    timestamp = `[${now.toLocaleString()}] `;
                    break;
                default: // 'ISO'
                    timestamp = `[${now.toISOString()}] `;
                    break;
            }
        }

        const moduleName = context?.module ? `[${context.module}] ` : "";
        const prefix = `${timestamp}[${level.toUpperCase()}] ${moduleName}`;

        return `${prefix}${message}`;
    }

    /**
     * Verifica se o nível de log deve ser registrado
     */
    protected shouldLog(level: LogLevel): boolean {
        const levels = Object.values(LogLevel);
        const minLevelIndex = levels.indexOf(
            this.options.minLevel || LogLevel.DEBUG
        );
        const currentLevelIndex = levels.indexOf(level);

        return currentLevelIndex >= minLevelIndex;
    }

    /**
     * Implementação dos métodos da interface
     */
    public debug(message: string, context?: LogContext): void {
        this.log(LogLevel.DEBUG, message, context);
    }

    public info(message: string, context?: LogContext): void {
        this.log(LogLevel.INFO, message, context);
    }

    public warn(message: string, context?: LogContext): void {
        this.log(LogLevel.WARN, message, context);
    }

    public error(message: string, context?: LogContext): void {
        this.log(LogLevel.ERROR, message, context);
    }

    public fatal(message: string, context?: LogContext): void {
        this.log(LogLevel.FATAL, message, context);
    }

    public log(level: LogLevel, message: string, context?: LogContext): void {
        if (!this.shouldLog(level)) {
            return;
        }

        const formattedMessage = this.formatMessage(level, message, context);
        this.writeLog(level, formattedMessage, message, context);
    }
}
