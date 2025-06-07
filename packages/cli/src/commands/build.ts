/**
 * Comando: ninots build
 *
 * Este comando deve:
 * 1. Compilar projeto TypeScript para JavaScript
 * 2. Remover comentários e minificar código
 * 3. Gerar source maps se solicitado
 * 4. Copiar assets necessários
 * 5. Otimizar bundle final
 *
 * Uso:
 * ninots build [options]
 *
 * Opções:
 * --minify: minificar código (default: true)
 * --sourcemap: gerar source maps
 * --outdir: diretório de saída (default: dist)
 * --watch: modo watch para rebuild automático
 *
 * Deve usar Bun.build() para compilação nativa
 */
