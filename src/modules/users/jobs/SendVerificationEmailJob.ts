/**
 * Send verification email job.
 *
 * Queued job to send verification emails.
 */
export class SendVerificationEmailJob {
    /**
     * Create a new job instance.
     *
     * @param userId - The user's ID
     * @param email - The user's email
     */
    constructor(
        public readonly userId: number,
        public readonly email: string,
    ) {}

    /**
     * Execute the job.
     */
    public async handle(): Promise<void> {}
}
