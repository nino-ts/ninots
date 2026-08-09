import { describe, expect, test } from "bun:test";
import { ArrayTransport, type MailManager } from "@ninots/mail";
import {
    createMailManager,
    MAIL_MANAGER_KEY,
} from "@/app/Mail/createMailServices";
import { bootstrap } from "@/bootstrap/app";

describe("Mail smoke", () => {
    test("bootstrap resolves MailManager singleton", async () => {
        const app = await bootstrap();
        const mail = app.make<MailManager>(MAIL_MANAGER_KEY);
        expect(mail).toBeDefined();
        expect(typeof mail.mailer).toBe("function");
    });

    test("array mailer collects sent messages", async () => {
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

        await mail.mailer("array").send({
            to: "qa@ninots.test",
            subject: "Smoke",
            text: "hello mail",
        });

        const transport = mail.mailer("array").getTransport();
        expect(transport).toBeInstanceOf(ArrayTransport);
        if (!(transport instanceof ArrayTransport)) {
            throw new Error("expected ArrayTransport");
        }
        expect(transport.messages).toHaveLength(1);
        expect(transport.messages[0]?.subject).toBe("Smoke");
    });
});
