/**
 * Adaptador de logging para OpenTelemetry
 */

import { LogLevel } from "./logger";
import {
    ObservabilityLogger,
    ObservabilityLoggerOptions,
} from "./observability-logger";

/**
 * Opções específicas para o OpenTelemetryLogger
 */
export interface OpenTelemetryLoggerOptions extends ObservabilityLoggerOptions {
    /** Endpoint específico para OTLP */
    otlpEndpoint?: string;

    /** Headers adicionais */
    headers?: Record<string, string>;

    /** Resource attributes */
    resourceAttributes?: Record<string, string>;
}

/**
 * Implementação de logger que envia dados para OpenTelemetry
 */
export class OpenTelemetryLogger extends ObservabilityLogger {
    private otlpOptions: {
        endpoint: string;
        headers: Record<string, string>;
    };

    constructor(options: OpenTelemetryLoggerOptions = {}) {
        super(options);

        this.otlpOptions = {
            endpoint: options.otlpEndpoint || "http://localhost:4318/v1/logs",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        };

        if (options.apiKey) {
            this.otlpOptions.headers["api-key"] = options.apiKey;
        }
    }

    /**
     * Converte o nível de log para o formato do OpenTelemetry
     */
    private convertLogLevel(level: LogLevel): number {
        // Mapeamento para níveis OTLP conforme especificação
        switch (level) {
            case LogLevel.FATAL:
                return 1; // FATAL
            case LogLevel.ERROR:
                return 2; // ERROR
            case LogLevel.WARN:
                return 3; // WARN
            case LogLevel.INFO:
                return 4; // INFO
            case LogLevel.DEBUG:
                return 5; // DEBUG
            default:
                return 4; // INFO (padrão)
        }
    }

    /**
     * Converte os logs para o formato OTLP
     */
    private convertToOTLP(
        logs: Array<{
            level: LogLevel;
            message: string;
            context?: Record<string, any>;
            timestamp: number;
        }>
    ): any {
        return {
            resourceLogs: [
                {
                    resource: {
                        attributes: [
                            {
                                key: "service.name",
                                value: {
                                    stringValue: this.serviceName,
                                },
                            },
                            // Adicionar outros atributos do resource
                            ...(
                                this.options.defaultMetadata
                                    ?.resourceAttributes || []
                            ).map((key: string) => ({
                                key,
                                value: {
                                    stringValue:
                                        this.options.defaultMetadata!
                                            .resourceAttributes[key],
                                },
                            })),
                        ],
                    },
                    scopeLogs: [
                        {
                            scope: {
                                name: "ninots.logger",
                            },
                            logRecords: logs.map((log) => ({
                                timeUnixNano: log.timestamp * 1000000,
                                severityNumber: this.convertLogLevel(log.level),
                                severityText: LogLevel[log.level],
                                body: {
                                    stringValue: log.message,
                                },
                                attributes: Object.entries(
                                    log.context || {}
                                ).map(([k, v]) => ({
                                    key: k,
                                    value: {
                                        stringValue:
                                            typeof v === "string"
                                                ? v
                                                : JSON.stringify(v),
                                    },
                                })),
                            })),
                        },
                    ],
                },
            ],
        };
    }

    /**
     * Envia os logs para o endpoint OTLP
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

        try {
            const payload = this.convertToOTLP(logs);

            const response = await fetch(this.otlpOptions.endpoint, {
                method: "POST",
                headers: this.otlpOptions.headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(
                    `OTLP log send failed: ${response.status} ${response.statusText}`
                );
            }
        } catch (error) {
            this.options.onError(error as Error);
        }
    }
}
