/**
 * Gerenciador de comandos
 *
 * Este arquivo deve:
 * 1. Registrar todos os comandos disponíveis
 * 2. Carregar comandos dinamicamente quando solicitados
 * 3. Executar comandos com argumentos parseados
 * 4. Tratar erros de comandos inexistentes
 *
 * Funcionalidades:
 * - registerCommand(command: Command): void
 * - executeCommand(name: string, args: string[], options: object): Promise<void>
 * - listCommands(): Command[]
 * - findCommand(name: string): Command | undefined
 *
 * Deve usar import() dinâmico para carregar comandos sob demanda
 */
