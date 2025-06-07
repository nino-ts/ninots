/**
 * Parser de argumentos da linha de comando
 *
 * Este arquivo deve:
 * 1. Processar Bun.argv para extrair comando, argumentos e opções
 * 2. Validar os argumentos recebidos
 * 3. Converter flags em objeto de opções tipado
 * 4. Tratar argumentos especiais como --help, --version
 *
 * Funções que deve implementar:
 * - parseArgs(argv: string[]): ParsedArgs
 * - validateCommand(command: string): boolean
 * - parseOptions(args: string[]): Record<string, any>
 * - showHelp(command?: string): void
 *
 * Use apenas recursos nativos do Bun, sem bibliotecas externas
 */
