/**
 * Entidade de usuário para o sistema
 */

import { Entity, PrimaryKey, Column } from "ninorm/src/Core/Decorators";
import { BaseEntity } from "./base.entity";

/**
 * Entidade que representa um usuário no sistema
 */
@Entity("users")
export class User extends BaseEntity {
    /**
     * Identificador único do usuário
     */
    @PrimaryKey()
    id: number;

    /**
     * Nome do usuário
     */
    @Column({ type: "string" })
    name: string;

    /**
     * Email do usuário
     */
    @Column({ type: "string" })
    email: string;

    /**
     * Senha do usuário (hash)
     */
    @Column({ type: "string" })
    password: string;

    /**
     * Verifica se a senha fornecida corresponde à senha armazenada
     * @param password Senha a ser verificada
     * @returns true se a senha for válida, false caso contrário
     */
    async verifyPassword(password: string): Promise<boolean> {
        // Em uma implementação real, usaríamos bcrypt ou similar
        return this.password === password;
    }
}
