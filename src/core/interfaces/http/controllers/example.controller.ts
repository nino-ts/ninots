/**
 * Controlador de exemplo utilizando os decoradores
 */

import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    UseMiddlewares,
} from "../../../../decorators/controller.decorator";
import { HttpRequest, HttpResponse } from "../../middlewares/auth.middleware";
import { BaseController } from "../base.controller";
import { LoggerFactory } from "../../../../core/infrastructure/logging/logger-factory";
import { JwtAuthMiddleware } from "../../middlewares/auth.middleware";
import { middlewareAdapter } from "../../routes";

// Instância da middleware de autenticação
const authMiddleware = middlewareAdapter(new JwtAuthMiddleware());

// Logger para este controlador
const logger = LoggerFactory.create("example-controller");

/**
 * Interface que representa um exemplo
 */
interface ExampleItem {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
}

// Dados simulados para exemplo
const exampleData: ExampleItem[] = [
    {
        id: 1,
        name: "Exemplo 1",
        description: "Descrição do exemplo 1",
        createdAt: new Date(),
    },
    {
        id: 2,
        name: "Exemplo 2",
        description: "Descrição do exemplo 2",
        createdAt: new Date(),
    },
];

/**
 * Controlador para API de Exemplo
 *
 * Este controlador demonstra o uso dos decoradores para definir rotas HTTP
 * e gerenciar os recursos de um recurso de exemplo.
 */
@Controller("/examples")
export class ExampleController extends BaseController {
    /**
     * Obtém todos os exemplos
     */
    @Get("/")
    async getAllExamples(request: HttpRequest): Promise<HttpResponse> {
        logger.debug("Obtendo lista de exemplos");
        return this.ok(exampleData);
    }

    /**
     * Obtém um exemplo pelo ID
     */
    @Get("/:id")
    async getExampleById(request: HttpRequest): Promise<HttpResponse> {
        const id = parseInt(request.params.id);

        if (isNaN(id)) {
            return this.clientError("ID inválido: deve ser um número");
        }

        const example = exampleData.find((item) => item.id === id);

        if (!example) {
            return this.clientError(`Exemplo com ID ${id} não encontrado`, 404);
        }

        logger.debug(`Obtendo exemplo com ID ${id}`);
        return this.ok(example);
    }

    /**
     * Cria um novo exemplo
     * Esta rota requer autenticação
     */
    @Post("/")
    @UseMiddlewares(authMiddleware)
    async createExample(request: HttpRequest): Promise<HttpResponse> {
        const { name, description } = request.body;

        if (!name) {
            return this.clientError("Nome é obrigatório");
        }

        // Gerar um ID incremental
        const nextId =
            exampleData.length > 0
                ? Math.max(...exampleData.map((item) => item.id)) + 1
                : 1;

        // Criar novo exemplo
        const newExample: ExampleItem = {
            id: nextId,
            name,
            description,
            createdAt: new Date(),
        };

        // Adicionar aos dados
        exampleData.push(newExample);

        logger.debug(`Criado novo exemplo com ID ${newExample.id}`);
        return this.created(newExample);
    }

    /**
     * Atualiza um exemplo existente
     * Esta rota requer autenticação
     */
    @Put("/:id")
    @UseMiddlewares(authMiddleware)
    async updateExample(request: HttpRequest): Promise<HttpResponse> {
        const id = parseInt(request.params.id);

        if (isNaN(id)) {
            return this.clientError("ID inválido: deve ser um número");
        }

        const exampleIndex = exampleData.findIndex((item) => item.id === id);

        if (exampleIndex === -1) {
            return this.clientError(`Exemplo com ID ${id} não encontrado`, 404);
        }

        const { name, description } = request.body;

        // Atualizar campos
        if (name) exampleData[exampleIndex].name = name;
        if (description !== undefined)
            exampleData[exampleIndex].description = description;

        logger.debug(`Atualizado exemplo com ID ${id}`);
        return this.ok(exampleData[exampleIndex]);
    }

    /**
     * Remove um exemplo pelo ID
     * Esta rota requer autenticação
     */
    @Delete("/:id")
    @UseMiddlewares(authMiddleware)
    async deleteExample(request: HttpRequest): Promise<HttpResponse> {
        const id = parseInt(request.params.id);

        if (isNaN(id)) {
            return this.clientError("ID inválido: deve ser um número");
        }

        const exampleIndex = exampleData.findIndex((item) => item.id === id);

        if (exampleIndex === -1) {
            return this.clientError(`Exemplo com ID ${id} não encontrado`, 404);
        }

        // Remover o exemplo
        exampleData.splice(exampleIndex, 1);

        logger.debug(`Removido exemplo com ID ${id}`);
        return this.noContent();
    }

    /**
     * Este método é implementado para satisfazer a interface Controller
     * mas não será usado diretamente já que usamos os decoradores
     */
    async execute(request: HttpRequest): Promise<HttpResponse> {
        // Não é usado diretamente com decoradores
        throw new Error("Use os métodos decorados com @Get, @Post, etc");
    }
}
