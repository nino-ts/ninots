/**
 * Tipos utilitários para o framework
 */

/**
 * Representa um tipo de classe construtora
 */
export interface Type<T> extends Function {
    new (...args: any[]): T;
}

/**
 * Função anônima ou nomeada
 */
export type Func<T = any> = (...args: any[]) => T;
