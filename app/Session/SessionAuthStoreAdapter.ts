import type { AuthSessionStore } from "@ninots/auth";
import type { Session } from "@ninots/session";

/**
 * Adapts `@ninots/session` {@link Session} to auth's local {@link AuthSessionStore}.
 *
 * Lives in the app so `@ninots/auth` never imports `@ninots/session` (zero cross-deps).
 */
export class SessionAuthStoreAdapter implements AuthSessionStore {
    constructor(private readonly session: Session) {}

    public get<T = unknown>(key: string, defaultValue?: T): T {
        return this.session.get(key, defaultValue);
    }

    public put(key: string, value: unknown): void {
        this.session.set(key, value);
    }

    public forget(key: string): void {
        this.session.forget(key);
    }

    public flush(): void {
        for (const key of Object.keys(this.session.all())) {
            this.session.forget(key);
        }
    }

    public async regenerate(destroy?: boolean): Promise<boolean> {
        if (destroy === true) {
            this.flush();
        }
        await this.session.regenerate();
        return true;
    }

    /**
     * Underlying `@ninots/session` instance (persist via `save()`).
     */
    public unwrap(): Session {
        return this.session;
    }
}
