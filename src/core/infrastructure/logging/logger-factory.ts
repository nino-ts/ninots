/**
 * Factory avançada para criação de loggers
 */

import { LoggerInterface, LoggerOptions, LogLevel } from "./logger";
import { ConsoleLogger } from "./console-logger";
import { FileLogger, FileLoggerOptions } from "./file-logger";
import { OpenTelemetryLogger } from "./opentelemetry-logger";
import type { OpenTelemetryLoggerOptions } from "./opentelemetry-logger";
import { SentryLogger } from "./sentry-logger";
import type { SentryLoggerOptions } from "./sentry-logger";

/**
 * Classe para gerenciar múltiplos loggers
 * Implementa o padrão Composite para agregar múltiplas fontes de log
 */
export class CompositeLogger implements LoggerInterface {
    private loggers: LoggerInterface[] = [];
    private contextData: Record<string, any> = {};
    private moduleName?: string;

    /**
     * Construtor do composite logger
     */
    constructor(moduleName?: string) {
        this.moduleName = moduleName;
    }

    /**
     * Adiciona um logger ao compósito
     */
    public addLogger(logger: LoggerInterface): void {
        this.loggers.push(logger);
    }

    /**
     * Define dados de contexto permanentes para este logger
     */
    public setContext(context: Record<string, any>): void {
        this.contextData = {
            ...this.contextData,
            ...context,
        };
    }

    /**
     * Prepara o contexto combinando os dados permanentes com os dados específicos
     */
    private prepareContext(context?: Record<string, any>): Record<string, any> {
        return {
            ...this.contextData,
            ...(this.moduleName ? { module: this.moduleName } : {}),
            ...context,
        };
    }

    /**
     * Implementação dos métodos da interface LoggerInterface
     * Repassa para todos os loggers registrados
     */
    public debug(message: string, context?: Record<string, any>): void {
        const preparedContext = this.prepareContext(context);
        this.loggers.forEach((logger) =>
            logger.debug(message, preparedContext)
        );
    }

    public info(message: string, context?: Record<string, any>): void {
        const preparedContext = this.prepareContext(context);
        this.loggers.forEach((logger) => logger.info(message, preparedContext));
    }

    public warn(message: string, context?: Record<string, any>): void {
        const preparedContext = this.prepareContext(context);
        this.loggers.forEach((logger) => logger.warn(message, preparedContext));
    }

    public error(message: string, context?: Record<string, any>): void {
        const preparedContext = this.prepareContext(context);
        this.loggers.forEach((logger) =>
            logger.error(message, preparedContext)
        );
    }

    public fatal(message: string, context?: Record<string, any>): void {
        const preparedContext = this.prepareContext(context);
        this.loggers.forEach((logger) =>
            logger.fatal(message, preparedContext)
        );
    }

    public log(
        level: LogLevel,
        message: string,
        context?: Record<string, any>
    ): void {
        const preparedContext = this.prepareContext(context);
        this.loggers.forEach((logger) =>
            logger.log(level, message, preparedContext)
        );
    }

    /**
     * Cria um child logger com contexto adicional
     */
    public child(context: Record<string, any>): LoggerInterface {
        const child = new CompositeLogger(this.moduleName);

        // Adicionar os mesmos loggers do pai
        this.loggers.forEach((logger) => child.addLogger(logger));

        // Combinar o contexto
        child.setContext({
            ...this.contextData,
            ...context,
        });

        return child;
    }
}

/**
 * Configuração para o LoggerFactory
 */
export interface LoggerFactoryConfig {
    /** Configuração do console logger */
    console?: {
        enabled: boolean;
        minLevel?: LogLevel;
        useColors?: boolean;
        includeTimestamp?: boolean;
        timestampFormat?: string;
    };

    /** Configuração do file logger */
    file?: {
        enabled: boolean;
        filePath: string;
        minLevel?: LogLevel;
        append?: boolean;
        flushImmediately?: boolean;
        rotationSizeMB?: number;
        keepLogFiles?: number;
    };

    /** Configuração do OpenTelemetry */
    opentelemetry?: {
        enabled: boolean;
        endpoint?: string;
        otlpEndpoint?: string;
        apiKey?: string;
        minLevel?: LogLevel;
        headers?: Record<string, string>;
        resourceAttributes?: Record<string, string>;
    };

