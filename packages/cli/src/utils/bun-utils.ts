/**
 * Utilitários específicos do Bun
 *
 * Este arquivo deve implementar:
 * 1. Helpers para usar APIs específicas do Bun
 * 2. Gerenciamento de processos filho com Bun.spawn
 * 3. Integração com sistema de build do Bun
 * 4. Utilitários para watch mode
 * 5. Helpers para executar comandos shell
 *
 * Funções:
 * - spawnBunProcess(command: string[], options?: SpawnOptions): Promise<ProcessResult>
 * - buildWithBun(config: BuildConfig): Promise<BuildResult>
 * - watchFiles(patterns: string[], callback: Function): WatcherInstance
 * - executeShellCommand(command: string): Promise<string>
 *
 * Deve aproveitar ao máximo as capacidades nativas do Bun
 */
