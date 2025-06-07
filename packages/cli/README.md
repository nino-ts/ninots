# Ninots CLI

Interface de linha de comando para o framework Ninots - um framework backend TypeScript otimizado para Bun.

## Instalação

```bash
# Como dependência de desenvolvimento
bun add -D cli

# Ou instalar globalmente (quando publicado)
bun install -g @ninots/cli
```

## Uso

```bash
# Inicializar novo projeto
ninots init meu-projeto

# Criar componentes
ninots create controller UserController
ninots create service EmailService
ninots create middleware AuthMiddleware

# Desenvolvimento
ninots dev --port 3000

# Build para produção
ninots build --minify

# Executar testes
ninots test

# Servir em produção
ninots serve --port 8080

# Ajuda
ninots help
ninots help build
```

## Comandos Disponíveis

### `ninots init <project-name>`

Inicializa um novo projeto Ninots com estrutura básica.

**Opções:**

-   `--template <template>`: Template a usar (basic, api-rest)
-   `--git`: Inicializar repositório Git
-   `--install`: Instalar dependências automaticamente

### `ninots create <type> <name>`

Gera arquivos de código baseados em templates.

**Tipos disponíveis:**

-   `controller`: Controladores HTTP
-   `service`: Serviços de negócio
-   `middleware`: Middlewares HTTP
-   `model`: Modelos de dados

### `ninots build`

Compila o projeto TypeScript para JavaScript otimizado.

**Opções:**

-   `--minify`: Minificar código (padrão: true)
-   `--sourcemap`: Gerar source maps
-   `--outdir <dir>`: Diretório de saída (padrão: dist)
-   `--watch`: Modo watch para rebuild automático

### `ninots dev`

Inicia servidor de desenvolvimento com hot reload.

**Opções:**

-   `--port <port>`: Porta do servidor (padrão: 3000)
-   `--host <host>`: Host do servidor (padrão: localhost)
-   `--no-reload`: Desabilitar hot reload

### `ninots test`

Executa suíte de testes usando Bun.test.

**Opções:**

-   `--watch`: Modo watch
-   `--coverage`: Gerar relatório de cobertura
-   `--reporter <reporter>`: Formato do relatório

### `ninots serve`

Serve aplicação compilada em modo produção.

**Opções:**

-   `--port <port>`: Porta do servidor
-   `--host <host>`: Host do servidor
-   `--workers <n>`: Número de workers

## Configuração

O CLI pode ser configurado através do arquivo `ninots.config.ts` na raiz do projeto:

```typescript
export default {
    // Configurações do projeto
    srcDir: "src",
    outDir: "dist",

    // Configurações de desenvolvimento
    dev: {
        port: 3000,
        host: "localhost",
        reload: true,
    },

    // Configurações de build
    build: {
        minify: true,
        sourcemap: false,
        target: "bun",
    },
};
```

## Estrutura de Projeto

O CLI gera projetos com a seguinte estrutura:

```
my-project/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── models/
│   └── index.ts
├── tests/
├── dist/
├── package.json
├── tsconfig.json
├── ninots.config.ts
└── README.md
```

## Desenvolvimento

Este CLI é construído usando apenas recursos nativos do Bun:

-   **Argumentos**: `Bun.argv`
-   **Build**: `Bun.build()`
-   **Testes**: `Bun.test`
-   **Arquivos**: `Bun.file()`, `Bun.write()`
-   **Processos**: `Bun.spawn()`

### Scripts Disponíveis

```bash
# Executar CLI usando o alias na raiz (recomendado)
bun run index.ts

# Executar CLI diretamente do código fonte
bun run src/index.ts

# Executar CLI em desenvolvimento com watch mode
bun run dev

# Build do CLI
bun run build

# Testes
bun run test

# Linting
bun run lint
```

### Formas de Execução

O CLI pode ser executado de duas formas:

1. **Via alias na raiz** (compatível com a documentação):
   ```bash
   bun run index.ts [comando] [opções]
   ```

2. **Diretamente do código fonte** (para desenvolvimento):
   ```bash
   bun run src/index.ts [comando] [opções]
   ```

O arquivo `index.ts` na raiz serve como um proxy para `src/index.ts`, mantendo compatibilidade com os exemplos da documentação.

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

MIT
