/**
 * Módulo para inicialização da aplicação
 */

import { DatabaseAdapter, initDatabase } from "./database";
import { container } from "../container";
import type { Router } from "../core/interfaces/http/routes";
import { createRouter } from "../core/interfaces/http/routes";
import { HttpServer } from "../core/interfaces/http/server";
import type { UserRepository } from "../core/domain/repositories/user.repository";
import { UserRepositoryImpl } from "../core/infrastructure/database/orm/repositories/user.repository.impl";
import { UserService } from "../core/application/services/user.service";
import { LoggerFactory } from "../core/infrastructure/logging/logger-factory";
import { MigrationManager } from "./migrations";
import loggingConfig from "../config/logging";
import path from "node:path";

/**
 * Classe responsável pela inicialização da aplicação
 */
export class Bootstrapper {
    /**
     * Adaptador de banco de dados
     */
    private dbAdapter?: DatabaseAdapter;

    /**
     * Servidor HTTP
     */
    private httpServer?: HttpServer;

    /**
     * Router da aplicação
     */
    private router?: Router;

    /**
     * Logger da aplicação
     */
    private logger;

    /**
     * Gerenciador de migrações
     */
    private migrationManager?: MigrationManager;

    /**
     * Construtor da classe Bootstrapper
     */
    constructor() {
        // Configura o sistema de logging
        LoggerFactory.configure({
            console: loggingConfig.console,
            file: loggingConfig.file,
        });

        // Cria o logger para este módulo
        this.logger = LoggerFactory.create("bootstrap");
    }

    /**
     * Inicializa a aplicação
     */
    public async initialize(): Promise<void> {
        this.logger.info("Inicializando Ninots...");

        try {
            await this.initializeDatabase();
            await this.registerDependencies();
            await this.initializeHttpServer();
        } catch (error) {
            this.logger.error("Falha ao inicializar aplicação", { error });
            throw error;
        }
    }
    /**
     * Inicializa a conexão com o banco de dados
     */
    private async initializeDatabase(): Promise<void> {
        this.logger.info("Inicializando banco de dados...");

        // Inicializa a conexão com o banco de dados
        this.dbAdapter = await initDatabase();

        // Inicializa o gerenciador de migrações
        if (this.dbAdapter) {
            const migrationsDir = path.join(
                process.cwd(),
                "src/core/infrastructure/migrations"
            );
            this.migrationManager = new MigrationManager(
                this.dbAdapter.getDriver(),
                migrationsDir
            );

            await this.migrationManager.initialize();

            // Importar apenas se houver configuração de DB
            const { MigrationGenerator } = await import(
                "./migration-generator"
            );
            const migrationGenerator = new MigrationGenerator(
                this.dbAdapter.getDriver(),
                migrationsDir,
                this.migrationManager
            );

            // Verificar configuração de migrações automáticas
            const dbConfig = (await import("../config/database")).default;
            const autoMigrate = dbConfig.migrations?.autoMigrate === true;

            if (autoMigrate) {
                // Gerar e aplicar migrações automaticamente
                this.logger.info(
                    "Auto-migração habilitada, verificando mudanças no schema"
                );

                try {
                    const applied = await migrationGenerator.autoMigrate();

                    if (applied) {
                        this.logger.info("Auto-migração aplicada com sucesso");
                    } else {
                        this.logger.info("Nenhuma mudança no schema detectada");
                    }
                } catch (error) {
                    this.logger.error("Erro na auto-migração", { error });
                }
            } else if (this.migrationManager.hasPendingMigrations()) {
                // Apenas aplica migrações pendentes se não estiver em modo auto
                this.logger.info("Existem migrações pendentes. Aplicando...");
                await this.migrationManager.migrateUp();
                this.logger.info("Migrações aplicadas com sucesso");
            }
        }

        this.logger.info("Banco de dados inicializado com sucesso");
    }
    /**
     * Registra as dependências no container
     */
    private async registerDependencies(): Promise<void> {
        this.logger.info("Registrando dependências...");

        // Registrar repositórios
        container.singleton("UserRepository", UserRepositoryImpl);

        // Registrar serviços
        container.singleton("UserService", UserService);

        // Registrar controladores
        container.singleton("UserController", () => {
            const controller =
                new (require("../core/application/controllers/user.controller").UserController)();
            return controller;
        });

        this.logger.info("Dependências registradas com sucesso");
    }
    /**
     * Inicializa o servidor HTTP
     */
    private async initializeHttpServer(): Promise<void> {
        this.logger.info("Inicializando servidor HTTP...");

        // Criar e configurar o router
        this.router = createRouter();

        try {
            // Configurar as rotas da aplicação
            const {
                setupRoutes,
            } = require("../core/interfaces/http/routes/setup");
            setupRoutes(this.router);
        } catch (error) {
            this.logger.error("Erro ao configurar rotas:", { error });
            throw error;
        }

        // Criar e iniciar o servidor HTTP
        const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
        this.httpServer = new HttpServer(this.router, port);
        this.httpServer.start();

        this.logger.info(
            `Servidor HTTP inicializado com sucesso na porta ${port}`
        );
        this.logger.info(
            `Documentação da API disponível em http://localhost:${port}/api-docs`
        );
    }

    /**
     * Desliga a aplicação
     */
    public async shutdown(): Promise<void> {
        this.logger.info("Desligando Ninots...");

        // Parar o servidor HTTP se estiver rodando
        if (this.httpServer) {
            this.httpServer.stop();
        }

        // Fechar conexão com o banco de dados
        if (this.dbAdapter) {
            await import("./database").then(({ closeDatabase }) =>
                closeDatabase(this.dbAdapter!)
            );
        }

        this.logger.info("Ninots desligado com sucesso");
    }
}
