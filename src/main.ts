/**
 * Ponto de entrada principal do Ninots
 */

import { initDatabase, closeDatabase } from "./bootstrap/database";

/**
 * Inicializa a aplicação
 */
async function bootstrap() {
    console.log("Inicializando o Ninots...");

    try {
        // Inicializa o banco de dados
        const dbAdapter = await initDatabase();
        console.log("Conexão com o banco de dados estabelecida");

        // Aqui inicializaríamos o servidor HTTP, WebSocket, etc.
        console.log("Ninots está pronto!");

        // Handler para desligar a aplicação graciosamente
        process.on("SIGINT", async () => {
            console.log("Desligando o Ninots...");
            await closeDatabase(dbAdapter);
            process.exit(0);
        });
    } catch (error) {
        console.error("Erro ao inicializar o Ninots:", error);
        process.exit(1);
    }
}

// Inicializa a aplicação
bootstrap();
