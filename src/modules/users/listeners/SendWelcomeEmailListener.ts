import { UserCreatedEvent } from '@/modules/users/events/UserCreatedEvent';

/**
 * Send welcome email listener.
 *
 * Handles sending welcome email when a user is created.
 */
export class SendWelcomeEmailListener {
    /**
     * Handle the event.
     *
     * @param event - The user created event
     */
    public async handle(event: UserCreatedEvent): Promise<void> {
        // TODO: Send welcome email
        console.log(`Sending welcome email to ${event.email}`);
    }
}
