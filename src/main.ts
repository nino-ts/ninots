/**
 * Ponto de entrada principal do Ninots
 */

import { Bootstrapper } from "./bootstrap/app";

/**
 * Inicializa a aplicação
 */
async function bootstrap() {
    const app = new Bootstrapper();

    try {
        await app.initialize();
        console.log("Ninots inicializado com sucesso!");

        // Configurar handler para encerramento gracioso
        process.on("SIGINT", async () => {
            console.log("\nRecebido sinal SIGINT, encerrando aplicação...");
            await app.shutdown();
            process.exit(0);
        });

        process.on("SIGTERM", async () => {
            console.log("\nRecebido sinal SIGTERM, encerrando aplicação...");
            await app.shutdown();
            process.exit(0);
        });
    } catch (error) {
        console.error("Erro ao inicializar o Ninots:", error);
        process.exit(1);
    }
}

// Inicializa a aplicação
bootstrap();
