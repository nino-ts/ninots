/**
 * Implementação de FileLogger para o novo sistema de logging
 */

import { AbstractLogger, LogContext, LogLevel } from "./logger";
import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

/**
 * Opções específicas para o FileLogger
 */
export interface FileLoggerOptions {
    filePath: string;
    append?: boolean;
    flushImmediately?: boolean;
    rotationSizeMB?: number;
    keepLogFiles?: number;
}

/**
 * Logger que grava mensagens em arquivo
 * Usa as APIs nativas de arquivo do Bun
 */
export class FileLogger extends AbstractLogger {
    private filePath: string;
    private fileOptions: FileLoggerOptions;
    private fileHandle: Bun.FileHandle | null = null;
    private bytesWritten: number = 0;
    private currentFileIndex: number = 0;
    private logBuffer: string[] = [];
    private flushTimeout: NodeJS.Timeout | null = null;

    /**
     * Construtor do FileLogger
     * @param options Opções do logger
     * @param fileOptions Opções específicas de arquivo
     */
    constructor(fileOptions: FileLoggerOptions) {
        super();

        this.fileOptions = {
            append: true,
            flushImmediately: false,
            rotationSizeMB: 10, // 10MB por padrão
            keepLogFiles: 5, // Manter 5 arquivos de log por padrão
            ...fileOptions,
        };

        this.filePath = this.fileOptions.filePath;
        this.initializeLogFile();
    }

    /**
     * Inicializa o arquivo de log
     */
    private initializeLogFile(): void {
        try {
            // Verifica se o diretório existe, se não, cria
            const dir = dirname(this.filePath);
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
            }

            // Abre o arquivo para escrita
            this.fileHandle = Bun.file(this.filePath, {
                type: "file",
            }).writer({
                append: this.fileOptions.append,
            });

            // Se já existe o arquivo, pega o tamanho atual
            if (this.fileOptions.append && existsSync(this.filePath)) {
                const stats = Bun.file(this.filePath).size;
                this.bytesWritten = stats;
            }
        } catch (error) {
            console.error(`Erro ao inicializar arquivo de log: ${error}`);
        }
    }

    /**
     * Rotaciona o arquivo de log se necessário
     */
    private checkRotation(): void {
        if (!this.fileOptions.rotationSizeMB || !this.fileHandle) {
            return;
        }

        const maxBytes = this.fileOptions.rotationSizeMB * 1024 * 1024;

        if (this.bytesWritten >= maxBytes) {
            this.rotateLogFile();
        }
    }

    /**
     * Rotaciona o arquivo de log
     */
    private rotateLogFile(): void {
        try {
            // Fecha o arquivo atual
            this.fileHandle?.flush();
            this.fileHandle?.close();

            // Rotaciona os arquivos antigos
            this.rotateOldFiles();

            // Cria um novo arquivo
            this.initializeLogFile();
            this.bytesWritten = 0;
        } catch (error) {
            console.error(`Erro ao rotacionar arquivo de log: ${error}`);
        }
    }

    /**
     * Rotaciona os arquivos antigos
     */
    private rotateOldFiles(): void {
        const basePath = this.filePath;
        const keepFiles = this.fileOptions.keepLogFiles || 5;

        // Remove o arquivo mais antigo se necessário
        const oldestFile = `${basePath}.${keepFiles - 1}`;
        if (existsSync(oldestFile)) {
            Bun.file(oldestFile).remove();
        }

        // Rotaciona os arquivos existentes
        for (let i = keepFiles - 2; i >= 0; i--) {
            const currentFile = i === 0 ? basePath : `${basePath}.${i}`;
            const nextFile = `${basePath}.${i + 1}`;

            if (existsSync(currentFile)) {
                Bun.file(currentFile).move(nextFile);
            }
        }
    }

    /**
     * Escreve a mensagem no arquivo de log
     */
    protected writeLog(
        level: LogLevel,
        formattedMessage: string,
        rawMessage: string,
        context?: LogContext
    ): void {
        if (!this.fileHandle) {
            this.initializeLogFile();
        }

        try {
            // Adicionar quebra de linha
            const logEntry = `${formattedMessage}\n`;

            // Adicionar ao buffer
            this.logBuffer.push(logEntry);

            // Se for para descarregar imediatamente, fazer agora
            if (this.fileOptions.flushImmediately) {
                this.flush();
            } else {
                // Agenda uma descarga se ainda não houver uma agendada
                if (!this.flushTimeout) {
                    this.flushTimeout = setTimeout(() => this.flush(), 1000);
                }
            }
        } catch (error) {
            console.error(`Erro ao escrever no arquivo de log: ${error}`);
        }
    }

    /**
     * Descarrega o buffer para o arquivo
     */
    public flush(): void {
        if (this.flushTimeout) {
            clearTimeout(this.flushTimeout);
            this.flushTimeout = null;
        }

        if (this.logBuffer.length === 0 || !this.fileHandle) {
            return;
        }

        try {
            const content = this.logBuffer.join("");
            const bytesWritten = this.fileHandle.write(content);

            this.bytesWritten += bytesWritten;
            this.logBuffer = [];

            // Verifica se precisa rotacionar o arquivo
            this.checkRotation();
        } catch (error) {
            console.error(`Erro ao descarregar buffer de log: ${error}`);
        }
    }

    /**
     * Finaliza o logger, garantindo que tudo seja descarregado
     */
    public close(): void {
        this.flush();

        if (this.fileHandle) {
            this.fileHandle.flush();
            this.fileHandle.close();
            this.fileHandle = null;
        }
    }
}
