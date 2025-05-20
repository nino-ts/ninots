/**
 * Configuração do sistema de log para o Ninots
 */

import { LogLevel } from "../core/infrastructure/logging/logger";

export default {
    /**
     * Configuração do logger para console
     */
    console: {
        enabled: true,
        minLevel:
            process.env.NODE_ENV === "production"
                ? LogLevel.INFO
                : LogLevel.DEBUG,
        useColors: true,
        includeTimestamp: true,
        timestampFormat: "ISO", // 'ISO' | 'UTC' | 'LOCALE'
    },

    /**
     * Configuração do logger para arquivo
     */
    file: {
        enabled: process.env.NODE_ENV === "production",
        filePath: "./logs/ninots.log",
        append: true,
        flushImmediately: false,
        minLevel: LogLevel.INFO,
        rotationSizeMB: 10,
        keepLogFiles: 5,
    },
};
