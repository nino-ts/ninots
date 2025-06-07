/**
 * Gerenciador de configurações
 *
 * Este arquivo deve:
 * 1. Carregar configurações do arquivo ninots.config.ts do projeto
 * 2. Mesclar com configurações padrão
 * 3. Validar configurações
 * 4. Fornecer acesso tipado às configurações
 *
 * Funcionalidades:
 * - loadConfig(projectPath: string): Promise<Config>
 * - validateConfig(config: any): boolean
 * - getConfig(): Config
 * - updateConfig(updates: Partial<Config>): void
 *
 * Deve buscar arquivo de config na raiz do projeto ou usar padrões
 */
