/**
 * Compose `@ninots/notifications` with local mail sender → `@ninots/mail`.
 *
 * @packageDocumentation
 */

import type { Application } from "@ninots/foundation";
import type { MailManager } from "@ninots/mail";
import {
    createNotificationSender,
    type MailChannelSender,
    type NotificationMailPayload,
    type NotificationSender,
} from "@ninots/notifications";
import { MAIL_MANAGER_KEY } from "@/app/Mail/createMailServices";

export const NOTIFICATION_SENDER_KEY = "NotificationSender";

/**
 * Bind mail channel to the app {@link MailManager} (zero cross-deps in package).
 */
export function createMailChannelSender(mail: MailManager): MailChannelSender {
    return {
        async send(message: NotificationMailPayload): Promise<void> {
            await mail.mailer().send({
                to: message.to,
                subject: message.subject,
                text: message.text,
                html: message.html,
                from: message.from,
            });
        },
    };
}

/**
 * Create {@link NotificationSender} with mail + array channels.
 */
export function createAppNotificationSender(mail: MailManager): NotificationSender {
    return createNotificationSender({
        mailSender: createMailChannelSender(mail),
    });
}

/**
 * Resolve mail manager from the container and build the sender.
 */
export function createNotificationSenderFromApp(app: Application): NotificationSender {
    const mail = app.make<MailManager>(MAIL_MANAGER_KEY);
    return createAppNotificationSender(mail);
}
