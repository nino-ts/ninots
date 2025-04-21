import { z } from 'zod';
import { BaseEntity } from './base.entity';

/**
 * Schema Zod para validação de usuário
 */
export const userSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(2).max(100),
    email: z.string().email()
});

/**
 * Tipo inferido do schema do usuário
 */
export type UserType = z.infer<typeof userSchema>;

/**
 * Classe que representa um usuário no sistema
 */
export class User extends BaseEntity implements UserType {
    protected schema = userSchema;

    constructor(
        public id: number,
        public name: string,
        public email: string
    ) {
        super();
        this.validate();
    }

    /**
     * Cria uma nova instância de User a partir de dados brutos
     * @param data Dados do usuário
     * @returns Nova instância de User
     * @throws {z.ZodError} Se os dados forem inválidos
     */
    public static fromData(data: unknown): User {
        const parsed = userSchema.parse(data);
        return new User(parsed.id, parsed.name, parsed.email);
    }

    /**
     * Cria uma nova instância de User a partir de dados brutos de forma segura
     * @param data Dados do usuário
     * @returns Resultado da criação do usuário
     */
    public static safeFromData(data: unknown): z.SafeParseReturnType<UserType, User> {
        const result = userSchema.safeParse(data);
        if (!result.success) {
            return result;
        }
        try {
            const user = new User(result.data.id, result.data.name, result.data.email);
            return { success: true, data: user };
        } catch (error) {
            return { success: false, error: error as z.ZodError };
        }
    }

    /**
     * Atualiza os dados do usuário
     * @param data Dados parciais do usuário
     * @throws {z.ZodError} Se os dados forem inválidos
     */
    public update(data: Partial<UserType>): void {
        const merged = { ...this, ...data };
        const parsed = userSchema.parse(merged);
        Object.assign(this, parsed);
    }
} 