/**
 * Implementação do padrão Adapter para sistemas de logging
 */

/**
 * Interface padrão para logging no Ninots
 */
export interface Logger {
    /**
     * Registra uma mensagem de debug
     * @param message Mensagem a ser registrada
     * @param context Contexto opcional
     */
    debug(message: string, context?: Record<string, any>): void;

    /**
     * Registra uma mensagem de informação
     * @param message Mensagem a ser registrada
     * @param context Contexto opcional
     */
    info(message: string, context?: Record<string, any>): void;

    /**
     * Registra uma mensagem de aviso
     * @param message Mensagem a ser registrada
     * @param context Contexto opcional
     */
    warn(message: string, context?: Record<string, any>): void;

    /**
     * Registra uma mensagem de erro
     * @param message Mensagem a ser registrada
     * @param context Contexto opcional
     */
    error(message: string, context?: Record<string, any>): void;
}

/**
 * Implementação básica do Logger que usa console
 */
export class ConsoleLogger implements Logger {
    debug(message: string, context?: Record<string, any>): void {
        console.debug(`[DEBUG] ${message}`, context || "");
    }

    info(message: string, context?: Record<string, any>): void {
        console.info(`[INFO] ${message}`, context || "");
    }

    warn(message: string, context?: Record<string, any>): void {
        console.warn(`[WARN] ${message}`, context || "");
    }

    error(message: string, context?: Record<string, any>): void {
        console.error(`[ERROR] ${message}`, context || "");
    }
}

/**
 * Interface simulando um serviço de log externo
 */
interface ExternalLogService {
    log(level: string, message: string, metadata?: object): void;
}

/**
 * Simulação de um serviço externo de logs
 */
class ExternalLoggingService implements ExternalLogService {
    log(level: string, message: string, metadata?: object): void {
        console.log(`External log [${level}]: ${message}`, metadata);
    }
}

/**
 * Adapter para usar sistemas de log externos com a interface do Ninots
 */
export class LoggingAdapter implements Logger {
    /**
     * Construtor do adaptador
     * @param externalLogger Serviço externo de logging
     */
    constructor(private externalLogger: ExternalLogService) {}

    debug(message: string, context?: Record<string, any>): void {
        this.externalLogger.log("debug", message, context);
    }

    info(message: string, context?: Record<string, any>): void {
        this.externalLogger.log("info", message, context);
    }

    warn(message: string, context?: Record<string, any>): void {
        this.externalLogger.log("warn", message, context);
    }

    error(message: string, context?: Record<string, any>): void {
        this.externalLogger.log("error", message, context);
    }
}

/**
 * Factory para criar instâncias de logger
 */
export class LoggerFactory {
    /**
     * Cria um logger do tipo especificado
     * @param type Tipo de logger
     * @returns Uma instância de Logger
     */
    static create(type: "console" | "external"): Logger {
        switch (type) {
            case "console":
                return new ConsoleLogger();
            case "external":
                // Aqui seria uma instância real de um serviço externo
                return new LoggingAdapter(new ExternalLoggingService());
            default:
                return new ConsoleLogger();
        }
    }
}
