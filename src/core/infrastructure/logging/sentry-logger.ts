/**
 * Adaptador de logging para Sentry
 */

import { LogLevel } from "./logger";
import {
    ObservabilityLogger,
    ObservabilityLoggerOptions,
} from "./observability-logger";

/**
 * Opções específicas para o SentryLogger
 */
export interface SentryLoggerOptions extends ObservabilityLoggerOptions {
    /** DSN do Sentry */
    dsn: string;

    /** Ambiente (production, staging, etc) */
    environment?: string;

    /** Versão da aplicação */
    release?: string;

    /** Tags a serem aplicadas em todos os eventos */
    tags?: Record<string, string>;

    /** Nível mínimo para enviar como erro */
    errorLevel?: LogLevel;
}

/**
 * Implementação de logger que envia dados para Sentry
 */
export class SentryLogger extends ObservabilityLogger {
    private sentryOptions: Required<
        Pick<
            SentryLoggerOptions,
            "dsn" | "environment" | "release" | "tags" | "errorLevel"
        >
    >;

    constructor(options: SentryLoggerOptions) {
        if (!options.dsn) {
            throw new Error("SentryLogger requires a valid DSN");
        }

        super(options);

        this.sentryOptions = {
            dsn: options.dsn,
            environment: options.environment || "production",
            release: options.release || "unknown",
            tags: options.tags || {},
            errorLevel: options.errorLevel || LogLevel.ERROR,
        };
    }

    /**
     * Converte o nível de log para o Sentry
     */
    private convertLogLevel(level: LogLevel): string {
        switch (level) {
            case LogLevel.FATAL:
                return "fatal";
            case LogLevel.ERROR:
                return "error";
            case LogLevel.WARN:
                return "warning";
            case LogLevel.INFO:
                return "info";
            case LogLevel.DEBUG:
                return "debug";
            default:
                return "info";
        }
    }

    /**
     * Formata o objeto de evento para o formato esperado pelo Sentry
     */
    private formatSentryEvent(log: {
        level: LogLevel;
        message: string;
        context?: Record<string, any>;
        timestamp: number;
    }) {
        const { level, message, context = {}, timestamp } = log;
        const sentryLevel = this.convertLogLevel(level);

        // Extrair informações de erro se existirem
        const errorInfo = context.error
            ? context.error instanceof Error
                ? {
                      exception: {
                          type: context.error.name,
                          value: context.error.message,
                          stacktrace: {
                              frames: this.parseStackTrace(context.error.stack),
                          },
                      },
                  }
                : {
                      exception: {
                          value: String(context.error),
                      },
                  }
            : null;

        // Formatar o evento para Sentry
        return {
            event_id: this.generateUUID(),
            timestamp: new Date(timestamp).toISOString(),
            platform: "node",
            level: sentryLevel,
            environment: this.sentryOptions.environment,
            server_name: context.hostname || "unknown",
            release: this.sentryOptions.release,
            message,
            tags: {
                ...this.sentryOptions.tags,
                ...Object.entries(context)
                    .filter(
                        ([_, v]) =>
                            typeof v === "string" ||
                            typeof v === "number" ||
                            typeof v === "boolean"
                    )
                    .reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {}),
            },
            extra: {
                ...Object.entries(context)
                    .filter(
                        ([k, v]) =>
                            typeof v !== "string" &&
                            typeof v !== "number" &&
                            typeof v !== "boolean" &&
                            k !== "error"
                    )
                    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
            },
            ...(errorInfo || {}),
        };
    }

    /**
     * Parser simplificado de stack trace
     */
    private parseStackTrace(stackTrace?: string): any[] {
        if (!stackTrace) return [];

        const frames: any[] = [];
        const lines = stackTrace.split("\n").slice(1); // Ignorar primeira linha (mensagem)

        for (const line of lines) {
            const match = line.match(
                /^\s*at\s+(?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?)\)?/
            );
            if (!match) continue;

            const [, fnName, fileName, lineNo, colNo] = match;
            frames.push({
                function: fnName || "<anonymous>",
                filename: fileName,
                lineno: parseInt(lineNo, 10) || 0,
                colno: parseInt(colNo, 10) || 0,
            });
        }

        return frames.reverse(); // Sentry espera a ordem inversa
    }

    /**
     * Gera um UUID v4 simplificado
     */
    private generateUUID(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
                const r = (Math.random() * 16) | 0,
                    v = c == "x" ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            }
        );
    }

    /**
     * Envia os logs para o Sentry
     */
    protected async sendLogs(
        logs: Array<{
            level: LogLevel;
            message: string;
            context?: Record<string, any>;
            timestamp: number;
        }>
    ): Promise<void> {
        if (logs.length === 0) return;

        // Agrupar logs por nível
        const errorLogs = logs.filter(
            (log) => log.level >= this.sentryOptions.errorLevel
        );
        const infoLogs = logs.filter(
            (log) => log.level < this.sentryOptions.errorLevel
        );

        try {
            // Enviar erros e fatais como eventos individuais
            const errorPromises = errorLogs.map(async (log) => {
                const event = this.formatSentryEvent(log);

                await fetch(`${this.sentryOptions.dsn}/api/events/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(event),
                });
            });

            // Enviar info e debug em lote como breadcrumbs
            if (infoLogs.length > 0 && errorLogs.length > 0) {
                // Apenas enviar breadcrumbs se houver um erro para anexá-los
                const breadcrumbs = infoLogs.map((log) => ({
                    timestamp: log.timestamp / 1000, // Sentry usa segundos
                    level: this.convertLogLevel(log.level),
                    message: log.message,
                    data: log.context,
                }));

                // Anexar breadcrumbs ao primeiro erro
                const firstErrorEvent = this.formatSentryEvent(errorLogs[0]);
                firstErrorEvent.breadcrumbs = { values: breadcrumbs };

                await fetch(`${this.sentryOptions.dsn}/api/events/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(firstErrorEvent),
                });
            }

            await Promise.all(errorPromises);
        } catch (error) {
            this.options.onError(error as Error);
        }
    }
}
