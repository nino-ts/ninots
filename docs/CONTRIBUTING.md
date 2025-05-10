# Contribuindo com a Documentação do Ninots Framework

Este documento fornece orientações sobre como contribuir com a documentação do Ninots Framework.

## Estrutura da Documentação

A documentação do Ninots Framework é gerada automaticamente usando o TypeDoc a partir dos comentários no código-fonte. A estrutura atual inclui:

- **README.md**: Visão geral do projeto
- **classes/**: Documentação das classes do framework
- **globals.md**: Documentação de funções e variáveis globais

## Como Documentar o Código

Para garantir uma documentação completa e útil, siga estas diretrizes ao escrever comentários no código:

### Documentação de Classes

```typescript
/**
 * Descrição da classe
 * @class NomeClasse
 */
export class NomeClasse {
    // ...
}
```

### Documentação de Métodos

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

### Documentação de Propriedades

```typescript
/**
 * Descrição da propriedade
 * @property nomePropriedade
 */
private nomePropriedade: Tipo;
```

## Gerando a Documentação

Para gerar a documentação atualizada, execute:

```bash
bun run docs
```

A documentação será gerada na pasta `docs/` e pode ser visualizada abrindo os arquivos markdown.

## Boas Práticas

1. **Seja claro e conciso**: Escreva descrições claras e diretas
2. **Documente todos os parâmetros**: Inclua tipos e descrições para todos os parâmetros
3. **Documente valores de retorno**: Especifique o tipo e o significado do valor retornado
4. **Inclua exemplos**: Quando apropriado, forneça exemplos de uso
5. **Mantenha atualizado**: Atualize a documentação quando o código mudar

## Configuração do TypeDoc

A configuração do TypeDoc está no arquivo `typedoc.json` na raiz do projeto. Se precisar ajustar as configurações de geração da documentação, edite este arquivo.