import type { HttpError, HttpMetadata, HttpResponse, HttpStatus } from "@shared/types/http";

/**
 * Classe base para controladores
 */
export declare abstract class BaseController {
    /**
     * Cria uma resposta de sucesso
     * @param data Dados da resposta
     * @param status Código de status HTTP
     * @returns Resposta HTTP
     */
    protected createResponse<T>(data: T, status?: HttpStatus | number): Response;

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
        status?: HttpStatus | number,
        details?: unknown
    ): Response;
    
    /**
     * Cria os metadados da resposta
     * @returns Metadados da resposta
     */
    private createMetadata(): HttpMetadata;

    /**
     * Obtém o caminho da requisição atual
     * @returns Caminho da requisição
     */
    protected abstract getRequestPath(): string;
} 