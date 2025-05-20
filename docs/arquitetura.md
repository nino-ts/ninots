# Arquitetura do Framework Ninots

Este documento descreve a arquitetura e os princípios de design do framework Ninots, um framework backend modular e escalável construído com Bun.js e TypeScript.

## Princípios Arquiteturais

O Ninots é construído com base em princípios sólidos de arquitetura de software:

1. **Clean Architecture**: Separação clara de responsabilidades em camadas.
2. **SOLID**: Princípios de design orientado a objetos para manutenibilidade.
3. **DDD (Domain-Driven Design)**: Foco no domínio do problema e suas regras de negócio.
4. **Ports and Adapters**: Interfaces bem definidas entre camadas.

## Estrutura de Camadas

O framework segue uma estrutura em camadas inspirada na Clean Architecture:

### Camada de Domínio

A camada mais interna contém as entidades de negócio e as regras centrais da aplicação.

-   `src/core/domain/entities`: Modelos de domínio que representam conceitos de negócio.
-   `src/core/domain/repositories`: Interfaces de repositórios para persistência de entidades.
-   `src/core/domain/services`: Serviços de domínio com lógica de negócio específica.

### Camada de Aplicação

Implementa a lógica de aplicação, coordenando os objetos de domínio.

-   `src/core/application/services`: Implementação dos casos de uso da aplicação.
-   `src/core/application/controllers`: Controladores que coordenam a lógica de aplicação.
-   `src/core/application/dto`: Objetos de transferência de dados entre camadas.

### Camada de Interfaces

Contém adaptadores para interação com o mundo externo (HTTP, CLI, etc.).

-   `src/core/interfaces/http`: Endpoints HTTP e suas implementações.
-   `src/core/interfaces/cli`: Interface de linha de comando.
-   `src/core/interfaces/websocket`: Comunicação via WebSocket.
-   `src/core/interfaces/graphql`: Endpoints GraphQL.

### Camada de Infraestrutura

Fornece implementações concretas para as interfaces definidas nas camadas internas.

-   `src/core/infrastructure/database`: Implementações de persistência de dados.
-   `src/core/infrastructure/logging`: Sistema de logging.
-   `src/core/infrastructure/external`: Integrações com serviços externos.

## Componentes Principais

### 1. Container de Injeção de Dependências

O container de IoC facilita a inversão de controle e injeção de dependências:

-   Registro de serviços como singletons ou transientes
-   Resolução automática de dependências
-   Suporte a decorators para injeção (`@Inject`, `@Service`, etc.)

### 2. Sistema de Logging

Sistema de logging flexível que permite:

-   Múltiplos backends de log (console, arquivo, serviços externos)
-   Níveis de log configuráveis
-   Formatação personalizada
-   Rotação de arquivos de log

### 3. Roteamento HTTP

Sistema de roteamento para criar APIs RESTful:

-   Suporte a rotas com parâmetros
-   Middlewares
-   Validação de entrada com Zod
-   Documentação automática com Swagger/OpenAPI

### 4. Sistema de Migrações

Integração com o NinORM para gerenciar esquemas de banco de dados:

-   Migrações automáticas baseadas em modelos
-   Rollback de migrações
-   CLI para gerenciamento de migrações

### 5. CLI

Interface de linha de comando para tarefas comuns:

-   Criação de novos projetos
-   Scaffolding de controladores, entidades, etc.
-   Gerenciamento de migrações
-   Execução de tarefas de manutenção

## Padrões de Design

O framework emprega diversos padrões de design para promover modularidade e manutenibilidade:

### Padrões Comportamentais

-   **Strategy**: Usado no sistema de logging e validação.
-   **Observer**: Implementado no sistema de eventos.
-   **Command**: Utilizado na CLI.
-   **Chain of Responsibility**: Aplicado em middlewares HTTP.

### Padrões Estruturais

-   **Adapter**: Usado para adaptar bibliotecas externas.
-   **Decorator**: Para estender funcionalidades sem modificar código existente.
-   **Proxy**: Implementado para lazy loading de recursos.
-   **Facade**: Usado para simplificar subsistemas complexos.

### Padrões Criacionais

-   **Singleton**: Usado para serviços compartilhados.
-   **Factory**: Para criar objetos complexos.
-   **Builder**: Implementado para construção de consultas.

## Fluxo de Execução

1. O ponto de entrada (`main.ts`) inicializa o bootstrapper.
2. O bootstrapper carrega configurações e inicializa componentes principais.
3. As conexões de banco de dados são estabelecidas e migrações são aplicadas.
4. Dependências são registradas no container.
5. O servidor HTTP é iniciado e começa a receber requisições.
6. As requisições são roteadas para controladores apropriados.
7. Os controladores usam serviços de aplicação para executar a lógica de negócio.
8. Os repositórios são usados para acesso a dados.

## Performance e Escalabilidade

O Ninots é projetado para ter alta performance:

-   Aproveita o runtime Bun para execução rápida
-   Implementa padrões de cache estratégicos
-   Suporta balanceamento de carga
-   Facilita operações assíncronas e paralelas

## Extensibilidade

O framework é facilmente extensível através de:

-   Sistema de plugins
-   Eventos e hooks em pontos-chave
-   Arquitetura modular que permite substituição de componentes
-   APIs bem definidas para extensões
