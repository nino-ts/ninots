/**
 * Implementação do padrão Decorator para logs
 */

/**
 * Decorador para métodos que registra entrada e saída de execução
 * @param target Classe alvo
 * @param propertyKey Nome do método
 * @param descriptor Descritor de propriedade
 */
export function LogMethod(): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): PropertyDescriptor {
        // Guardar referência para o método original
        const originalMethod = descriptor.value;

        // Substituir o método com uma versão que faz logging
        descriptor.value = async function (...args: any[]) {
            const className = target.constructor.name;
            const methodName = String(propertyKey);

            console.log(
                `[${new Date().toISOString()}] Iniciando ${className}.${methodName}`
            );
            console.log(`[${className}.${methodName}] Argumentos:`, args);

            try {
                // Executar o método original
                const result = await originalMethod.apply(this, args);

                console.log(
                    `[${new Date().toISOString()}] Finalizando ${className}.${methodName}`
                );
                return result;
            } catch (error) {
                // Registrar erro
                console.error(
                    `[${new Date().toISOString()}] Erro em ${className}.${methodName}:`,
                    error
                );
                throw error;
            }
        };

        return descriptor;
    };
}

/**
 * Decorador para medir o tempo de execução de um método
 */
export function Benchmark(): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): PropertyDescriptor {
        // Guardar referência para o método original
        const originalMethod = descriptor.value;

        // Substituir o método com uma versão que faz benchmark
        descriptor.value = async function (...args: any[]) {
            const className = target.constructor.name;
            const methodName = String(propertyKey);

            const startTime = performance.now();

            try {
                // Executar o método original
                const result = await originalMethod.apply(this, args);

                const endTime = performance.now();
                console.log(
                    `[Benchmark] ${className}.${methodName} executado em ${(
                        endTime - startTime
                    ).toFixed(2)}ms`
                );

                return result;
            } catch (error) {
                const endTime = performance.now();
                console.error(
                    `[Benchmark] ${className}.${methodName} falhou após ${(
                        endTime - startTime
                    ).toFixed(2)}ms`
                );
                throw error;
            }
        };

        return descriptor;
    };
}
