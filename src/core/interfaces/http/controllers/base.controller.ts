/**
 * Controlador base para HTTP
 */

import { HttpRequest, HttpResponse } from "../middlewares/auth.middleware";

/**
 * Interface base para controladores HTTP
 */
export interface Controller {
    /**
     * Manipula uma requisição HTTP
     * @param request Requisição HTTP
     */
    handle(request: HttpRequest): Promise<HttpResponse>;
}

/**
 * Classe base para controladores HTTP
 */
export abstract class BaseController implements Controller {
    /**
     * Método abstrato que cada controlador deve implementar
     */
    abstract execute(request: HttpRequest): Promise<HttpResponse>;

    /**
     * Manipula a requisição HTTP e captura erros
     * @param request Requisição HTTP
     */
    async handle(request: HttpRequest): Promise<HttpResponse> {
        try {
            return await this.execute(request);
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Cria uma resposta de sucesso
     * @param data Dados para o corpo da resposta
     * @param statusCode Código de status HTTP (default: 200)
     */
    protected ok(data: any, statusCode = 200): HttpResponse {
        return {
            status: statusCode,
            body: data,
        };
    }

    /**
     * Cria uma resposta de criação
     * @param data Dados para o corpo da resposta
     */
    protected created(data: any): HttpResponse {
        return {
            status: 201,
            body: data,
        };
    }

    /**
     * Cria uma resposta sem conteúdo
     */
    protected noContent(): HttpResponse {
        return {
            status: 204,
            body: null,
        };
    }

    /**
     * Cria uma resposta de erro do cliente
     * @param message Mensagem de erro
     * @param statusCode Código de status HTTP (default: 400)
     */
    protected clientError(message: string, statusCode = 400): HttpResponse {
        return {
            status: statusCode,
            body: {
                error: message,
            },
        };
    }

    /**
     * Cria uma resposta de erro do servidor
     * @param error Erro ocorrido
     */
    protected serverError(error: Error): HttpResponse {
        console.error(error);

        return {
            status: 500,
            body: {
                error: "Internal server error",
            },
        };
    }

    /**
     * Trata erros ocorridos durante a execução
     * @param error Erro capturado
     */
    protected handleError(error: any): HttpResponse {
        console.error("Controller Error:", error);

        // Aqui poderíamos ter lógica para diferentes tipos de erros
        return this.serverError(
            error instanceof Error ? error : new Error(String(error))
        );
    }
}
