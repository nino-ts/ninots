/**
 * Ninots CLI - Interface de linha de comando para o framework Ninots
 *
 * Este arquivo é o ponto de entrada principal do CLI. Ele deve:
 * 1. Fazer parsing dos argumentos da linha de comando usando Bun.argv
 * 2. Determinar qual comando foi invocado
 * 3. Carregar e executar o comando apropriado
 * 4. Tratar erros globais e exibir mensagens de ajuda
 *
 * Estrutura de comandos:
 * ninots <command> [options] [arguments]
 *
 * Exemplo de uso:
 * ninots init my-project
 * ninots create controller UserController
 * ninots build --minify
 * ninots dev --port 3000
 *
 * Use apenas recursos nativos do Bun:
 * - Bun.argv para argumentos
 * - import() dinâmico para carregar comandos
 * - console.log/error para output
 * - process.exit() para códigos de saída
 */
