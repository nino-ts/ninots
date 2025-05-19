/**
 * Utilitários para testes
 */

import { container } from "../../container";

/**
 * Classe para facilitar a configuração de testes
 */
export class TestSetup {
    /**
     * Reseta o container de dependências
     */
    static resetContainer(): void {
        if ("clear" in container) {
            (container as any).clear();
        }
    }

    /**
     * Registra um mock para uma dependência no container
     * @param key Chave da dependência
     * @param mock Mock da implementação
     */
    static mockDependency(key: string, mock: any): void {
        container.bind(key, () => mock);
    }

    /**
     * Cria um mock para uma classe
     * @param original Classe original
     * @param overrides Propriedades e métodos a serem sobrescritos
     * @returns Uma instância mockada
     */
    static mockClass<T>(
        original: new (...args: any[]) => T,
        overrides: Partial<T> = {}
    ): T {
        // Cria um objeto base com todas as propriedades da classe original
        const base = {} as T;

        // Adiciona métodos mockados para todos os métodos da classe
        const prototype = original.prototype;
        Object.getOwnPropertyNames(prototype).forEach((name) => {
            if (name !== "constructor") {
                const descriptor = Object.getOwnPropertyDescriptor(
                    prototype,
                    name
                );
                if (descriptor && typeof descriptor.value === "function") {
                    (base as any)[name] = jest.fn();
                }
            }
        });

        // Aplica os overrides fornecidos
        return { ...base, ...overrides };
    }

    /**
     * Limpa todos os mocks
     */
    static clearAllMocks(): void {
        jest.clearAllMocks();
    }
}

/**
 * Decorator para marcar um método de teste
 */
export function Test() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        // Guarda a implementação original
        const originalMethod = descriptor.value;

        // Modifica a implementação para fazer setup e teardown automáticos
        descriptor.value = async function (...args: any[]) {
            // Setup
            TestSetup.resetContainer();

            try {
                // Executa o teste
                const result = await originalMethod.apply(this, args);
                return result;
            } finally {
                // Teardown (sempre executado)
                TestSetup.clearAllMocks();
            }
        };

        return descriptor;
    };
}

/**
 * Cria um mock de repositório
 * @param methods Métodos a serem mockados
 * @returns Um repositório mockado
 */
export function createRepositoryMock(methods: Record<string, jest.Mock> = {}) {
    return {
        findById: jest.fn(),
        findAll: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
        ...methods,
    };
}

/**
 * Cria um mock de serviço
 * @param methods Métodos a serem mockados
 * @returns Um serviço mockado
 */
export function createServiceMock(methods: Record<string, jest.Mock> = {}) {
    return {
        ...methods,
    };
}

/**
 * Cria um mock de resposta HTTP
 * @returns HttpResponse mockada
 */
export function createHttpResponseMock() {
    return {
        status: 200,
        body: {},
        headers: {},
    };
}

/**
 * Cria um mock de requisição HTTP
 * @param overrides Propriedades a serem sobrescritas
 * @returns HttpRequest mockada
 */
export function createHttpRequestMock(
    overrides: Partial<{
        params: Record<string, string>;
        query: Record<string, string>;
        body: any;
        headers: Record<string, string>;
        user: any;
    }> = {}
) {
    return {
        params: {},
        query: {},
        body: {},
        headers: {},
        ...overrides,
    };
}
