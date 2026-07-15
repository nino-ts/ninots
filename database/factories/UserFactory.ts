import { configureModelFactory, Factory, fake } from "@ninots/framework";
import { User } from "@/app/Models/User";

export type UserFactoryAttributes = {
    name: string;
    email: string;
    password: string;
    avatar?: string | null;
    metadata?: Record<string, unknown> | null;
};

/**
 * Factory for generating User records in tests and seeders.
 */
export class UserFactory extends Factory<User, UserFactoryAttributes> {
    definition(): UserFactoryAttributes {
        return {
            email: fake.uniqueEmail(),
            name: fake.name(),
            password: fake.password(),
        };
    }

    model() {
        return User;
    }

    unverified() {
        return this.state({ metadata: { email_verified_at: null } });
    }
}

configureModelFactory(User, UserFactory);
