/**
 * Notification service (minimal stub until persistence is wired).
 */
export class NotificationService {
    public async all(): Promise<unknown[]> {
        return [];
    }

    public async create(data: Record<string, unknown>): Promise<Record<string, unknown>> {
        return { ...data };
    }
}
