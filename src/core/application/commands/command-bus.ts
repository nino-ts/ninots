/**
 * Implementação do padrão Command para operações de aplicação
 */

/**
 * Interface base para comandos
 */
export interface Command<T = void> {
    /**
     * Executa o comando
     * @returns Resultado da execução
     */
    execute(): Promise<T>;
}

/**
 * Abstração para comandos que podem ser desfeitos
 */
export interface UndoableCommand<T = void> extends Command<T> {
    /**
     * Desfaz a execução do comando
     */
    undo(): Promise<void>;
}

/**
 * Executor de comandos
 */
export class CommandBus {
    private static instance: CommandBus;
    private history: UndoableCommand[] = [];

    /**
     * Construtor privado para padrão Singleton
     */
    private constructor() {}

    /**
     * Obtém a instância única do CommandBus
     */
    public static getInstance(): CommandBus {
        if (!CommandBus.instance) {
            CommandBus.instance = new CommandBus();
        }
        return CommandBus.instance;
    }

    /**
     * Executa um comando
     * @param command Comando a ser executado
     * @returns Resultado da execução
     */
    public async execute<T>(command: Command<T>): Promise<T> {
        // Executa o comando
        const result = await command.execute();

        // Se o comando for desfazível, adiciona ao histórico
        if (this.isUndoable(command)) {
            this.history.push(command);
        }

        return result;
    }

    /**
     * Desfaz o último comando
     * @returns Se houve um comando para desfazer
     */
    public async undoLast(): Promise<boolean> {
        if (this.history.length === 0) {
            return false;
        }

        const command = this.history.pop()!;
        await command.undo();

        return true;
    }

    /**
     * Verifica se um comando é desfazível
     * @param command Comando a ser verificado
     * @returns Se o comando implementa UndoableCommand
     */
    private isUndoable<T>(command: Command<T>): command is UndoableCommand<T> {
        return "undo" in command;
    }

    /**
     * Limpa o histórico de comandos
     */
    public clearHistory(): void {
        this.history = [];
    }
}

// Instância global do CommandBus
export const commandBus = CommandBus.getInstance();
