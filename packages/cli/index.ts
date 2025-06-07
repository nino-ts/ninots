/**
 * Ninots CLI - Entry point alias
 * 
 * Este arquivo serve como um alias para o ponto de entrada principal
 * do CLI localizado em src/index.ts. Isso permite usar comandos como
 * `bun run index.ts` conforme documentado no README.
 */

// Verifica se o arquivo está sendo executado diretamente
if (import.meta.main) {
    // Importa dinamicamente o arquivo principal
    try {
        await import('./src/index.ts');
    } catch (error) {
        console.error('Erro ao carregar o CLI:', error);
        console.log('CLI do Ninots ainda não implementado. Use `bun run src/index.ts` para desenvolvimento.');
        process.exit(1);
    }
}

// Re-exporta tudo do arquivo principal para uso como módulo
export * from './src/index.ts';
