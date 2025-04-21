export function Controller(prefix?: string): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata('prefix', prefix || '', target);

        // Se a classe não tiver sido registrada como um controlador ainda
        if (!Reflect.hasMetadata('routes', target)) {
            Reflect.defineMetadata('routes', [], target);
        }
    };
}

export function Get(path?: string): MethodDecorator {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        registerRoute('GET', path || '', target, propertyKey);
    };
}

export function Post(path?: string): MethodDecorator {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        registerRoute('POST', path || '', target, propertyKey);
    };
}

function registerRoute(method: string, path: string, target: any, propertyKey: string | symbol) {
    const controllerClass = target.constructor;

    // Se a classe não tiver rotas registradas ainda
    if (!Reflect.hasMetadata('routes', controllerClass)) {
        Reflect.defineMetadata('routes', [], controllerClass);
    }

    // Obtém as rotas existentes
    const routes = Reflect.getMetadata('routes', controllerClass);

    // Adiciona a nova rota
    routes.push({
        method,
        path,
        handlerName: propertyKey,
    });

    // Atualiza as rotas no metadata
    Reflect.defineMetadata('routes', routes, controllerClass);
} 