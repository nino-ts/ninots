# Decoradores no Ninots

O framework Ninots implementa um sistema de decoradores para facilitar a definição de controladores, rotas e injeção de dependências. Este guia explica como usar os decoradores disponíveis para construir suas aplicações.

## Decoradores de Controlador

### @Controller(prefix?: string)

Define uma classe como um controlador HTTP, especificando opcionalmente um prefixo para todas as rotas definidas nesta classe.

```typescript
@Controller("/users")
export class UserController {
    // Métodos do controlador
}
```

## Decoradores de Rotas

### @Get(path?: string)

Define um método como uma rota HTTP GET.

```typescript
@Get('/:id')
async getUser(request: HttpRequest): Promise<HttpResponse> {
  const userId = request.params.id;
  // Implementação
}
```

### @Post(path?: string)

Define um método como uma rota HTTP POST.

```typescript
@Post('/')
async createUser(request: HttpRequest): Promise<HttpResponse> {
  const userData = request.body;
  // Implementação
}
```

### @Put(path?: string)

Define um método como uma rota HTTP PUT.

```typescript
@Put('/:id')
async updateUser(request: HttpRequest): Promise<HttpResponse> {
  const userId = request.params.id;
  const userData = request.body;
  // Implementação
}
```

### @Patch(path?: string)

Define um método como uma rota HTTP PATCH.

```typescript
@Patch('/:id')
async partialUpdateUser(request: HttpRequest): Promise<HttpResponse> {
  const userId = request.params.id;
  const updates = request.body;
  // Implementação
}
```

### @Delete(path?: string)

Define um método como uma rota HTTP DELETE.

```typescript
@Delete('/:id')
async deleteUser(request: HttpRequest): Promise<HttpResponse> {
  const userId = request.params.id;
  // Implementação
}
```

## Decoradores de Middleware

### @UseMiddlewares(...middlewares: MiddlewareFunc[])

Aplica um ou mais middlewares a uma rota específica.

```typescript
@Get('/protected')
@UseMiddlewares(authMiddleware)
async getProtectedResource(request: HttpRequest): Promise<HttpResponse> {
  // Implementação
}
```

## Decoradores de Injeção de Dependência

### @Injectable()

Marca uma classe como injetável, permitindo que ela seja gerenciada pelo container de DI.

```typescript
@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {}
}
```

### @Inject(token: string | symbol)

Injeta uma dependência em um parâmetro de construtor por token.

```typescript
export class UserController {
    constructor(@Inject("UserService") private userService: UserService) {}
}
```

### @LazyInject(token: string | symbol)

Injeta uma dependência de forma preguiçosa (lazy), resolvendo-a apenas quando acessada.

```typescript
export class UserController {
    @LazyInject("UserService")
    private userService!: UserService;
}
```

## Exemplo Completo

```typescript
import { Controller, Get, Post, UseMiddlewares } from "ninots/decorators";
import { Injectable } from "ninots/container";
import { HttpRequest, HttpResponse } from "ninots/http";
import { authMiddleware } from "./middlewares";

@Injectable()
class UserService {
    findById(id: string) {
        // Implementação
    }

    createUser(userData: any) {
        // Implementação
    }
}

@Controller("/users")
export class UserController {
    constructor(private userService: UserService) {}

    @Get("/:id")
    async getUser(request: HttpRequest): Promise<HttpResponse> {
        const userId = request.params.id;
        const user = await this.userService.findById(userId);

        if (!user) {
            return {
                status: 404,
                body: { error: "User not found" },
            };
        }

        return {
            status: 200,
            body: user,
        };
    }

    @Post("/")
    @UseMiddlewares(authMiddleware)
    async createUser(request: HttpRequest): Promise<HttpResponse> {
        const userData = request.body;
        const newUser = await this.userService.createUser(userData);

        return {
            status: 201,
            body: newUser,
        };
    }
}
```
