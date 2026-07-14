import { User } from "@/modules/users/models/User";

/**
 * User service.
 *
 * Handles business logic for user operations.
 */
export class UserService {
    /**
     * Get all users.
     *
     * @returns Array of users
     */
    public async all(): Promise<User[]> {
        return User.all();
    }

    /**
     * Find a user by ID.
     *
     * @param id - The user ID
     * @returns The user or null if not found
     */
    public async find(id: number): Promise<User | null> {
        return User.find(id);
    }

    /**
     * Create a new user.
     *
     * @param data - The user data
     * @returns The created user
     */
    public async create(data: Record<string, unknown>): Promise<User> {
        const user = new User();
        user.fill(data);
        await user.save();
        return user;
    }

    /**
     * Update an existing user.
     *
     * @param id - The user ID
     * @param data - The update data
     * @returns The updated user
     */
    public async update(id: number, data: Record<string, unknown>): Promise<User> {
        const user = await this.find(id);
        if (!user) {
            throw new Error("User not found");
        }
        user.fill(data);
        await user.save();
        return user;
    }

    /**
     * Delete a user.
     *
     * @param id - The user ID
     * @returns Whether the deletion was successful
     */
    public async delete(id: number): Promise<boolean> {
        const user = await this.find(id);
        if (!user) {
            return false;
        }
        await user.delete();
        return true;
    }
}
