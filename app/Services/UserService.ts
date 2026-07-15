import type { EventDispatcher } from "@ninots/framework";
import { UserCreatedEvent } from "@/app/Events/UserCreatedEvent";
import { User } from "@/app/Models/User";

/**
 * User service — business logic for user operations.
 */
export class UserService {
    constructor(private readonly events: EventDispatcher) {}

    public async all(): Promise<User[]> {
        return User.all();
    }

    public async find(id: number): Promise<User | null> {
        return User.find(id);
    }

    public async create(data: Record<string, unknown>): Promise<User> {
        const user = new User();
        user.fill(data);
        await user.save();
        await this.events.dispatch(new UserCreatedEvent(user.id, user.email));
        return user;
    }

    public async update(id: number, data: Record<string, unknown>): Promise<User> {
        const user = await this.find(id);
        if (!user) {
            throw new Error("User not found");
        }
        user.fill(data);
        await user.save();
        return user;
    }

    public async delete(id: number): Promise<boolean> {
        const user = await this.find(id);
        if (!user) {
            return false;
        }
        await user.delete();
        return true;
    }
}
