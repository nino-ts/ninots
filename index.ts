/**
 * Arquivo de exportação principal do Ninots
 * Este arquivo exporta as principais APIs públicas do framework
 */

// Exportações do núcleo
export * from "./src/core/domain/entities/base.entity";

// Exportações de infraestrutura
export * from "./src/core/infrastructure/database/orm/base.repository";
export * from "./src/core/infrastructure/database/orm/transaction.manager";

// Exportações de interfaces de repositório
export * from "./src/core/domain/repositories/repository.interface";

// Exportações de inicialização
export * from "./src/bootstrap/database";

// Re-exportações do ninorm para conveniência
export {
    Entity,
    Column,
    PrimaryKey,
    OneToOne,
    OneToMany,
    ManyToOne,
    ManyToMany,
} from "ninorm/src/Core/Decorators";
