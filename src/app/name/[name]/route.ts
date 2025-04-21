import { HttpResponse } from "@shared/types/http";

/**
 * Rota de exemplo com parâmetro dinâmico
 * GET /name/[name]
 */
export function GET(request: Request): Response {
    const url = new URL(request.url);
    const name = decodeURIComponent(url.pathname.split('/').pop() || '');

    const responseData: HttpResponse<{ greeting: string }> = {
        data: {
            greeting: `Olá, ${name}! Bem-vindo ao Ninots!`
        },
        metadata: {
            timestamp: new Date().toISOString(),
            parameter: name
        }
    };

    return new Response(JSON.stringify(responseData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
} 