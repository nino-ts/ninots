/**
 * Send verification email job — runs synchronously when QUEUE_CONNECTION=sync.
 */
export class SendVerificationEmailJob {
    public static handledJobs: SendVerificationEmailJob[] = [];

    constructor(
        public readonly userId: number,
        public readonly email: string,
    ) {}

    public async handle(): Promise<void> {
        SendVerificationEmailJob.handledJobs.push(this);
    }

    /** Reset tracking state between tests. */
    public static resetHandledJobs(): void {
        SendVerificationEmailJob.handledJobs = [];
    }
}
