/**
 * User created event.
 *
 * Dispatched when a new user is created.
 */
export class UserCreatedEvent {
    /**
     * Create a new event instance.
     *
     * @param userId - The created user's ID
     * @param email - The created user's email
     */
    constructor(
        public readonly userId: number,
        public readonly email: string
    ) {}
}
