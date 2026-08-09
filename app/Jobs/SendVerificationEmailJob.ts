import type { MailManager } from "@ninots/mail";
import type { QueueableJob } from "@ninots/queue";

/**
 * Send verification email job — runs immediately on sync queue;
 * enqueued for `nino queue:work` when QUEUE_CONNECTION=redis.
 * Uses `@ninots/mail` when a {@link MailManager} is injected.
 */
export class SendVerificationEmailJob implements QueueableJob {
    public static handledJobs: SendVerificationEmailJob[] = [];

    public readonly jobName = "SendVerificationEmailJob";

    private mail: MailManager | undefined;

    constructor(
        public readonly userId: number,
        public readonly email: string,
    ) {}

    /**
     * Optional mail manager for real send (sync path via app composition).
     */
    public withMail(mail: MailManager): this {
        this.mail = mail;
        return this;
    }

    public toData(): Record<string, unknown> {
        return {
            email: this.email,
            userId: this.userId,
        };
    }

    public static fromData(data: Record<string, unknown>): SendVerificationEmailJob {
        const userId = data.userId;
        const email = data.email;
        if (typeof userId !== "number" || typeof email !== "string") {
            throw new Error("Invalid SendVerificationEmailJob payload");
        }
        return new SendVerificationEmailJob(userId, email);
    }

    public async handle(): Promise<void> {
        SendVerificationEmailJob.handledJobs.push(this);
        if (this.mail !== undefined) {
            await this.mail.mailer().send({
                to: this.email,
                subject: "Verify your email",
                text: `Welcome! Verify user #${this.userId} at ${this.email}`,
            });
        }
    }

    /** Reset tracking state between tests. */
    public static resetHandledJobs(): void {
        SendVerificationEmailJob.handledJobs = [];
    }
}
