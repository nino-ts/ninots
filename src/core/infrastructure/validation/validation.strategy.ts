/**
 * Implementação do padrão Strategy para validação
 */

/**
 * Interface para estratégias de validação
 */
export interface ValidationStrategy<T = any> {
    /**
     * Valida o valor de acordo com a estratégia
     * @param value Valor a ser validado
     * @returns Se o valor é válido
     */
    validate(value: T): boolean;

    /**
     * Mensagem de erro quando a validação falhar
     * @returns Mensagem de erro
     */
    getErrorMessage(): string;
}

/**
 * Estratégia de validação para garantir que o valor não está vazio
 */
export class NotEmptyValidation implements ValidationStrategy<string> {
    private fieldName: string;

    /**
     * Construtor da estratégia
     * @param fieldName Nome do campo para mensagens de erro
     */
    constructor(fieldName: string) {
        this.fieldName = fieldName;
    }

    validate(value: string): boolean {
        return value !== null && value !== undefined && value.trim() !== "";
    }

    getErrorMessage(): string {
        return `O campo ${this.fieldName} não pode estar vazio`;
    }
}

/**
 * Estratégia de validação para garantir que o valor é um email válido
 */
export class EmailValidation implements ValidationStrategy<string> {
    private fieldName: string;

    /**
     * Construtor da estratégia
     * @param fieldName Nome do campo para mensagens de erro
     */
    constructor(fieldName: string) {
        this.fieldName = fieldName;
    }

    validate(value: string): boolean {
        // Regex simples para validação básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    getErrorMessage(): string {
        return `O campo ${this.fieldName} deve ser um email válido`;
    }
}

/**
 * Validador que usa várias estratégias
 */
export class Validator<T = any> {
    private strategies: ValidationStrategy[] = [];
    private errors: string[] = [];

    /**
     * Adiciona uma estratégia de validação
     * @param strategy Estratégia a ser adicionada
     * @returns O próprio validador para encadeamento
     */
    addStrategy(strategy: ValidationStrategy): Validator<T> {
        this.strategies.push(strategy);
        return this;
    }

    /**
     * Executa todas as estratégias de validação
     * @param value Valor a ser validado
     * @returns Se todas as validações passaram
     */
    validate(value: T): boolean {
        this.errors = [];

        for (const strategy of this.strategies) {
            if (!strategy.validate(value)) {
                this.errors.push(strategy.getErrorMessage());
            }
        }

        return this.errors.length === 0;
    }

    /**
     * Obtém as mensagens de erro das validações que falharam
     * @returns Array de mensagens de erro
     */
    getErrors(): string[] {
        return this.errors;
    }
}
