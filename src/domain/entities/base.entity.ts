import { z } from 'zod';

/**
 * Classe base para todas as entidades do sistema
 */
export abstract class BaseEntity {
    /**
     * Schema Zod para validação da entidade
     */
    protected abstract schema: z.ZodType<any>;

    /**
     * Valida os dados da entidade
     * @throws {z.ZodError} Se os dados forem inválidos
     */
    public validate(): void {
        this.schema.parse(this);
    }

    /**
     * Valida os dados da entidade de forma segura
     * @returns {z.SafeParseReturnType} Resultado da validação
     */
    public safeParse(): z.SafeParseReturnType<any, any> {
        return this.schema.safeParse(this);
    }
} 