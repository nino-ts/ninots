# Visão Geral do Projeto Ninots

Este documento consolida as informações essenciais sobre o Ninots Framework, incluindo sua visão geral, estrutura, princípios de design, documentação e práticas de teste.

## Descrição

Ninots é um framework TypeScript para Bun inspirado no Laravel.

```ts
// Exemplo de uso:
import { Router } from './app/http/Router';
import { Container } from './app/providers/Container';

// Registrar dependências
Container.bind('UserService', UserService);

// Definir rotas
Router.get('/users', 'UserController@index');

// Iniciar servidor
Router.serve(3000);
```

## Instalação

```bash
bunx @ninots/cli init
```

## Documentação

### Estrutura da Documentação

A documentação do Ninots Framework é gerada automaticamente usando o TypeDoc a partir dos comentários no código-fonte. A estrutura atual inclui:

- **README.md**: Visão geral do projeto
- **classes/**: Documentação das classes do framework
- **globals.md**: Documentação de funções e variáveis globais

### Como Documentar o Código

Para garantir uma documentação completa e útil, siga estas diretrizes ao escrever comentários no código:

#### Documentação de Classes

```typescript
/**
 * Descrição da classe
 * @class NomeClasse
 */
export class NomeClasse {
    // ...
}
```

#### Documentação de Métodos

```typescript
/**
 * Descrição do método
 * @method nomeMetodo
 * @param {Tipo} parametro - Descrição do parâmetro
 * @returns {Tipo} Descrição do retorno
 */
public nomeMetodo(parametro: Tipo): Tipo {
    // ...
}
```

#### Documentação de Propriedades

```typescript
/**
 * Descrição da propriedade
 * @property nomePropriedade
 */
private nomePropriedade: Tipo;
```

### Gerando a Documentação

Para gerar a documentação atualizada, execute:

```bash
bun run docs
```

A documentação será gerada na pasta `docs/`.

### Boas Práticas de Documentação

1. **Seja claro e conciso**: Escreva descrições claras e diretas
2. **Documente todos os parâmetros**: Inclua tipos e descrições para todos os parâmetros
3. **Documente valores de retorno**: Especifique o tipo e o significado do valor retornado
4. **Inclua exemplos**: Quando apropriado, forneça exemplos de uso
5. **Mantenha atualizado**: Atualize a documentação quando o código mudar

## Módulo NinORM

### Visão Geral

O NinORM é o módulo de ORM (Object-Relational Mapping) do Ninots Framework, responsável por abstrair a camada de persistência e fornecer uma API fluente para operações de banco de dados. O módulo deve ser independente de tecnologias específicas de banco de dados, permitindo a implementação de diferentes adaptadores.

### Estrutura do Módulo

```
ninorm/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── Column.ts
│   │   │   ├── Entity.ts
│   │   │   ├── PrimaryKey.ts
│   │   │   └── Relationship.ts
│   │   ├── value-objects/
│   │   │   ├── ColumnType.ts
│   │   │   ├── RelationshipType.ts
│   │   │   └── QueryOptions.ts
│   │   └── interfaces/
│   │       ├── repositories/
│   │       │   └── IRepository.ts
│   │       └── services/
│   │           ├── IQueryBuilder.ts
│   │           └── ITransactionManager.ts
│   ├── application/
│   │   ├── use-cases/
│   │   │   ├── CreateEntityUseCase.ts
│   │   │   ├── UpdateEntityUseCase.ts
│   │   │   ├── DeleteEntityUseCase.ts
│   │   │   ├── FindEntityUseCase.ts
│   │   │   └── QueryEntitiesUseCase.ts
│   │   └── services/
│   │       ├── EntityManager.ts
│   │       └── SchemaManager.ts
│   ├── infrastructure/
│   │   ├── adapters/
│   │   │   ├── sqlite/
│   │   │   │   ├── SQLiteRepository.ts
│   │   │   │   ├── SQLiteQueryBuilder.ts
│   │   │   │   └── SQLiteTransactionManager.ts
│   │   │   ├── mysql/
│   │   │   │   ├── MySQLRepository.ts
│   │   │   │   ├── MySQLQueryBuilder.ts
│   │   │   │   └── MySQLTransactionManager.ts
│   │   │   └── postgres/
│   │   │       ├── PostgresRepository.ts
│   │   │       ├── PostgresQueryBuilder.ts
│   │   │       └── PostgresTransactionManager.ts
│   │   └── decorators/
│   │       ├── entity.decorator.ts
│   │       ├── column.decorator.ts
│   │       ├── primary.decorator.ts
│   │       └── relationship.decorator.ts
│   └── interfaces/
│       ├── repositories/
│       │   └── BaseRepository.ts
│       └── query-builder/
│           └── QueryBuilder.ts
└── tests/
    ├── unit/
    │   ├── domain/
    │   ├── application/
    │   └── infrastructure/
    ├── integration/
    └── e2e/
