/**
 * Utilitários para manipulação de arquivos e diretórios
 *
 * Este arquivo deve implementar:
 * 1. Operações de arquivo usando APIs nativas do Bun
 * 2. Criação de diretórios recursivos
 * 3. Cópia de arquivos e diretórios
 * 4. Verificação de existência de arquivos
 * 5. Leitura e escrita de arquivos com encoding correto
 *
 * Funções:
 * - createDir(path: string): Promise<void>
 * - copyFile(src: string, dest: string): Promise<void>
 * - writeFile(path: string, content: string): Promise<void>
 * - readFile(path: string): Promise<string>
 * - exists(path: string): boolean
 * - deleteFile(path: string): Promise<void>
 *
 * Use apenas Bun.file(), Bun.write() e API de filesystem nativa
 */
