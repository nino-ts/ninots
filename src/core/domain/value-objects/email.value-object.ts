/**
 * Implementação de value objects
 *
 * Value Objects são objetos imutáveis que representam conceitos do domínio
 * e são definidos por seus valores, não por sua identidade.
 */

/**
 * Interface genérica para Value Objects
 */
export interface ValueObject<T = any> {
    /**
     * Verifica se dois value objects são iguais
     * @param vo Outro value object para comparação
     */
    equals(vo: ValueObject<T>): boolean;

    /**
     * Obtém o valor bruto
     */
    value(): T;
}

/**
 * Value Object para Email
 */
export class Email implements ValueObject<string> {
    private readonly email: string;
    private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /**
     * Construtor privado para garantir criação via factory method
     */
    private constructor(email: string) {
        this.email = email;
    }

    /**
     * Cria uma nova instância de Email
     * @param email Endereço de email
     * @throws Error se o email for inválido
     */
    public static create(email: string): Email {
        if (!email) {
            throw new Error("Email não pode ser vazio");
        }

        if (!Email.EMAIL_REGEX.test(email)) {
            throw new Error("Formato de email inválido");
        }

        return new Email(email);
    }

    /**
     * Obtém o valor do email
     */
    public value(): string {
        return this.email;
    }

    /**
     * Verifica se dois emails são iguais
     * @param vo Outro email para comparação
     */
    public equals(vo?: ValueObject<string>): boolean {
        if (vo === null || vo === undefined) {
            return false;
        }

        if (!(vo instanceof Email)) {
            return false;
        }

        return this.email === vo.value();
    }

    /**
     * Retorna uma representação em string do email
     */
    public toString(): string {
        return this.email;
    }
}

/**
 * Value Object para senha
 */
export class Password implements ValueObject<string> {
    private readonly password: string;
    private readonly hashedPassword?: string;

    /**
     * Construtor privado para garantir criação via factory method
     */
    private constructor(password: string, hashedPassword?: string) {
        this.password = password;
        this.hashedPassword = hashedPassword;
    }

    /**
     * Cria uma nova instância de Password
     * @param password Senha em texto plano
     * @throws Error se a senha for inválida
     */
    public static create(password: string): Password {
        if (!password) {
            throw new Error("Senha não pode ser vazia");
        }

        if (password.length < 6) {
            throw new Error("Senha deve ter pelo menos 6 caracteres");
        }

        return new Password(password);
    }

    /**
     * Cria uma instância de Password a partir de uma senha já armazenada (hash)
     * @param hashedPassword Senha já hasheada
     */
    public static fromHashed(hashedPassword: string): Password {
        if (!hashedPassword) {
            throw new Error("Hash de senha não pode ser vazio");
        }

        return new Password("", hashedPassword);
    }

    /**
     * Obtém o valor da senha
     */
    public value(): string {
        return this.hashedPassword || this.password;
    }

    /**
     * Verifica se a senha é compatível com um hash
     * @param plainText Senha em texto plano para verificação
     */
    public async compare(plainText: string): Promise<boolean> {
        if (!this.hashedPassword) {
            return this.password === plainText;
        }

        // Numa implementação real, usaríamos algo como bcrypt ou argon2
        // Por simplicidade, apenas comparamos com a string hasheada
        return this.hashedPassword === plainText;
    }

    /**
     * Verifica se duas senhas são iguais
     * @param vo Outro value object para comparação
     */
    public equals(vo?: ValueObject<string>): boolean {
        if (vo === null || vo === undefined) {
            return false;
        }

        if (!(vo instanceof Password)) {
            return false;
        }

        return this.value() === vo.value();
    }

    /**
     * Gera um hash da senha
     * @returns Uma nova instância de Password com o hash
     */
    public async hash(): Promise<Password> {
        // Numa implementação real, usaríamos algo como bcrypt.hash()
        // Por simplicidade, usamos um "hash" simplificado para o exemplo
        const hashedPassword = `hashed_${this.password}`;

        return new Password(this.password, hashedPassword);
    }
}
