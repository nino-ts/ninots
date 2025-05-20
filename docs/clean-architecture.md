# Princípios de Clean Architecture no Ninots

## Visão Geral

O Ninots é um framework backend modular construído com Bun.js e TypeScript que adota os princípios da Clean Architecture (Arquitetura Limpa) para garantir que o código seja:

-   **Testável**: Facilmente testável em isolamento
-   **Independente de frameworks**: A lógica de negócio não depende de frameworks externos
-   **Independente da UI**: A lógica de negócio não depende da interface com o usuário
-   **Independente de banco de dados**: A lógica de negócio não depende do mecanismo de persistência
-   **Independente de agentes externos**: A lógica de negócio não depende de APIs externas

## Camadas da Arquitetura

O Ninots organiza seu código em camadas concêntricas, seguindo a proposta de Robert C. Martin (Uncle Bob):

### 1. Entities (Entidades)

-   Representam os conceitos de negócio
-   Encapsulam as regras de negócio mais críticas e gerais
-   São as classes mais estáveis e menos propensas a mudanças
-   Localização no Ninots: `src/core/domain/entities/`

### 2. Use Cases (Casos de Uso)

-   Implementam regras de negócio específicas da aplicação
-   Orquestram o fluxo de dados entre entidades e interfaces externas
-   Contêm a lógica de aplicação
-   Localização no Ninots: `src/core/application/services/`

### 3. Interface Adapters (Adaptadores de Interface)

-   Convertem dados do formato mais conveniente para os casos de uso para o formato mais conveniente para algum agente externo (UI, banco de dados)
-   Incluem controladores, presenters e gateways
-   Localização no Ninots:
    -   `src/core/infrastructure/` (adaptadores de saída)
    -   `src/core/interfaces/` (adaptadores de entrada)

### 4. Frameworks & Drivers (Frameworks e Drivers)

-   Contêm todos os detalhes "sujos" como frameworks web, bancos de dados, etc.
-   São a camada mais externa da arquitetura
-   Localização no Ninots:
    -   `src/bootstrap/`
    -   Bibliotecas externas (ninorm, etc.)

## Regra de Dependência

A regra fundamental da Clean Architecture é que as dependências do código-fonte só podem apontar para dentro, em direção às políticas de alto nível (entidades e casos de uso).

No Ninots, garantimos isso através de:

1. **Interfaces**: Definimos interfaces na camada interna que são implementadas na camada externa
2. **Injeção de Dependência**: Usamos nosso sistema de injeção de dependências para fornecer implementações concretas
3. **Adaptadores**: Criamos adaptadores para tecnologias externas para que a lógica de negócio não dependa diretamente delas

## Injeção de Dependências

O sistema de injeção de dependências do Ninots é fundamental para manter a regra de dependência. Ele permite:

-   Registrar implementações concretas para interfaces
-   Resolver dependências em tempo de execução
-   Substituir implementações facilmente (útil para testes)

## Estrutura de Diretórios

```
ninots/
├── src/
│   ├── core/                          # Núcleo da aplicação
│   │   ├── domain/                    # Camada de domínio (regras de negócio)
│   │   │   ├── entities/              # Entidades
│   │   │   ├── repositories/          # Interfaces de repositórios
│   │   │   └── events/                # Eventos de domínio
│   │   │
│   │   ├── application/               # Camada de aplicação (casos de uso)
│   │   │   ├── services/              # Serviços que implementam casos de uso
│   │   │   ├── dtos/                  # Objetos de transferência de dados
│   │   │   └── controllers/           # Controladores da aplicação
│   │   │
│   │   ├── infrastructure/            # Camada de infraestrutura (adaptadores saída)
│   │   │   ├── database/              # Adaptadores para banco de dados
│   │   │   ├── cache/                 # Adaptadores para cache
│   │   │   ├── logging/               # Adaptadores para logging
│   │   │   └── external/              # Integrações externas
│   │   │
│   │   └── interfaces/                # Camada de interfaces (adaptadores entrada)
│   │       ├── http/                  # Adaptadores para HTTP
│   │       ├── graphql/               # Adaptadores para GraphQL
│   │       ├── websockets/            # Adaptadores para WebSockets
│   │       └── cli/                   # Interface de linha de comando
│   │
│   ├── bootstrap/                     # Inicialização da aplicação
│   ├── config/                        # Configurações
│   ├── shared/                        # Código compartilhado
│   └── container/                     # Sistema de injeção de dependências
│
└── tests/                             # Testes
    ├── unit/                          # Testes unitários
    └── integration/                   # Testes de integração
```

