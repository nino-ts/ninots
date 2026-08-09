/**
 * Demo / smoke notification (mail + array).
 *
 * @packageDocumentation
 */

import {
    MailMessage,
    type Notifiable,
    type Notification,
    type NotificationChannelName,
} from "@ninots/notifications";

/**
 * Welcome notification used by Feature smoke tests.
 */
export class WelcomeNotification implements Notification {
    public via(_notifiable: Notifiable): NotificationChannelName[] {
        return ["mail", "array"];
    }

    public toMail(_notifiable: Notifiable): MailMessage {
        return new MailMessage()
            .withSubject("Welcome to Ninots")
            .line("Thanks for signing up.");
    }

    public toArray(_notifiable: Notifiable): Record<string, unknown> {
        return { kind: "welcome" };
    }
}
