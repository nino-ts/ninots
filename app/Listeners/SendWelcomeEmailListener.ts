import type { QueueManager } from "@ninots/queue";
import type { UserCreatedEvent } from "@/app/Events/UserCreatedEvent";
import { SendVerificationEmailJob } from "@/app/Jobs/SendVerificationEmailJob";

/**
 * Sends a verification email job when a user is created.
 */
export class SendWelcomeEmailListener {
    constructor(private readonly queue: QueueManager) {}

    public async handle(event: UserCreatedEvent): Promise<void> {
        await this.queue.push(new SendVerificationEmailJob(event.userId, event.email));
    }
}
