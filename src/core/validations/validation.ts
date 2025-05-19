/**
 * Sistema de validação usando Zod
 */

import { z } from "zod";
import {
    HttpRequest,
    HttpResponse,
} from "../interfaces/http/middlewares/auth.middleware";

/**
 * Interface para um validador
 */
export interface Validator<T = any> {
    /**
     * Valida os dados fornecidos
     * @param data Dados para validar
     * @returns Dados validados e tipados
     * @throws Se a validação falhar
     */
    validate(data: any): T;
}

/**
 * Validador baseado em schemas Zod
 */
export class ZodValidator<T> implements Validator<T> {
    /**
     * Cria um novo validador com um schema Zod
     * @param schema Schema do Zod para validação
     */
    constructor(private schema: z.ZodType<T>) {}

    /**
     * Valida os dados usando o schema Zod
     * @param data Dados para validar
     * @returns Dados validados e tipados
     * @throws Se a validação falhar
     */
    validate(data: any): T {
        return this.schema.parse(data);
    }
}

/**
 * Middleware para validação de requisições HTTP
 * @param schema Schema Zod para validar o corpo da requisição
 * @param source Fonte dos dados para validar
 * @returns Middleware para validação
 */
export function validationMiddleware(
    schema: z.ZodType<any>,
    source: "body" | "query" | "params" = "body"
) {
    const validator = new ZodValidator(schema);

    return async (
        request: HttpRequest,
        next: () => Promise<HttpResponse>
    ): Promise<HttpResponse> => {
        try {
            // Valida os dados da fonte especificada
            const validatedData = validator.validate(request[source]);

            // Atualiza os dados na requisição com os dados validados
            request[source] = validatedData;

            // Continua para o próximo middleware ou controlador
            return next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return {
                    status: 400,
                    body: {
                        errors: error.errors.map((err) => ({
                            path: err.path.join("."),
                            message: err.message,
                        })),
                    },
                };
            }

            return {
                status: 400,
                body: { message: "Validation failed" },
            };
        }
    };
}

/**
 * Cria um schema de validação para um modelo
 * @param schema Schema Zod para o modelo
 * @returns Factory para schemas derivados
 */
export function createModelSchema<T extends z.ZodRawShape>(schema: T) {
    const baseSchema = z.object(schema);

    return {
        // Schema para criação
        create: baseSchema,
        // Schema para atualização (todos os campos opcionais)
        update: baseSchema.partial(),
        // Schema para consulta
        query: z.object({
            limit: z.number().positive().optional(),
            offset: z.number().nonnegative().optional(),
            orderBy: z.string().optional(),
            order: z.enum(["asc", "desc"]).optional(),
        }),
    };
}