```

### Princípios de Design (SOLID, DDD, Clean Architecture)

O NinORM é implementado seguindo os princípios SOLID, DDD e Clean Architecture para garantir um código robusto, flexível e fácil de manter. As dependências apontam para dentro (camadas internas), e as responsabilidades são bem definidas.

### Imutabilidade e Atomicidade

Value Objects são projetados para serem imutáveis. Operações que envolvem múltiplas escritas no banco de dados são gerenciadas por um `TransactionManager` para garantir a atomicidade.

### TDD (Test-Driven Development)

O desenvolvimento do NinORM segue a abordagem TDD, com testes unitários e de integração para garantir a qualidade e a corretude do código.

### API Fluente

O NinORM fornece uma API fluente e decoradores para facilitar a definição de entidades e a execução de consultas.

```typescript
// Exemplo de uso da API fluente
import { NinORM } from '@ninots/ninorm';

// Definição de entidade usando decoradores
@Entity('users')
class User {
  @PrimaryKey()
  id: number;
  
  @Column({ type: 'string' })
  name: string;
  
  @Column({ type: 'string', unique: true })
  email: string;
}

// Uso da API fluente
async function example() {
  const orm = new NinORM({ type: 'sqlite', database: ':memory:' });
  await orm.initialize();
  const userRepository = orm.getRepository(User);
  
  const users = await userRepository
    .createQueryBuilder()
    .where({ email: 'john@example.com' })
    .limit(10)
    .execute();
}
```

## Boas Práticas de Testes com Bun.js

### Visão Geral

Bun.js possui um test runner integrado. A abordagem TDD é recomendada.

### Tipos de Testes

- **Unitários**: Testam unidades isoladas.
- **Integração**: Testam a interação entre componentes.
- **End-to-End (E2E)**: Testam o sistema como um todo.

### Configuração e Execução

- Estrutura de diretórios: `tests/unit`, `tests/integration`, `tests/e2e`.
- Execução: `bun test`, `bun test --watch`, `bun test --coverage`.

### TDD (Test-Driven Development)

- Ciclo: Red -> Green -> Refactor.

### Mocks e Stubs

- Usados para isolar dependências em testes unitários.

### Testes de Integração com Banco de Dados

- Recomenda-se usar SQLite em memória para testes de integração de banco de dados.

### Testes de API

- Testar endpoints HTTP simulando requisições.

### Boas Práticas Gerais

1. Mantenha os testes simples e focados.
2. Organize os testes por tipo.
3. Use Fixtures e Factories para dados de teste.
4. Isole os testes (independentes, limpar ambiente).
5. Teste comportamentos, não implementações.
6. Mantenha alta cobertura de testes (>= 80%).
7. Automatize a execução de testes (CI/CD, hooks).

---
*Este documento foi gerado automaticamente com base nas informações disponíveis no projeto e nos memory banks.*
