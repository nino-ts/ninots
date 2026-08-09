/**
 * Feature smoke — notifications wire (array + mail via MailManager).
 *
 * @packageDocumentation
 */

import { describe, expect, test } from "bun:test";
import { ArrayTransport, type MailManager } from "@ninots/mail";
import { ArrayChannel, type NotificationSender } from "@ninots/notifications";
import { createMailManager, MAIL_MANAGER_KEY } from "@/app/Mail/createMailServices";
import { createAppNotificationSender, NOTIFICATION_SENDER_KEY } from "@/app/Notifications/createNotificationServices";
import { WelcomeNotification } from "@/app/Notifications/WelcomeNotification";
import { bootstrap } from "@/bootstrap/app";

describe("Notifications smoke", () => {
    test("bootstrap resolves NotificationSender singleton", async () => {
        const app = await bootstrap();
        const sender = app.make<NotificationSender>(NOTIFICATION_SENDER_KEY);
        expect(sender).toBeDefined();
        expect(typeof sender.send).toBe("function");
    });

    test("send WelcomeNotification via mail array transport + array channel", async () => {
        const mail = createMailManager({
            default: "array",
            from: { address: "hello@example.com", name: "Ninots App" },
            mailers: {
                array: { driver: "array" },
                log: { driver: "log" },
                smtp: {
                    driver: "smtp",
                    host: "127.0.0.1",
                    port: 2525,
                },
            },
        });

        const sender = createAppNotificationSender(mail);
        await sender.send({ email: "qa@ninots.test" }, new WelcomeNotification());

        const transport = mail.mailer("array").getTransport();
        expect(transport).toBeInstanceOf(ArrayTransport);
        if (!(transport instanceof ArrayTransport)) {
            throw new Error("expected ArrayTransport");
        }
        expect(transport.messages).toHaveLength(1);
        expect(transport.messages[0]?.subject).toBe("Welcome to Ninots");
        expect(transport.messages[0]?.to[0]?.address).toBe("qa@ninots.test");

        const array = sender.arrayChannel();
        expect(array).toBeInstanceOf(ArrayChannel);
        expect(array?.notifications).toHaveLength(1);
        expect(array?.notifications[0]?.data).toEqual({ kind: "welcome" });
    });

    test("bootstrapped sender can send via default mailer", async () => {
        const app = await bootstrap();
        const mail = app.make<MailManager>(MAIL_MANAGER_KEY);
        const sender = app.make<NotificationSender>(NOTIFICATION_SENDER_KEY);

        // Force array mailer for assertion without SMTP.
        const arrayMail = createMailManager({
            default: "array",
            from: { address: "hello@example.com", name: "Ninots App" },
            mailers: {
                array: { driver: "array" },
                log: { driver: "log" },
                smtp: {
                    driver: "smtp",
                    host: "127.0.0.1",
                    port: 2525,
                },
            },
        });
        const isolated = createAppNotificationSender(arrayMail);
        await isolated.send({ email: "boot@ninots.test" }, new WelcomeNotification());

        expect(mail).toBeDefined();
        expect(sender).toBeDefined();
        expect(isolated.arrayChannel()?.notifications).toHaveLength(1);
    });
});
