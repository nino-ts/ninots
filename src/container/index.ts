/**
 * Container de Injeção de Dependências - Implementação avançada
 *
 * Este módulo fornece um container avançado de inversão de controle (IoC)
 * com suporte a ciclos de vida, escopos e injeção automática via decoradores.
 */

import type { Constructor, ContainerScope, Factory, Resolver } from "./types";
import { LifecycleType } from "./types";
import { INJECTABLE_METADATA_KEY } from "./decorators";
import { LoggerFactory } from "../core/infrastructure/logging/logger-factory";
import { v4 as uuidv4 } from "uuid";

const logger = LoggerFactory.create("container");

/**
 * Container de Injeção de Dependências
 * Implementação com suporte a ciclos de vida e escopos
 */
class Container {
    // Instância singleton do container
    private static instance: Container;

    // Mapa de resolvers (construtores ou factories)
    private bindings: Map<string | symbol, Resolver<any>> = new Map();

    // Mapa de ciclos de vida para os bindings
    private lifecycles: Map<string | symbol, LifecycleType> = new Map();

    // Cache para instâncias singleton
    private singletons: Map<string | symbol, any> = new Map();

    // Mapa de escopos para instâncias scoped
    private scopedInstances: Map<string, Map<string | symbol, any>> = new Map();

    // Escopo atual (null para escopo global)
    private currentScope: ContainerScope | null = null;

    // Lista de escopos ativos
    private activeScopes: Map<string, ContainerScope> = new Map();

    /**
     * Construtor privado para garantir o padrão Singleton
     */
    private constructor() {}