## Fluxo de Dados

O Ninots segue um padrão de fluxo de dados consistente com a Clean Architecture:

1. **Entrada de Dados**:

    - A requisição entra pelos adaptadores de interface (HTTP, GraphQL, etc.)
    - Os dados são validados e convertidos para um formato utilizável pelos casos de uso
    - O controlador chama um caso de uso (serviço) apropriado

2. **Processamento**:

    - O caso de uso executa a lógica de negócio
    - Interage com entidades e repositórios conforme necessário
    - Opera em um modelo de domínio puro

3. **Saída de Dados**:
    - O resultado do caso de uso é formatado para retorno
    - Os adaptadores convertem os dados para o formato esperado pela interface de saída
    - A resposta é retornada ao cliente

## Benefícios Práticos

A adoção da Clean Architecture no Ninots traz benefícios tangíveis:

-   **Manutenibilidade**: Separação clara de responsabilidades torna o código mais fácil de manter
-   **Testabilidade**: Componentes podem ser testados em isolamento
-   **Flexibilidade**: Componentes podem ser substituídos sem afetar o restante do sistema
-   **Independência**: A lógica de negócio não depende de detalhes de infraestrutura

## Convenções e Boas Práticas

Para garantir que a arquitetura permaneça "limpa", siga estas práticas:

1. **Nomeação Explícita**:

    - Use sufixos que indicam a função da classe: `UserService`, `UserRepository`, etc.
    - Interfaces de repositório terminam com `Repository`
    - Implementações concretas terminam com `RepositoryImpl`

2. **Direcionalidade das Dependências**:

    - Mantenha as dependências apontando para dentro
    - Use interfaces para abstrair implementações externas

3. **Separação de Preocupações**:

    - Mantenha classes pequenas e focadas
    - Siga o princípio da responsabilidade única

4. **Inversão de Controle**:
    - Use injeção de dependência para inverter o controle
    - Evite a instanciação direta de dependências

## Implementação no Ninots

### Entidades

As entidades no Ninots geralmente estendem a classe base `BaseEntity`:

```typescript
import { BaseEntity } from "ninots";

export class User extends BaseEntity {
    public name: string;
    public email: string;
    public passwordHash: string;

    constructor(props: Partial<User>) {
        super();
        Object.assign(this, props);
    }

    public validatePassword(password: string): boolean {
        // Implementação da validação de senha
        return true;
    }
}
```

### Repositórios

Definimos interfaces de repositório na camada de domínio:

```typescript
import { User } from "../entities/user.entity";

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    save(user: User): Promise<User>;
    findAll(): Promise<User[]>;
}
```

E implementamos na camada de infraestrutura:

```typescript
import { UserRepository } from "../../../domain/repositories/user.repository";
import { User } from "../../../domain/entities/user.entity";
import { BaseRepository } from "ninots";
import { Injectable } from "../../../../container/decorators";

@Injectable()
export class UserRepositoryImpl
    extends BaseRepository<User>
    implements UserRepository
{
    async findByEmail(email: string): Promise<User | null> {
        return this.findOne({ where: { email } });
    }
}
```

### Serviços (Casos de Uso)

Os serviços implementam a lógica de negócio:

```typescript
import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user.entity";
import { Injectable } from "../../../container/decorators";
import { Inject } from "../../../container/decorators";

@Injectable()
export class UserService {
    @Inject("UserRepository")
    private userRepository: UserRepository;

    async createUser(userData: Partial<User>): Promise<User> {
        const user = new User(userData);

        // Validações e lógica de negócio aqui

        return this.userRepository.save(user);
    }
}
```

### Controladores

Os controladores recebem requisições e delegam para os serviços:

```typescript
import { UserService } from "../../application/services/user.service";
import { Injectable } from "../../../container/decorators";
import { Inject } from "../../../container/decorators";
import { HttpRequest, HttpResponse } from "../middlewares/auth.middleware";

@Injectable()
export class UserController {
    @Inject("UserService")
    private userService: UserService;

    async createUser(request: HttpRequest): Promise<HttpResponse> {
        try {
            const user = await this.userService.createUser(request.body);
            return {
                statusCode: 201,
                body: { user },
            };
        } catch (error) {
            return {
                statusCode: 400,
                body: { error: error.message },
            };
        }
    }
}
```

## Conclusão

A Clean Architecture é um conjunto de princípios que, quando seguidos, resultam em sistemas que são mais testáveis, manuteníveis e extensíveis. O Ninots incorpora esses princípios em sua estrutura fundamental, fornecendo uma base sólida para a construção de aplicações backend robustas e flexíveis.
