import type { HttpResponse } from "@shared/types/http";

/**
 * Rota de exemplo com parâmetro dinâmico
 * GET /name/[name]
 */
export function GET(request: Request): Response {
    const url = new URL(request.url);
    const name = decodeURIComponent(url.pathname.split('/').pop() || '');
    
    console.log(`[Route: /name/${name}] 👤 Rota com parâmetro dinâmico acessada`);
    console.log(`[Route: /name/${name}] 📝 Parâmetro recebido: name = ${name}`);

    const responseData: HttpResponse<{ greeting: string }> = {
        data: {
            greeting: `Olá, ${name}! Bem-vindo ao Ninots!`
        },
        metadata: {
            timestamp: new Date().toISOString(),
            path: url.pathname,
            method: request.method as any,
            parameter: name
        }
    };

    console.log(`[Route: /name/${name}] ✅ Enviando resposta de saudação`);

    return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
} 