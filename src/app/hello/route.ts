import type { HttpResponse } from "@shared/types/http";

/**
 * Rota de exemplo Hello World
 * GET /hello
 * 
 * @returns {Response} Resposta com mensagem de boas-vindas
 */
export function GET(request: Request): Response {
    console.log(`[Route: /hello] 👋 Rota de boas-vindas acessada`);
    
    // Log de informações da requisição para debug
    const url = new URL(request.url);
    console.log(`[Route: /hello] 📝 Detalhes da requisição:`, {
        method: request.method,
        path: url.pathname,
        headers: Object.fromEntries(request.headers.entries()),
        timestamp: new Date().toISOString()
    });
    
    const responseData: HttpResponse<{ message: string }> = {
        data: {
            message: "Hello World do Ninots!"
        },
        metadata: {
            timestamp: new Date().toISOString(),
            path: url.pathname,
            method: request.method as any
        }
    };

    console.log(`[Route: /hello] ✅ Enviando resposta`);
    
    return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
} 