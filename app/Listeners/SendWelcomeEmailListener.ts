import type { SyncBus } from "@ninots/framework";
import type { UserCreatedEvent } from "@/app/Events/UserCreatedEvent";
import { SendVerificationEmailJob } from "@/app/Jobs/SendVerificationEmailJob";

/**
 * Sends a verification email job when a user is created.
 */
export class SendWelcomeEmailListener {
    constructor(private readonly bus: SyncBus) {}

    public async handle(event: UserCreatedEvent): Promise<void> {
        await this.bus.dispatch(new SendVerificationEmailJob(event.userId, event.email));
    }
}
