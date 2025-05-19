# Ninots Framework

Framework backend modular e escalável construído com Bun.js e TypeScript, focado em alta performance e manutenibilidade.

## Visão geral

Ninots é um framework back-end moderno desenvolvido em TypeScript para o runtime Bun, aplicando os princípios de Clean Architecture, DDD, SOLID e outros padrões de design para criar aplicações web robustas e maintainable.

```ts
// Exemplo de uso:
import { initDatabase } from "ninots";
import { User } from "./src/core/domain/entities/user.entity";
import { UserRepositoryImpl } from "./src/core/infrastructure/database/orm/repositories/user.repository.impl";

async function bootstrap() {
    // Inicializar banco de dados
    const dbAdapter = await initDatabase();

    // Usar repositório
    const userRepository = new UserRepositoryImpl();

    // Criar e salvar um usuário
    const user = new User();
    user.name = "João";
    user.email = "joao@exemplo.com";
    user.password = "senha123";
    await userRepository.save(user);

    // Buscar todos os usuários
    const users = await userRepository.findAll();
    console.log(users);
}

bootstrap();
```

## Instalação

```bash
bun add ninots
```

## Princípios

O Ninots é construído sobre os seguintes princípios de desenvolvimento:

-   **SOLID**: Princípios para design de software orientado a objetos
-   **Clean Architecture**: Separação clara de responsabilidades em camadas
-   **Domain-Driven Design (DDD)**: Foco no domínio do problema
-   **Test-Driven Development (TDD)**: Design orientado por testes
-   **KISS**: Keep It Simple, Stupid - simplicidade acima de tudo
-   **DRY**: Don't Repeat Yourself - evitar duplicação de código
-   **Imutabilidade**: Objetos que não mudam de estado após criação
-   **Atomic Design**: Composição de componentes do simples ao complexo

## Design Patterns

O framework implementa diversos padrões de design:

-   **Singleton**: Garantir uma única instância (Container, EventBus)
-   **Factory**: Criação de objetos (RepositoryFactory)
-   **Repository**: Abstração do acesso a dados
-   **Decorator**: Adicionar comportamentos (@LogMethod, @Benchmark)
-   **Observer**: Comunicação desacoplada (EventBus)
-   **Command**: Encapsular ações (CommandBus)
-   **Strategy**: Algoritmos intercambiáveis (ValidationStrategy)
-   **Adapter**: Compatibilidade entre interfaces (LoggingAdapter)

## Características

-   **Arquitetura Limpa**: Separação clara entre domínio, aplicação, interfaces e infraestrutura
-   **Integração ORM**: Integração perfeita com Ninorm para mapeamento objeto-relacional
-   **Design Modular**: Componentes independentes e altamente testáveis
-   **Alta Performance**: Construído sobre Bun.js para máximo desempenho
-   **TypeScript First**: Desenvolvido com tipagem estática rigorosa
-   **Assíncrono por padrão**: Todas as operações são naturalmente assíncronas
-   **Validation com Zod**: Validação de dados robusta
-   **CLI integrada**: Ferramentas para scaffolding e automação

## Estrutura do Projeto

```
src/
├── bootstrap/                # Inicialização da aplicação
│   ├── app.ts                # Bootstrapper da aplicação
│   └── database.ts           # Inicialização do banco de dados
├── config/                   # Configurações da aplicação
│   └── database.ts           # Configurações do banco de dados
├── container.ts              # Container de injeção de dependências
├── core/                     # Núcleo do framework
│   ├── application/          # Camada de aplicação (Casos de uso)
│   │   ├── controllers/      # Controladores MVC
│   │   ├── dtos/             # Data Transfer Objects
│   │   └── services/         # Serviços de aplicação
│   ├── domain/               # Camada de domínio (Regras de negócio)
│   │   ├── entities/         # Entidades de domínio
│   │   ├── events/           # Eventos de domínio
│   │   ├── repositories/     # Interfaces de repositórios
│   │   └── value-objects/    # Objetos de valor
│   ├── infrastructure/       # Camada de infraestrutura (Implementação técnica)
│   │   ├── cache/            # Sistema de cache
│   │   ├── database/         # Integração com banco de dados
│   │   │   └── orm/          # Integração com Ninorm
│   │   └── logging/          # Sistema de logging
│   ├── interfaces/           # Camada de interfaces (API)
│   │   ├── cli/              # Interface de linha de comando
│   │   ├── graphql/          # API GraphQL
│   │   └── http/             # API REST
│   │       ├── middlewares/  # Middlewares HTTP
│   │       ├── routes/       # Definição de rotas
│   │       └── server.ts     # Servidor HTTP
│   ├── middlewares/          # Middlewares globais
│   └── validations/          # Sistema de validação Zod
├── shared/                   # Código compartilhado
│   └── decorators/           # Decorators utilitários
│   │   ├── factories/        # Factories de domínio
│   │   ├── repositories/     # Interfaces de repositórios
│   │   ├── services/         # Serviços de domínio
│   │   └── value-objects/    # Value Objects
│   ├── infrastructure/       # Camada de infraestrutura
│   │   ├── cache/            # Implementações de cache
│   │   ├── database/         # Implementações de banco de dados
│   │   ├── logging/          # Sistema de logging
│   │   ├── messaging/        # Sistema de mensageria
│   │   ├── security/         # Segurança e autenticação
│   │   └── validation/       # Validação de dados
│   └── interfaces/           # Camada de interfaces
│       ├── cli/              # Interface de linha de comando
│       ├── graphql/          # Interface GraphQL
│       ├── http/             # Interface HTTP/REST
│       └── websockets/       # Interface WebSockets
├── shared/                   # Código compartilhado entre camadas
│   ├── decorators/           # Decoradores customizados
│   ├── exceptions/           # Exceções customizadas
│   └── utils/                # Utilitários gerais
└── tests/                    # Testes
    ├── e2e/                  # Testes end-to-end
    ├── integration/          # Testes de integração
    └── unit/                 # Testes unitários
```

## Documentação

[Ver documentação completa](./docs)
