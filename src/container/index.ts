/**
 * Container de Injeção de Dependências - Implementação de Singleton
 *
 * Este módulo fornece um container de inversão de controle (IoC) usando o padrão Singleton
 * para garantir apenas uma instância em toda a aplicação.
 */

type Constructor<T = any> = new (...args: any[]) => T;
type Factory<T = any> = (...args: any[]) => T;

/**
 * Container de Injeção de Dependências
 * Implementação do padrão Singleton
 */
class Container {
    private static instance: Container;
    private bindings: Map<string, any> = new Map();
    private singletons: Map<string, any> = new Map();

    /**
     * Construtor privado para garantir o padrão Singleton
     */
    private constructor() {}

    /**
     * Obtém a única instância do Container
     * @returns Instância do Container
     */
    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }

    /**
     * Registra um binding simples no container
     * @param token Identificador do binding
     * @param resolver Construtor ou factory da dependência
     */
    public bind<T>(token: string, resolver: Constructor<T> | Factory<T>): void {
        this.bindings.set(token, resolver);
    }

    /**
     * Registra um singleton no container
     * @param token Identificador do singleton
     * @param resolver Construtor ou factory da dependência
     */
    public singleton<T>(
        token: string,
        resolver: Constructor<T> | Factory<T>
    ): void {
        this.bindings.set(token, resolver);
        // Marcar como singleton para lazy loading
        this.singletons.set(token, null);
    }

    /**
     * Resolve uma dependência do container
     * @param token Identificador do binding
     * @param args Argumentos para o construtor/factory
     * @returns Instância resolvida
     */
    public resolve<T>(token: string, ...args: any[]): T {
        // Verificar se existe o binding
        const resolver = this.bindings.get(token);
        if (!resolver) {
            throw new Error(`Binding não encontrado para o token: ${token}`);
        }

        // Verificar se é um singleton
        if (this.singletons.has(token)) {
            // Se já tiver sido instanciado, retorna a instância existente
            let instance = this.singletons.get(token);
            if (instance === null) {
                // Instanciar o singleton pela primeira vez
                instance =
                    typeof resolver === "function"
                        ? resolver.prototype
                            ? new resolver(...args)
                            : resolver(...args)
                        : resolver;
                this.singletons.set(token, instance);
            }
            return instance as T;
        }

        // Para bindings normais, cria uma nova instância sempre
        return typeof resolver === "function"
            ? resolver.prototype
                ? new resolver(...args)
                : resolver(...args)
            : resolver;
    }

    /**
     * Verifica se um binding existe
     * @param token Identificador do binding
     * @returns Se o binding existe
     */
    public has(token: string): boolean {
        return this.bindings.has(token);
    }

    /**
     * Remove um binding do container
     * @param token Identificador do binding
     */
    public unbind(token: string): void {
        this.bindings.delete(token);
        this.singletons.delete(token);
    }

    /**
     * Limpa todos os bindings do container
     */
    public clear(): void {
        this.bindings.clear();
        this.singletons.clear();
    }
}

// Exportar a instância única do Container
export const container = Container.getInstance();

// Exportar um decorator para injeção de dependência
export function Inject(token: string): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        // Getter para lazy loading da dependência
        Object.defineProperty(target, propertyKey, {
            get: () => container.resolve(token),
            enumerable: true,
            configurable: true,
        });
    };
}
