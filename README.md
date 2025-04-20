# Ninots Framework

**Ninots** é um framework backend moderno, opinativo e de alta performance, construído exclusivamente para o runtime [Bun](https://bun.sh/) e escrito inteiramente em TypeScript.

## Filosofia e Inspirações

Ninots foi criado com o objetivo de ser a base de um ecossistema robusto e produtivo para desenvolvimento backend no ambiente Bun + TypeScript, semelhante ao que o Laravel representa para o PHP. Ele se inspira em conceitos e práticas de frameworks renomados como [Laravel](https://laravel.com/), [Nest.js](https://nestjs.com/) e [Next.js](https://nextjs.org/), adaptando-os para aproveitar ao máximo as capacidades nativas do Bun.

O desenvolvimento do Ninots é guiado pelos seguintes princípios fundamentais:

*   **SOLID:** Princípios de design orientado a objetos para criar software compreensível, flexível e manutenível.
*   **DRY (Don't Repeat Yourself):** Evitar a duplicação de código para reduzir redundância e melhorar a manutenibilidade.
*   **TDD (Test-Driven Development):** Desenvolvimento guiado por testes para garantir a qualidade e a corretude do código.
*   **DDD (Domain-Driven Design):** Foco no domínio do negócio para modelar o software de forma eficaz.
*   **Clean Architecture:** Separação de responsabilidades em camadas para criar sistemas desacoplados e testáveis.
*   **Clean Code:** Escrita de código legível, simples e expressivo.
*   **Imutabilidade:** Preferência por estruturas de dados imutáveis para evitar efeitos colaterais e facilitar o raciocínio sobre o estado.
*   **Atomicidade:** Garantia de que operações críticas sejam executadas completamente ou não sejam executadas, mantendo a consistência.

## Design Patterns

Ninots adota e incentiva o uso de Design Patterns bem estabelecidos, conforme catalogado pelo [Refactoring Guru](https://refactoring.guru/design-patterns/catalog). Isso promove a padronização do código, facilita o aprendizado para novos desenvolvedores e melhora a manutenibilidade geral do projeto.

## Características Principais

*   **Exclusivo para Bun e TypeScript:** Otimizado para performance e aproveitando as APIs nativas do Bun. Sem suporte ou preocupação com compatibilidade com Node.js.
*   **Decorators:** Uso extensivo de decorators (semelhante ao Nest.js) para funcionalidades como definição de rotas, injeção de dependência, validação de dados e muito mais, tornando o código declarativo e expressivo.
*   **Validação com Zod:** Utilização essencial da biblioteca [Zod](https://zod.dev/) para declaração e validação robusta de schemas de dados, garantindo a integridade dos dados em toda a aplicação (ex: validação de entrada de rotas, DTOs).
*   **Roteamento Baseado em Arquivos:** Sistema de roteamento intuitivo inspirado no Next.js App Router. Arquivos e pastas dentro de `src/app/` definem automaticamente as rotas da API.
*   **Geração Automática de OpenAPI:** Geração automática da especificação [OpenAPI Specification 3.1.1](https://spec.openapis.org/oas/latest.html) (`openapi.json`/`openapi.yaml`) diretamente a partir das docstrings e decorators no código das rotas. Isso garante que a documentação da API esteja sempre sincronizada com a implementação e seja compatível com ferramentas como Swagger UI e Redoc. (Detalhes sobre como acessar a especificação serão adicionados aqui).
*   **ORM Integrado (Ninorm):** Utiliza o [Ninorm](https://github.com/vgeruso/ninorm/tree/develop) (branch `develop`) como ORM padrão, oferecendo uma interface fluente e poderosa para interação com o banco de dados.

## Visão Geral da Arquitetura

A arquitetura do Ninots segue os princípios da Clean Architecture e do DDD, promovendo uma clara separação de responsabilidades entre camadas (ex: Domínio, Aplicação, Infraestrutura). Os decorators desempenham um papel central na conexão dessas camadas e na configuração de funcionalidades. (Mais detalhes serão adicionados conforme o framework evolui).

## Guia de Início Rápido (Getting Started)

**Pré-requisitos:**

*   [Bun](https://bun.sh/docs/installation) instalado.

**Instalação:**

1.  Clone o repositório (ou use um template, se disponível):
    ```bash
    # Exemplo: git clone ...
    cd ninots-project
    ```
2.  Instale as dependências:
    ```bash
    bun install
    ```

**Configuração:**

1.  Copie o arquivo de ambiente de exemplo:
    ```bash
    cp .env.example .env
    ```
2.  Configure as variáveis de ambiente no arquivo `.env` (ex: conexão com banco de dados).

**Execução:**

1.  Inicie o servidor de desenvolvimento:
    ```bash
    bun run dev # (Ou o script apropriado definido no package.json)
    ```
    *Alternativamente, para execução simples:*
    ```bash
    bun run index.ts
    ```

## Documentação Completa

Esta página serve como introdução. A documentação completa, incluindo a referência detalhada da API gerada automaticamente, está disponível em:

*   **(Link para a documentação gerada pelo Typedoc será adicionado aqui após a configuração)**

---

*Este projeto foi iniciado usando `bun init`.*
