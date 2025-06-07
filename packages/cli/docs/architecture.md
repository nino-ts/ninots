# Arquitetura do Ninots CLI

## Visão Geral

O CLI do Ninots é construído com uma arquitetura modular que facilita manutenção e extensibilidade.

## Componentes Principais

### Core (`src/core/`)

-   **args-parser**: Parsing e validação de argumentos de linha de comando
-   **command-manager**: Gerenciamento e execução de comandos
-   **config-manager**: Gerenciamento de configurações do projeto
-   **logger**: Sistema de logging estruturado

### Commands (`src/commands/`)

Implementação dos comandos disponíveis no CLI:

-   `init` - Criação de novos projetos
-   `create` - Geração de componentes
-   `build` - Build de produção
-   `dev` - Servidor de desenvolvimento
-   `serve` - Servidor de produção
-   `test` - Execução de testes
-   `help` - Sistema de ajuda

### Templates (`src/templates/`)

Sistema de templates para geração de código:

-   `project/` - Templates de projeto completo
-   `components/` - Templates de componentes individuais
-   `config/` - Templates de configuração
-   `middleware/` - Templates de middleware

### Utils (`src/utils/`)

Utilitários compartilhados:

-   `file-utils` - Manipulação de arquivos
-   `template-utils` - Processamento de templates
-   `validation` - Validações comuns
-   `bun-utils` - Integração com Bun

## Fluxo de Execução

1. **Parsing**: Args são processados pelo `args-parser`
2. **Routing**: `command-manager` identifica o comando
3. **Validation**: Argumentos são validados
4. **Execution**: Comando é executado
5. **Output**: Resultado é exibido via `logger`

## Princípios de Design

-   **Modularidade**: Cada componente tem responsabilidade específica
-   **Testabilidade**: Arquitetura facilita testes unitários
-   **Extensibilidade**: Novos comandos podem ser facilmente adicionados
-   **Performance**: Uso eficiente dos recursos do Bun
