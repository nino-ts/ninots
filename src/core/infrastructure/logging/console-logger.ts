/**
 * Implementação de ConsoleLogger usando o novo sistema de logging
 */

import { AbstractLogger, LogContext, LogLevel } from "./logger";

/**
 * Logger que envia mensagens para o console
 * Aproveita os recursos nativos do console do Bun
 */
export class ConsoleLogger extends AbstractLogger {
    /**
     * Cores para diferentes níveis de log
     */
    private readonly LEVEL_COLORS = {
        [LogLevel.DEBUG]: "\x1b[90m", // Cinza
        [LogLevel.INFO]: "\x1b[36m", // Ciano
        [LogLevel.WARN]: "\x1b[33m", // Amarelo
        [LogLevel.ERROR]: "\x1b[31m", // Vermelho
        [LogLevel.FATAL]: "\x1b[35m", // Magenta
    };

    /**
     * Caractere de reset para cores ANSI
     */
    private readonly RESET_COLOR = "\x1b[0m";

    /**
     * Escreve a mensagem no console com o nível apropriado
     */
    protected writeLog(
        level: LogLevel,
        formattedMessage: string,
        rawMessage: string,
        context?: LogContext
    ): void {
        let logFn: (...args: any[]) => void;

        // Escolhe a função de console apropriada
        switch (level) {
            case LogLevel.DEBUG:
                logFn = console.debug;
                break;
            case LogLevel.INFO:
                logFn = console.info;
                break;
            case LogLevel.WARN:
                logFn = console.warn;
                break;
            case LogLevel.FATAL:
            case LogLevel.ERROR:
                logFn = console.error;
                break;
            default:
                logFn = console.log;
        }

        // Aplica cores se configurado
        if (this.options.useColors) {
            const colorCode = this.LEVEL_COLORS[level] || "";
            logFn(
                `${colorCode}${formattedMessage}${this.RESET_COLOR}`,
                context ? this.formatContext(context) : ""
            );
        } else {
            logFn(formattedMessage, context ? this.formatContext(context) : "");
        }
    }

    /**
     * Formata o contexto para exibição mais limpa no console
     */
    private formatContext(context: LogContext): any {
        // Filtra propriedades especiais que já foram usadas na formatação da mensagem
        const { timestamp, module, ...restContext } = context;

        // Se não houver mais nada no contexto, retorna string vazia
        if (Object.keys(restContext).length === 0) {
            return "";
        }

        return restContext;
    }
}
