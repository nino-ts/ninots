/**
 * Container de Injeção de Dependências
 *
 * Implementa o padrão de Service Locator para registro e resolução
 * de dependências na aplicação
 */

type Constructor<T = any> = new (...args: any[]) => T;
type ServiceFactory<T = any> = (...args: any[]) => T;

/**
 * Container de Injeção de Dependências
 */
class Container {
    private bindings: Map<
        string,
        { factory: ServiceFactory; isSingleton: boolean }
    > = new Map();
    private instances: Map<string, any> = new Map();

    /**
     * Registra uma fábrica para criar uma dependência
     * @param key Chave para identificar a dependência
     * @param factory Fábrica para criar a instância
     */
    bind<T>(key: string, factory: ServiceFactory<T>): void {
        this.bindings.set(key, { factory, isSingleton: false });
    }

    /**
     * Registra uma classe como dependência
     * @param key Chave para identificar a dependência
     * @param constructor Construtor da classe
     */
    bindClass<T>(key: string, constructor: Constructor<T>): void {
        this.bind(key, () => new constructor());
    }

    /**
     * Registra uma instância única (singleton) para uma dependência
     * @param key Chave para identificar a dependência
     * @param factoryOrConstructor Fábrica ou construtor para criar a instância
     */
    singleton<T>(
        key: string,
        factoryOrConstructor: ServiceFactory<T> | Constructor<T>
    ): void {
        const factory =
            typeof factoryOrConstructor === "function" &&
            /^\s*class\s+/.test(factoryOrConstructor.toString())
                ? () => new (factoryOrConstructor as Constructor<T>)()
                : (factoryOrConstructor as ServiceFactory<T>);

        this.bindings.set(key, { factory, isSingleton: true });
    }

    /**
     * Resolve uma dependência pelo seu identificador
     * @param key Chave da dependência
     * @returns A instância resolvida
     */
    resolve<T>(key: string): T {
        const binding = this.bindings.get(key);

        if (!binding) {
            throw new Error(`Dependência não registrada: ${key}`);
        }

        if (binding.isSingleton) {
            if (!this.instances.has(key)) {
                this.instances.set(key, binding.factory());
            }
            return this.instances.get(key);
        }

        return binding.factory();
    }

    /**
     * Limpa todas as dependências registradas
     */
    clear(): void {
        this.bindings.clear();
        this.instances.clear();
    }
}

/**
 * Instância global do container
 */
export const container = new Container();

/**
 * Decorador para injeção de dependência em propriedades de classe
 * @param key Chave da dependência a injetar
 */
export function Inject(key: string) {
    return function (target: any, propertyKey: string) {
        // Usar definePropety para criar um getter que resolve a dependência
        Object.defineProperty(target, propertyKey, {
            get() {
                return container.resolve(key);
            },
            enumerable: true,
            configurable: true,
        });
    };
}
