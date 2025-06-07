/**
 * Template para middleware de rate limiting
 *
 * Este arquivo deve exportar uma função que gera um middleware
 * de limitação de taxa de requisições.
 *
 * Funcionalidades:
 * - Limite por IP ou usuário
 * - Janelas de tempo configuráveis
 * - Diferentes estratégias (sliding window, fixed window)
 * - Headers de resposta informativos
 * - Integração com Redis opcional
 */
