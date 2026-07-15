import { Seeder } from "@ninots/framework";
import { User } from "@/app/Models/User";

/**
 * Seed the application's database.
 */
export class DatabaseSeeder extends Seeder {
    async run(): Promise<void> {
        await User.factory().create({
            email: "test@example.com",
            name: "Test User",
        });
    }
}
