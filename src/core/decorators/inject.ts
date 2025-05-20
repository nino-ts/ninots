/**
 * Decoradores para injeção de dependências
 */

import { container } from "../../container";

/**
 * Decorator para injeção de propriedade
 * @param token Token a ser resolvido do container
 */
export function Inject(token: string): PropertyDecorator {
    return (target: Object, propertyKey: string | symbol) => {
        // Guarda o tipo original da propriedade
        const propertyType = Reflect.getMetadata(
            "design:type",
            target,
            propertyKey
        );

        // Define um getter que resolve a dependência sob demanda
        Object.defineProperty(target, propertyKey, {
            get: function () {
                // Resolve a dependência do container
                return container.resolve(token);
            },
            enumerable: true,
            configurable: true,
        });

        // Registra metadados sobre a injeção
        Reflect.defineMetadata(
            "ninots:inject",
            { token, propertyType },
            target,
            propertyKey
        );
    };
}

/**
 * Decorator para injeção automática em construtores
 */
export function Injectable(): ClassDecorator {
    return (target: any) => {
        // Obtém o construtor original
        const original = target;

        // Cria uma função que substitui o construtor original
        const newConstructor: any = function (...args: any[]) {
            // Cria a instância usando o construtor original
            const instance = new original(...args);

            // Obtém todas as propriedades que têm injeções
            const injectProps = getInjectableProperties(target.prototype);

            // Injeta as dependências
            injectProps.forEach((prop) => {
                const metadata = Reflect.getMetadata(
                    "ninots:inject",
                    target.prototype,
                    prop
                );

                if (metadata && metadata.token) {
                    Object.defineProperty(instance, prop, {
                        get: function () {
                            return container.resolve(metadata.token);
                        },
                        enumerable: true,
                        configurable: true,
                    });
                }
            });

            return instance;
        };

        // Copia propriedades estáticas
        Object.setPrototypeOf(newConstructor, original);

        // Copia o prototype
        newConstructor.prototype = original.prototype;

        // Adiciona metadados
        Reflect.defineMetadata("ninots:injectable", true, newConstructor);

        return newConstructor;
    };
}

/**
 * Decorator para registrar automaticamente uma classe no container
 * @param token Token opcional para registro no container
 */
export function Service(token?: string): ClassDecorator {
    return (target: any) => {
        // Marca a classe como injetável
        Injectable()(target);

        // Determina o token
        const serviceToken = token || target.name;

        // Registra no container
        container.singleton(serviceToken, target);

        return target;
    };
}

/**
 * Helper para obter todas as propriedades injetáveis de uma classe
 */
function getInjectableProperties(prototype: any): string[] {
    const props: string[] = [];

    // Percorre o prototype e seus ancestrais
    let currentProto = prototype;

    while (currentProto && currentProto !== Object.prototype) {
        // Obtém propriedades do objeto atual
        Object.getOwnPropertyNames(currentProto).forEach((prop) => {
            // Verifica se existe metadata de injeção
            const hasInjectMetadata = Reflect.hasMetadata(
                "ninots:inject",
                currentProto,
                prop
            );

            if (hasInjectMetadata && !props.includes(prop)) {
                props.push(prop);
            }
        });

        // Sobe na cadeia de protótipos
        currentProto = Object.getPrototypeOf(currentProto);
    }

    return props;
}
