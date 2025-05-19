/**
 * Implementação de eventos de domínio
 */

import { BaseEntity } from "../entities/base.entity";

/**
 * Interface para eventos de domínio
 */
export interface DomainEvent<T extends BaseEntity = any> {
    /**
     * Data de ocorrência do evento
     */
    readonly occurredAt: Date;

    /**
     * Nome do evento
     */
    readonly eventName: string;

    /**
     * Entidade relacionada ao evento
     */
    readonly entity: T;

    /**
     * Obtém uma representação serializável do evento
     */
    serialize(): Record<string, any>;
}

/**
 * Evento base abstrato
 */
export abstract class BaseDomainEvent<T extends BaseEntity>
    implements DomainEvent<T>
{
    /**
     * Data de ocorrência do evento
     */
    public readonly occurredAt: Date;

    /**
     * Construtor do evento
     * @param entity Entidade relacionada
     */
    constructor(public readonly entity: T) {
        this.occurredAt = new Date();
    }

    /**
     * Nome do evento (deve ser implementado pelas subclasses)
     */
    abstract get eventName(): string;

    /**
     * Serializa o evento
     */
    serialize(): Record<string, any> {
        return {
            eventName: this.eventName,
            occurredAt: this.occurredAt.toISOString(),
            entity: this.entity.toJSON(),
        };
    }
}

/**
 * Evento de entidade criada
 */
export class EntityCreatedEvent<
    T extends BaseEntity
> extends BaseDomainEvent<T> {
    /**
     * Nome do evento
     */
    get eventName(): string {
        return `${this.entity.constructor.name}.created`;
    }
}

/**
 * Evento de entidade atualizada
 */
export class EntityUpdatedEvent<
    T extends BaseEntity
> extends BaseDomainEvent<T> {
    /**
     * Nome do evento
     */
    get eventName(): string {
        return `${this.entity.constructor.name}.updated`;
    }

    /**
     * Construtor do evento
     * @param entity Entidade atualizada
     * @param changes Campos alterados
     */
    constructor(
        entity: T,
        public readonly changes: Record<
            string,
            { oldValue: any; newValue: any }
        >
    ) {
        super(entity);
    }

    /**
     * Serializa o evento incluindo as mudanças
     */
    serialize(): Record<string, any> {
        const base = super.serialize();
        return {
            ...base,
            changes: this.changes,
        };
    }
}

/**
 * Evento de entidade excluída
 */
export class EntityDeletedEvent<
    T extends BaseEntity
> extends BaseDomainEvent<T> {
    /**
     * Nome do evento
     */
    get eventName(): string {
        return `${this.entity.constructor.name}.deleted`;
    }
}
