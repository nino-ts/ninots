import { HttpResponse } from "@shared/types/http";

/**
 * Rota de exemplo Hello World
 * GET /hello
 * 
 * @returns {Response} Resposta com mensagem de boas-vindas
 */
export function GET(): Response {
    const responseData: HttpResponse<{ message: string }> = {
        data: {
            message: "Hello World do Ninots!"
        },
        metadata: {
            timestamp: new Date().toISOString()
        }
    };

    return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
} 