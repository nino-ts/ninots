/**
 * Adapter para integração com sistemas de observabilidade
 */

import { LoggerInterface, LogLevel } from "./logger";

/**
 * Opções para configuração do ObservabilityLogger
 */
export interface ObservabilityLoggerOptions {
    /** Endpoint para envio de logs */
    endpoint?: string;

    /** Chave de API (se necessária) */
    apiKey?: string;

    /** Nível mínimo de log para enviar */
    minLevel?: LogLevel;

    /** Intervalo para envio em lote (em ms). 0 = envio imediato */
    batchInterval?: number;

    /** Tamanho máximo do lote antes de enviar */
    batchSize?: number;

    /** Metadados adicionais a serem incluídos em todos os logs */
    defaultMetadata?: Record<string, any>;

    /** Função para tratamento de falhas no envio */
    onError?: (error: Error) => void;
}

/**
 * Implementação base para adaptador de observabilidade
 */
export abstract class ObservabilityLogger implements LoggerInterface {
    protected options: Required<ObservabilityLoggerOptions>;
    protected queue: Array<{
        level: LogLevel;
        message: string;
        context?: Record<string, any>;
        timestamp: number;
    }> = [];
    protected timer: NodeJS.Timeout | null = null;
    protected serviceName: string;

    /**
     * Construtor do ObservabilityLogger
     */
    constructor(
        options: ObservabilityLoggerOptions = {},
        serviceName: string = "ninots"
    ) {
        // Aplicar valores padrão
        this.options = {
            endpoint: options.endpoint || "http://localhost:4318/v1/logs",
            apiKey: options.apiKey || "",
            minLevel: options.minLevel || LogLevel.INFO,
            batchInterval: options.batchInterval ?? 5000,
            batchSize: options.batchSize || 100,
            defaultMetadata: options.defaultMetadata || {},
            onError:
                options.onError ||
                ((error: Error) =>
                    console.error("ObservabilityLogger error:", error)),
        };

        this.serviceName = serviceName;

        // Iniciar timer se estiver usando lotes
        if (this.options.batchInterval > 0) {
            this.startTimer();
        }
    }

    /**
     * Prepara o contexto para o log
     */
    protected prepareContext(
        context?: Record<string, any>
    ): Record<string, any> {
        return {
            ...this.options.defaultMetadata,
            ...context,
            service: this.serviceName,
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Inicia o timer para envio em lote
     */
    private startTimer(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }

        this.timer = setInterval(() => {
            this.flush();
        }, this.options.batchInterval);
    }

    /**
     * Envia os logs em fila
     */
    public flush(): void {
        if (this.queue.length === 0) return;

        const batch = [...this.queue];
        this.queue = [];

        this.sendLogs(batch).catch(this.options.onError);
    }

    /**
     * Método abstrato para envio dos logs
     * Deve ser implementado pelas classes concretas
     */
    protected abstract sendLogs(
        logs: Array<{
            level: LogLevel;
            message: string;
            context?: Record<string, any>;
            timestamp: number;
        }>
    ): Promise<void>;

    /**
     * Enfileira um log para envio
     */
    protected queueLog(
        level: LogLevel,
        message: string,
        context?: Record<string, any>
    ): void {
        // Verificar nível mínimo
        if (level < this.options.minLevel) {
            return;
        }

        // Adicionar à fila
        this.queue.push({
            level,
            message,
            context: this.prepareContext(context),
            timestamp: Date.now(),
        });

        // Enviar imediatamente se não estiver usando lotes ou se atingiu o tamanho máximo
        if (
            this.options.batchInterval <= 0 ||
            this.queue.length >= this.options.batchSize
        ) {
            this.flush();
        }
    }

    // Implementação da interface LoggerInterface

    debug(message: string, context?: Record<string, any>): void {
        this.queueLog(LogLevel.DEBUG, message, context);
    }

    info(message: string, context?: Record<string, any>): void {
        this.queueLog(LogLevel.INFO, message, context);
    }

    warn(message: string, context?: Record<string, any>): void {
        this.queueLog(LogLevel.WARN, message, context);
    }

    error(message: string, context?: Record<string, any>): void {
        this.queueLog(LogLevel.ERROR, message, context);
    }

    fatal(message: string, context?: Record<string, any>): void {
        this.queueLog(LogLevel.FATAL, message, context);
    }

    log(level: LogLevel, message: string, context?: Record<string, any>): void {
        this.queueLog(level, message, context);
    }
}
