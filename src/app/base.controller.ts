import type { HttpError, HttpMetadata, HttpResponse, HttpStatus } from "@shared/types/http";

/**
 * Classe base para controladores
 */
export abstract class BaseController {
    /**
     * Cria uma resposta de sucesso
     * @param data Dados da resposta
     * @param status Código de status HTTP
     * @returns Resposta HTTP
     */
    protected createResponse<T>(data: T, status: HttpStatus | number = 200): Response {
        const responseData: HttpResponse<T> = {
            data,
            metadata: this.createMetadata()
        };

        return new Response(JSON.stringify(responseData), {
            status,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    /**
     * Cria uma resposta de erro
     * @param message Mensagem de erro
     * @param code Código de erro
     * @param status Código de status HTTP
     * @param details Detalhes adicionais do erro
     * @returns Resposta HTTP
     */
    protected createErrorResponse(
        message: string,
        code: string,
        status: HttpStatus | number = 400,
        details?: unknown
    ): Response {
        const error: HttpError = {
            message,
            code,
            details
        };
        
        const errorResponse: HttpResponse<never> = {
            error,
            metadata: this.createMetadata()
        };

        return new Response(JSON.stringify(errorResponse), {
            status,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    /**
     * Cria os metadados da resposta
     * @returns Metadados da resposta
     */
    private createMetadata(): HttpMetadata {
        return {
            timestamp: Date.now(),
            path: this.getRequestPath()
        };
    }

    /**
     * Obtém o caminho da requisição atual
     * @returns Caminho da requisição
     */
    protected abstract getRequestPath(): string;
} 