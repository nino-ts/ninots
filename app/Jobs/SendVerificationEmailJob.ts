import type { QueueableJob } from "@ninots/queue";

/**
 * Send verification email job — runs immediately on sync queue;
 * enqueued for `nino queue:work` when QUEUE_CONNECTION=redis.
 */
export class SendVerificationEmailJob implements QueueableJob {
    public static handledJobs: SendVerificationEmailJob[] = [];

    public readonly jobName = "SendVerificationEmailJob";

    constructor(
        public readonly userId: number,
        public readonly email: string,
    ) {}

    public toData(): Record<string, unknown> {
        return {
            email: this.email,
            userId: this.userId,
        };
    }

    public static fromData(data: Record<string, unknown>): SendVerificationEmailJob {
        const userId = data["userId"];
        const email = data["email"];
        if (typeof userId !== "number" || typeof email !== "string") {
            throw new Error("Invalid SendVerificationEmailJob payload");
        }
        return new SendVerificationEmailJob(userId, email);
    }

    public async handle(): Promise<void> {
        SendVerificationEmailJob.handledJobs.push(this);
    }

    /** Reset tracking state between tests. */
    public static resetHandledJobs(): void {
        SendVerificationEmailJob.handledJobs = [];
    }
}
