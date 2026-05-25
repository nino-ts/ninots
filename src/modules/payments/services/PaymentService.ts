/**
 * Payment service (minimal stub until persistence is wired).
 */
export class PaymentService {
    public async all(): Promise<unknown[]> {
        return [];
    }

    public async create(data: Record<string, unknown>): Promise<Record<string, unknown>> {
        return { ...data };
    }
}
