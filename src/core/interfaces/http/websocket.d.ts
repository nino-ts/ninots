/**
 * Tipos para o sistema de WebSockets
 */

/**
 * Interface para os dados associados a uma conexão WebSocket
 */
export interface WebSocketData {
    /** URL da conexão */
    url: string;
    /** Cabeçalhos da requisição inicial */
    headers: Headers;
    /** Dados adicionais específicos da aplicação */
    [key: string]: any;
}
