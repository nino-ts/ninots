# Guia de Contribuição - Ninots CLI

## Como Contribuir

### Configuração do Ambiente

1. Clone o repositório
2. Instale o Bun se não tiver: `curl -fsSL https://bun.sh/install | bash`
3. Instale dependências: `bun install`
4. Execute os testes: `bun test`

### Estrutura de Desenvolvimento

#### Adicionando Novos Comandos

1. Crie arquivo em `src/commands/`
2. Implemente interface `Command`
3. Adicione ao `src/commands/index.ts`
4. Crie testes em `tests/unit/commands/`

#### Padrões de Código

-   Use TypeScript strict mode
-   Siga convenções ESLint
-   Documente funções públicas
-   Mantenha cobertura de testes > 80%

#### Commits

Use conventional commits:

-   `feat:` para novas funcionalidades
-   `fix:` para correções
-   `docs:` para documentação
-   `test:` para testes
-   `refactor:` para refatorações

### Testando

```bash
# Testes unitários
bun test

# Testes com watch
bun test --watch

# Coverage
bun test --coverage
```

### Pull Requests

1. Crie branch feature
2. Implemente mudanças
3. Adicione testes
4. Atualize documentação
5. Abra PR com descrição detalhada
