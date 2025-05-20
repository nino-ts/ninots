/**
 * Tipos e interfaces para o sistema de injeção de dependências
 */

/**
 * Ciclo de vida para as dependências injetadas
 */
export enum LifecycleType {
    /**
     * Uma nova instância é criada cada vez que o serviço é resolvido
     */
    TRANSIENT = "transient",

    /**
     * Uma única instância é criada e compartilhada durante toda a aplicação
     */
    SINGLETON = "singleton",

    /**
     * Uma instância é criada e compartilhada por escopo (ex: por requisição HTTP)
     */
    SCOPED = "scoped",
}

/**
 * Interfaces para construtores e factories
 */
export type Constructor<T = any> = new (...args: any[]) => T;
export type Factory<T = any> = (...args: any[]) => T;
export type Resolver<T = any> = Constructor<T> | Factory<T>;

/**
 * Interface para metadados de serviço
 */
export interface ServiceMetadata<T = any> {
    token: string | symbol;
    type: LifecycleType;
    resolver: Resolver<T>;
    dependencies?: Array<string | symbol>;
}

/**
 * Interface para definição de escopo
 */
export interface ContainerScope {
    id: string;
    parent?: ContainerScope;
}
