/**
 * Compose `@ninots/mail` services from `config/mail.ts`.
 *
 * @packageDocumentation
 */

import { MailManager, type MailManagerConfig } from "@ninots/mail";
import mailConfig from "@/config/mail";

export const MAIL_MANAGER_KEY = "MailManager";

/**
 * Build {@link MailManagerConfig} from starter config + env.
 */
export function buildMailManagerConfig(): MailManagerConfig {
    return {
        default: mailConfig.default,
        from: {
            address: mailConfig.from.address,
            name: mailConfig.from.name,
        },
        mailers: {
            array: mailConfig.mailers.array,
            log: mailConfig.mailers.log,
            smtp: {
                driver: "smtp",
                host: mailConfig.mailers.smtp.host,
                port: mailConfig.mailers.smtp.port,
                secure: mailConfig.mailers.smtp.secure,
                auth: mailConfig.mailers.smtp.auth,
            },
        },
    };
}

/**
 * Create the application {@link MailManager}.
 */
export function createMailManager(config: MailManagerConfig = buildMailManagerConfig()): MailManager {
    return new MailManager(config);
}
