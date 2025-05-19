/**
 * Arquivo de exportação principal do Ninots
 * Este arquivo exporta as principais APIs públicas do framework
 */

// Container de Injeção de Dependências
export * from "./src/container";

// Exportações do núcleo
export * from "./src/core/domain/entities/base.entity";
export * from "./src/core/domain/events/event-bus";

// Exportações de infraestrutura
export * from "./src/core/infrastructure/database/orm/base.repository";
export * from "./src/core/infrastructure/database/orm/transaction.manager";
export * from "./src/core/infrastructure/cache/cache";
export * from "./src/core/infrastructure/logging/logger.adapter";

// Exportações de interfaces
export * from "./src/core/domain/repositories/repository.interface";
export * from "./src/core/interfaces/http/middlewares/auth.middleware";
export * from "./src/core/interfaces/http/routes";
export * from "./src/core/interfaces/http/server";

// Exportações de validações
export * from "./src/core/validations/validation";

// Exportações de middlewares
export * from "./src/core/middlewares/cors";
export * from "./src/core/middlewares/rate-limiter";

// Exportações de decoradores
export * from "./src/shared/decorators/method.decorators";

// Exportações de inicialização
export * from "./src/bootstrap/database";

// Exportações de testes
export * from "./src/core/testing/test-utils";

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
