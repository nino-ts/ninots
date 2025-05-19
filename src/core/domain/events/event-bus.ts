/**
 * Implementação do padrão Observer para eventos de domínio
 */

/**
 * Interface para observadores de eventos
 */
export interface Observer<T = any> {
    /**
     * Método chamado quando um evento é publicado
     * @param eventName Nome do evento
     * @param data Dados do evento
     */
    update(eventName: string, data: T): void | Promise<void>;
}

/**
 * Classe que publica eventos (Subject)
 */
export class EventBus {
    // Singleton
    private static instance: EventBus;

    // Mapa que associa nomes de eventos a observadores
    private observers: Map<string, Observer[]> = new Map();

    /**
     * Construtor privado para padrão Singleton
     */
    private constructor() {}

    /**
     * Obtém a instância única do EventBus
     */
    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    /**
     * Registra um observador para um evento
     * @param eventName Nome do evento
     * @param observer Observador a ser registrado
     */
    public subscribe(eventName: string, observer: Observer): void {
        if (!this.observers.has(eventName)) {
            this.observers.set(eventName, []);
        }

        const eventObservers = this.observers.get(eventName)!;
        if (!eventObservers.includes(observer)) {
            eventObservers.push(observer);
        }
    }

    /**
     * Remove um observador de um evento
     * @param eventName Nome do evento
     * @param observer Observador a ser removido
     */
    public unsubscribe(eventName: string, observer: Observer): void {
        if (!this.observers.has(eventName)) {
            return;
        }

        const eventObservers = this.observers.get(eventName)!;
        this.observers.set(
            eventName,
            eventObservers.filter((obs) => obs !== observer)
        );
    }

    /**
     * Publica um evento para todos os observadores registrados
     * @param eventName Nome do evento
     * @param data Dados do evento
     */
    public async publish<T>(eventName: string, data: T): Promise<void> {
        if (!this.observers.has(eventName)) {
            return;
        }

        const eventObservers = this.observers.get(eventName)!;
        const updatePromises = eventObservers.map((observer) =>
            Promise.resolve(observer.update(eventName, data))
        );

        await Promise.all(updatePromises);
    }

    /**
     * Remove todos os observadores
     */
    public clear(): void {
        this.observers.clear();
    }
}

// Instância global do EventBus
export const eventBus = EventBus.getInstance();