    /**
     * Obtém a instância única do Container
     */
    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }

    /**
     * Registra um binding no container com um ciclo de vida específico
     */
    public bind<T>(
        token: string | symbol,
        resolver: Resolver<T>,
        lifecycle: LifecycleType = LifecycleType.TRANSIENT
    ): void {
        this.bindings.set(token, resolver);
        this.lifecycles.set(token, lifecycle);

        // Se for singleton, marca para lazy loading
        if (lifecycle === LifecycleType.SINGLETON) {
            this.singletons.set(token, null);
        }

        logger.debug(
            `Binding registrado: ${String(token)}, lifecycle: ${lifecycle}`
        );
    }

    /**
     * Registra um singleton no container
     */
    public singleton<T>(token: string | symbol, resolver: Resolver<T>): void {
        this.bind(token, resolver, LifecycleType.SINGLETON);
    }

    /**
     * Registra um serviço transient no container
     */
    public transient<T>(token: string | symbol, resolver: Resolver<T>): void {
        this.bind(token, resolver, LifecycleType.TRANSIENT);
    }

    /**
     * Registra um serviço scoped no container
     */
    public scoped<T>(token: string | symbol, resolver: Resolver<T>): void {
        this.bind(token, resolver, LifecycleType.SCOPED);
    }

    /**
     * Registra uma classe decorada com @Injectable automaticamente
     */
    public register<T>(target: Constructor<T>): void {
        const metadata = Reflect.getMetadata(INJECTABLE_METADATA_KEY, target);

        if (!metadata) {
            throw new Error(
                `A classe ${target.name} não está decorada com @Injectable`
            );
        }

        const { token, lifecycle } = metadata;

        this.bind(token, target, lifecycle);
    }

    /**
     * Resolve uma dependência do container
     */
    public resolve<T>(token: string | symbol): T {
        // Verificar se existe o binding
        const resolver = this.bindings.get(token);

        if (!resolver) {
            throw new Error(
                `Binding não encontrado para o token: ${String(token)}`
            );
        }

        const lifecycle = this.lifecycles.get(token) || LifecycleType.TRANSIENT;

        // Roteamento conforme o ciclo de vida
        switch (lifecycle) {
            case LifecycleType.SINGLETON:
                return this.resolveSingleton<T>(token, resolver);
            case LifecycleType.SCOPED:
                return this.resolveScoped<T>(token, resolver);
            case LifecycleType.TRANSIENT:
            default:
                return this.resolveTransient<T>(resolver);
        }
    }

    /**
     * Resolve uma instância singleton
     */
    private resolveSingleton<T>(
        token: string | symbol,
        resolver: Resolver<T>
    ): T {
        // Se já tivermos a instância no cache, retorna
        if (this.singletons.has(token)) {
            const instance = this.singletons.get(token);
            if (instance !== null) {
                return instance as T;
            }
        }

        // Caso contrário, cria a instância e armazena no cache
        const instance = this.createInstance<T>(resolver);
        this.singletons.set(token, instance);

        return instance;
    }

    /**
     * Resolve uma instância scoped
     */
    private resolveScoped<T>(token: string | symbol, resolver: Resolver<T>): T {
        // Verificar se temos um escopo ativo
        if (!this.currentScope) {
            throw new Error(
                `Tentativa de resolver serviço scoped ${String(
                    token
                )} fora de um escopo`
            );
        }

        // Verificar se já temos a instância neste escopo
        const scopeId = this.currentScope.id;
        let scopeInstances = this.scopedInstances.get(scopeId);

        if (!scopeInstances) {
            scopeInstances = new Map();
            this.scopedInstances.set(scopeId, scopeInstances);
        }

        if (scopeInstances.has(token)) {
            return scopeInstances.get(token) as T;
        }

        // Criar nova instância para este escopo
        const instance = this.createInstance<T>(resolver);
        scopeInstances.set(token, instance);

        return instance;
    }

    /**
     * Resolve uma instância transient (sempre nova)
     */
    private resolveTransient<T>(resolver: Resolver<T>): T {
        return this.createInstance<T>(resolver);
    }

    /**
     * Cria uma instância a partir de um resolver com injeção automática
     */
    private createInstance<T>(resolver: Resolver<T>): T {
        if (typeof resolver !== "function") {
            return resolver as T;
        }

        // Se for uma factory (função sem prototype), apenas invoca
        if (!resolver.prototype) {
            return (resolver as Factory<T>)();
        }

        const target = resolver as Constructor<T>;

        // Resolver dependências do construtor
        const dependencies =
            Reflect.getMetadata("container:dependencies", target) || [];
        const params = dependencies.map((dep: string | symbol | null) => {
            if (!dep) return undefined;
            return this.resolve(dep);
        });

        // Criar instância com as dependências resolvidas
        const instance = new target(...params);

        // Processar injeções de propriedades
        this.processPropertyInjections(instance);

        return instance;
    }

    /**
     * Processa injeções de propriedades via @LazyInject
     */
    private processPropertyInjections(instance: any): void {
        const proto = Object.getPrototypeOf(instance);

        if (!proto) return;

        // Obter todas as propriedades com metadados de injeção
        const props = Object.getOwnPropertyNames(proto);

        for (const prop of props) {
            const token = Reflect.getMetadata("container:inject", proto, prop);

            if (token) {
                // Definir um descriptor que resolve a dependência sob demanda
                Object.defineProperty(instance, prop, {
                    configurable: true,
                    enumerable: true,
                    get: () => this.resolve(token),
                });
            }
        }
    }

    /**
     * Cria um novo escopo para resolução de serviços scoped
     */ public createScope(parentScope?: ContainerScope): ContainerScope {
        const scope = {
            id: uuidv4(),
            parent: parentScope || undefined,
        } as ContainerScope;

        this.activeScopes.set(scope.id, scope);

        return scope;
    }

    /**
     * Define o escopo atual para resolução de serviços
     */
    public setCurrentScope(scope: ContainerScope | null): void {
        this.currentScope = scope;
    }

    /**
     * Desativa um escopo e limpa seus recursos
     */
    public disposeScope(scopeId: string): void {
        if (!this.activeScopes.has(scopeId)) {
            return;
        }

        // Remover instâncias deste escopo
        this.scopedInstances.delete(scopeId);
        this.activeScopes.delete(scopeId);

        // Se for o escopo atual, limpa
        if (this.currentScope && this.currentScope.id === scopeId) {
            this.currentScope = null;
        }

        logger.debug(`Escopo ${scopeId} descartado`);
    }

    /**
     * Verifica se um binding existe
     */
    public has(token: string | symbol): boolean {
        return this.bindings.has(token);
    }

    /**
     * Remove um binding do container
     */
    public unbind(token: string | symbol): void {
        // Remover de todos os caches
        this.bindings.delete(token);
        this.lifecycles.delete(token);
        this.singletons.delete(token);
        // Remover de todos os escopos
        for (const [_, instances] of this.scopedInstances.entries()) {
            instances.delete(token);
        }

        logger.debug(`Binding removido: ${String(token)}`);
    }

    /**
     * Limpa todos os bindings do container
     */
    public clear(): void {
        this.bindings.clear();
        this.lifecycles.clear();
        this.singletons.clear();
        this.scopedInstances.clear();
        this.activeScopes.clear();
        this.currentScope = null;

        logger.debug("Container limpo");
    }
}

// Exportar a instância única do Container
export const container = Container.getInstance();

// Re-exportação de tipos e decoradores
export * from "./types";
export * from "./decorators";
