/**
 * Decoradores para o sistema de injeção de dependências
 */

import "reflect-metadata";
import { LifecycleType } from "./types";

/**
 * Chave para armazenamento de metadados de injeção
 */
export const INJECTABLE_METADATA_KEY = Symbol("INJECTABLE");
export const INJECT_METADATA_KEY = Symbol("INJECT_PARAMS");

/**
 * Decorator para marcar uma classe como injetável
 * @param options Opções para o injetável
 */
export function Injectable(
    options: {
        token?: string | symbol;
        lifecycle?: LifecycleType;
    } = {}
) {
    return function (target: any) {
        const token = options.token || target.name;
        const lifecycle = options.lifecycle || LifecycleType.SINGLETON;

        // Armazenar metadados na classe
        Reflect.defineMetadata(
            INJECTABLE_METADATA_KEY,
            {
                token,
                lifecycle,
            },
            target
        );

        // Garantir que o tipo de parâmetro seja registrado
        const params = Reflect.getMetadata("design:paramtypes", target) || [];

        // Combinar com parâmetros explicitamente injetados
        const injectParams =
            Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];

        // Armazenar a lista completa de dependências
        Reflect.defineMetadata(
            "container:dependencies",
            params.map((param: any, index: number) => {
                // Se houver um token explícito para este índice, use-o
                if (injectParams[index]) {
                    return injectParams[index];
                }

                // Caso contrário, tente obter o token do parâmetro
                if (
                    param &&
                    Reflect.getMetadata(INJECTABLE_METADATA_KEY, param)
                ) {
                    return Reflect.getMetadata(INJECTABLE_METADATA_KEY, param)
                        .token;
                }

                // Quando não conseguir resolver, use null
                return null;
            }),
            target
        );

        return target;
    };
}

/**
 * Decorator para parâmetro para injetar uma dependência específica
 * @param token Token da dependência a ser injetada
 */
export function Inject(token: string | symbol): ParameterDecorator {
    return (
        target: Object,
        propertyKey: string | symbol | undefined,
        parameterIndex: number
    ) => {
        // Para decoradores de parâmetros do construtor
        if (propertyKey === undefined) {
            // Obter a lista atual de injeções ou criar uma nova
            const injectTokens =
                Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];

            // Atualizar a lista de tokens para o parâmetro específico
            injectTokens[parameterIndex] = token;

            // Armazenar a lista atualizada
            Reflect.defineMetadata(INJECT_METADATA_KEY, injectTokens, target);
        }
        // Para decoradores de propriedades
        else {
            // Para propriedades, definimos um getter que resolve do container
            Reflect.defineMetadata(
                INJECT_METADATA_KEY,
                token,
                target,
                propertyKey
            );
        }
    };
}

/**
 * Decorator para propriedades para lazy injeção
 * @param token Token da dependência a ser injetada
 */
export function LazyInject(token: string | symbol): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        // Define um getter para a propriedade que resolve do container
        Reflect.defineMetadata("container:inject", token, target, propertyKey);

        // A implementação real do getter será definida quando a classe for instanciada pelo container
    };
}

/**
 * Decorador para marcar uma classe como um serviço transient
 * @param options Opções para o serviço
 */
export function Transient(options: { token?: string | symbol } = {}) {
    return Injectable({
        token: options.token,
        lifecycle: LifecycleType.TRANSIENT,
    });
}

/**
 * Decorador para marcar uma classe como um serviço singleton
 * @param options Opções para o serviço
 */
export function Singleton(options: { token?: string | symbol } = {}) {
    return Injectable({
        token: options.token,
        lifecycle: LifecycleType.SINGLETON,
    });
}

/**
 * Decorador para marcar uma classe como um serviço scoped
 * @param options Opções para o serviço
 */
export function Scoped(options: { token?: string | symbol } = {}) {
    return Injectable({
        token: options.token,
        lifecycle: LifecycleType.SCOPED,
    });
}