    /** Configuração do Sentry */
    sentry?: {
        enabled: boolean;
        dsn: string;
        environment?: string;
        release?: string;
        minLevel?: LogLevel;
        errorLevel?: LogLevel;
        tags?: Record<string, string>;
    };

    /** Contexto global para todos os loggers */
    globalContext?: Record<string, any>;
}

/**
 * Factory para criar instâncias de logger
 */
export class LoggerFactory {
    private static defaultConfig: LoggerFactoryConfig = {
        console: {
            enabled: true,
            minLevel: LogLevel.DEBUG,
            useColors: true,
            includeTimestamp: true,
        },
        file: {
            enabled: false,
            filePath: "./logs/app.log",
            append: true,
            flushImmediately: false,
            minLevel: LogLevel.INFO,
        },
        opentelemetry: {
            enabled: false,
            minLevel: LogLevel.INFO,
        },
        sentry: {
            enabled: false,
            dsn: "",
            minLevel: LogLevel.ERROR,
        },
        globalContext: {
            appName: "ninots-app",
            env: process.env.NODE_ENV || "development",
        },
    };

    /**
     * Configura o LoggerFactory com novas configurações
     */
    public static configure(config: LoggerFactoryConfig): void {
        // Deep merge de configurações
        if (config.console) {
            this.defaultConfig.console = {
                ...this.defaultConfig.console,
                ...config.console,
            };
        }

        if (config.file) {
            this.defaultConfig.file = {
                ...this.defaultConfig.file,
                ...config.file,
            };
        }

        if (config.opentelemetry) {
            this.defaultConfig.opentelemetry = {
                ...this.defaultConfig.opentelemetry,
                ...config.opentelemetry,
            };
        }

        if (config.sentry) {
            this.defaultConfig.sentry = {
                ...this.defaultConfig.sentry,
                ...config.sentry,
            };
        }

        if (config.globalContext) {
            this.defaultConfig.globalContext = {
                ...this.defaultConfig.globalContext,
                ...config.globalContext,
            };
        }
    }

    /**
     * Cria um logger baseado na configuração atual
     */
    public static create(module?: string): LoggerInterface {
        const composite = new CompositeLogger(module);

        // Adicionar contexto global
        if (this.defaultConfig.globalContext) {
            composite.setContext(this.defaultConfig.globalContext);
        }

        // Adiciona ConsoleLogger se estiver habilitado
        if (this.defaultConfig.console?.enabled) {
            composite.addLogger(
                new ConsoleLogger({
                    ...this.defaultConfig.console,
                })
            );
        }

        // Adiciona FileLogger se estiver habilitado
        if (this.defaultConfig.file?.enabled) {
            composite.addLogger(
                new FileLogger({
                    ...this.defaultConfig.file,
                })
            );
        }

        // Adiciona OpenTelemetryLogger se estiver habilitado
        if (this.defaultConfig.opentelemetry?.enabled) {
            composite.addLogger(
                new OpenTelemetryLogger({
                    ...this.defaultConfig.opentelemetry,
                })
            );
        }

        // Adiciona SentryLogger se estiver habilitado
        if (
            this.defaultConfig.sentry?.enabled &&
            this.defaultConfig.sentry.dsn
        ) {
            composite.addLogger(
                new SentryLogger({
                    ...this.defaultConfig.sentry,
                })
            );
        }

        // Se nenhum logger estiver habilitado, usa ConsoleLogger como fallback
        if (
            !this.defaultConfig.console?.enabled &&
            !this.defaultConfig.file?.enabled &&
            !this.defaultConfig.opentelemetry?.enabled &&
            !this.defaultConfig.sentry?.enabled
        ) {
            composite.addLogger(new ConsoleLogger());
        }

        return composite;
    }

    /**
     * Cria um logger específico para console
     */
    public static createConsoleLogger(
        options?: LoggerOptions
    ): LoggerInterface {
        return new ConsoleLogger(options);
    }

    /**
     * Cria um logger específico para arquivo
     */
    public static createFileLogger(
        options: FileLoggerOptions
    ): LoggerInterface {
        return new FileLogger(options);
    }

    /**
     * Cria um logger específico para OpenTelemetry
     */
    public static createOpenTelemetryLogger(
        options: OpenTelemetryLoggerOptions
    ): LoggerInterface {
        return new OpenTelemetryLogger(options);
    }

    /**
     * Cria um logger específico para Sentry
     */
    public static createSentryLogger(
        options: SentryLoggerOptions
    ): LoggerInterface {
        return new SentryLogger(options);
    }
}
