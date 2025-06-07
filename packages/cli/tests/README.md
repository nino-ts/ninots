# Testes do Ninots CLI

Este diretório contém todos os testes para o CLI do framework Ninots.

## Estrutura

-   `unit/` - Testes unitários para componentes individuais
-   `integration/` - Testes de integração entre componentes
-   `e2e/` - Testes end-to-end simulando uso real do CLI
-   `fixtures/` - Dados de teste e arquivos auxiliares
-   `helpers/` - Utilitários e helpers para os testes

## Como Executar

```bash
# Executar todos os testes
bun test

# Executar em modo watch
bun test --watch

# Executar com coverage
bun test --coverage
```

## Convenções

-   Arquivos de teste devem terminar com `.test.ts`
-   Use describe/it para estruturar os testes
-   Mocks devem ficar em `__mocks__/`
-   Fixtures devem ser organizadas por funcionalidade
