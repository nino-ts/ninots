/**
 * File System Based Router for Ninots Framework
 *
 * Scans the `src/app` directory to automatically map file structure
 * to API routes and handles request dispatching.
 *
 * @module Core/Routing
 */

import { readdir } from 'node:fs/promises';
import path from 'node:path';

// Define a type for route handlers
// They receive the Bun Request and should return a Bun Response or Promise<Response>
type RouteHandler = (request: Request) => Response | Promise<Response>;

/**
 * Implements a file-system based router.
 *
 * Scans the `src/app` directory, maps files to routes, and handles
 * incoming requests by dynamically importing and executing the
 * appropriate handler based on the request method and path.
 */
export class FileSystemRouter {
  /**
   * Stores the discovered routes.
   * The key is the route path (e.g., '/', '/users', '/users/:id'),
   * and the value is an object mapping HTTP methods to handlers.
   * @private
   * @type {Map<string, Map<string, RouteHandler>>}
   */
  private routes: Map<string, Map<string, RouteHandler>> = new Map();

  /**
   * The base directory for scanning routes.
   * @private
   * @constant {string}
   */
  private readonly routesDir = path.join(process.cwd(), 'src', 'app');

  /**
   * Initializes the router by scanning the routes directory.
   * This method should be called before the server starts listening.
   * @public
   * @async
   */
  public async initialize(): Promise<void> {
    console.log(`[Router] Scanning for routes in ${this.routesDir}...`);
    this.routes.clear(); // Clear existing routes before rescanning
    await this.scanDirectory(this.routesDir);
    console.log(`[Router] Found ${this.routes.size} route paths.`);
    // Optional: Print discovered routes for debugging
    this.printRoutes(); // Activated for debugging
  }

  /**
   * Recursively scans a directory for route files.
   *
   * @param {string} dirPath - The absolute path to the directory to scan.
   * @param {string} [baseRoute=''] - The base route path accumulated so far.
   * @private
   * @async
   */
  private async scanDirectory(dirPath: string, baseRoute: string = ''): Promise<void> {
    try {
      const entries = await readdir(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const routePart = this.getRoutePart(entry.name);

        if (entry.isDirectory()) {
          // Recursivamente escaneie subdiretórios
          await this.scanDirectory(fullPath, path.join(baseRoute, routePart));
        } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))) {
          // Verifica se é um arquivo route.ts ou route.js
          if (entry.name === 'route.ts' || entry.name === 'route.js') {
            // Para arquivos route.ts, use o baseRoute diretamente
            await this.registerRouteFile(fullPath, baseRoute || '/');
          } else if (entry.name === 'index.ts' || entry.name === 'index.js') {
            // Para arquivos index.ts, use o baseRoute como está
            const routePath = baseRoute || '/';
            await this.registerRouteFile(fullPath, routePath);
          } else if (!entry.name.endsWith('.d.ts')) {
            // Para outros arquivos (exceto arquivos de definição .d.ts),
            // registre apenas se não for um arquivo de definição
            const routePath = path.join(baseRoute, routePart);
            await this.registerRouteFile(fullPath, routePath);
          }
        }
      }
    } catch (error: any) {
      // Handle cases where the directory might not exist initially
      if (error.code === 'ENOENT' && dirPath === this.routesDir) {
        console.warn(`[Router] ⚠️ Diretório de rotas ${this.routesDir} não encontrado. Nenhuma rota carregada.`);
      } else {
        console.error(`[Router] ❌ Erro ao escanear diretório ${dirPath}:`, error);
      }
    }
  }

  /**
   * Extracts the route part from a filename (removes extension, handles index).
   *
   * @param {string} filename - The name of the file or directory.
   * @returns {string} The corresponding route part.
   * @private
   */
  private getRoutePart(filename: string): string {
    // Remove a extensão do arquivo (.ts ou .js)
    const nameWithoutExt = filename.replace(/\.(ts|js|d\.ts)$/, '');
    
    // Ignore arquivos chamados "route" que são tratados especialmente
    if (nameWithoutExt === 'route') {
      return '';
    }
    
    // Converte segmentos dinâmicos [id] para :id para compatibilidade com express-like routing
    return nameWithoutExt.replace(/\[([^\]]+)\]/g, ':$1');
  }

  /**
   * Dynamically imports a route file and registers its handlers.
   *
   * @param {string} filePath - The absolute path to the route file.
   * @param {string} routePath - The calculated route path.
   * @private
   * @async
   */
  private async registerRouteFile(filePath: string, routePath: string): Promise<void> {
    try {
      console.log(`[Router] 🔄 Registrando arquivo de rota: ${filePath}`);
      
      // Use dynamic import to load the module
      const module = await import(filePath);
      let routeHandlers = this.routes.get(routePath);
      if (!routeHandlers) {
        routeHandlers = new Map<string, RouteHandler>();
        this.routes.set(routePath, routeHandlers);
      }

      // Look for exported functions named after HTTP methods (uppercase)
      const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
      const registeredMethods: string[] = [];
      
      for (const exportName in module) {
        const potentialHandler = module[exportName];
        const upperExportName = exportName.toUpperCase();

        if (typeof potentialHandler === 'function' &&
            httpMethods.includes(upperExportName))
        {
          if (routeHandlers.has(upperExportName)) {
             console.warn(`[Router] ⚠️ Handler duplicado para ${upperExportName} ${routePath} em ${filePath}. Sobrescrevendo.`);
          }
          routeHandlers.set(upperExportName, potentialHandler as RouteHandler);
          registeredMethods.push(upperExportName);
        }
      }
      
      if (registeredMethods.length > 0) {
        console.log(`[Router] ✅ Registrado ${registeredMethods.length} método(s) para rota ${routePath}: ${registeredMethods.join(', ')}`);
      } else {
        console.warn(`[Router] ⚠️ Arquivo de rota ${filePath} não exporta nenhum método HTTP.`);
      }
    } catch (error) {
      console.error(`[Router] ❌ Falha ao importar ou registrar arquivo de rota ${filePath}:`, error);
      if (error instanceof Error) {
        console.error(error.stack);
      }
    }
  }

  /**
   * Encontra um handler correspondente para um caminho específico, incluindo
   * suporte para parâmetros dinâmicos.
   * 
   * @param pathname Caminho da URL a ser correspondido
   * @param method Método HTTP
   * @returns Handler correspondente e parâmetros extraídos, ou null se não encontrado
   */
  private findMatchingRoute(pathname: string, method: string): 
      { handler: RouteHandler, params: Record<string, string> } | null {
    
    // 1. Tentar correspondência exata primeiro (mais rápido)
    const exactHandlers = this.routes.get(pathname);
    if (exactHandlers && exactHandlers.has(method)) {
      return { 
        handler: exactHandlers.get(method)!,
        params: {}
      };
    }
    
    // 2. Verificar rotas com parâmetros dinâmicos
    for (const [routePath, handlers] of this.routes.entries()) {
      // Pular se não tiver o método que precisamos
      if (!handlers.has(method)) continue;
      
      // Verificar se a rota tem parâmetros dinâmicos (:id)
      if (routePath.includes(':')) {
        const params: Record<string, string> = {};
        const isMatch = this.matchDynamicRoute(routePath, pathname, params);
        
        if (isMatch) {
          return {
            handler: handlers.get(method)!,
            params
          };
        }
      }
    }
    
    // Nenhuma correspondência encontrada
    return null;
  }
  
  /**
   * Verifica se um caminho corresponde a uma rota dinâmica e extrai os parâmetros.
   * 
   * @param routePath Caminho da rota (ex: 'users/:id')
   * @param pathname Caminho da URL (ex: 'users/123')
   * @param params Objeto para armazenar os parâmetros extraídos
   * @returns true se houver correspondência, false caso contrário
   */
  private matchDynamicRoute(
    routePath: string,
    pathname: string,
    params: Record<string, string>
  ): boolean {
    // Divida os caminhos em segmentos
    const routeSegments = routePath.split('/');
    const pathSegments = pathname.split('/');
    
    // Se o número de segmentos for diferente, não há correspondência
    if (routeSegments.length !== pathSegments.length) {
      return false;
    }
    
    // Verifique cada segmento
    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i] || '';
      const pathSegment = pathSegments[i] || '';
      
      // Se o segmento da rota começar com ':', é um parâmetro
      if (routeSegment.startsWith(':')) {
        const paramName = routeSegment.substring(1);
        params[paramName] = pathSegment;
        continue;
      }
      
      // Caso contrário, os segmentos devem corresponder exatamente
      if (routeSegment !== pathSegment) {
        return false;
      }
    }
    
    // Todos os segmentos correspondem
    return true;
  }

  /**
   * Handles an incoming request by finding and executing the appropriate handler.
   *
   * @param {Request} request - The incoming Bun Request object.
   * @returns {Promise<Response>} A promise resolving to the Bun Response.
   * @public
   * @async
   */
  public async handleRequest(request: Request): Promise<Response> {
    const startTime = Date.now();
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method.toUpperCase();
    
    console.log(`[Router] 🔍 Recebida requisição: ${method} ${pathname}`);
    
    // Logar query params se existirem
    const queryParams = Object.fromEntries(url.searchParams.entries());
    if (Object.keys(queryParams).length > 0) {
      console.log(`[Router] 📝 Query params:`, queryParams);
    }

    // Pré-processar o pathname removendo a barra inicial
    // Um pathname de "/hello" precisa se tornar "hello" para correspondência
    const normalizedPath = pathname.replace(/^\//, '');

    // Encontrar handler correspondente usando o novo método
    const match = this.findMatchingRoute(normalizedPath, method);

    if (match) {
      const { handler, params } = match;
      console.log(`[Router] ✅ Rota encontrada para: ${pathname}`);
      
      if (Object.keys(params).length > 0) {
        console.log(`[Router] 📝 Parâmetros extraídos:`, params);
      }
      
      try {
        // Criar um objeto de contexto para passar informações adicionais
        const context = {
          params,
          query: queryParams
        };
        
        // Executar o handler com o request e contexto
        console.log(`[Router] ⚙️ Executando handler para ${method} ${pathname}...`);
        
        // Passe o contexto como propriedade do request para manter compatibilidade
        // @ts-ignore - Adicionando propriedade personalizada ao Request
        request.routeContext = context;
        
        const response = await handler(request);
        
        // Ensure it's a Response object
        const finalResponse = response instanceof Response 
          ? response 
          : new Response(String(response));
        
        const duration = Date.now() - startTime;
        console.log(`[Router] ✨ Resposta gerada para ${method} ${pathname} (${finalResponse.status}) em ${duration}ms`);
        
        return finalResponse;
      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[Router] ❌ Erro ao executar handler para ${method} ${pathname} após ${duration}ms:`, error);
        if (error instanceof Error) {
          console.error(`[Router] Stack trace:`, error.stack);
        }
        return new Response('Internal Server Error', { status: 500 });
      }
    } else {
      console.log(`[Router] ❓ Nenhuma rota encontrada para: ${pathname}`);
      
      // Listar rotas disponíveis para debug
      console.log(`[Router] 📋 Rotas disponíveis:`, Array.from(this.routes.keys())
        .map(route => route ? `/${route}` : '/'));
      
      // Not Found
      return new Response('Not Found', { status: 404 });
    }
  }

  /**
   * Prints the discovered routes to the console (for debugging).
   * @private
   */
  private printRoutes(): void {
    console.log('[Router] 📋 Rotas descobertas:');
    if (this.routes.size === 0) {
      console.log('  ⚠️ Nenhuma rota encontrada.');
      return;
    }
    
    // Organizar rotas por caminho para melhor legibilidade
    const sortedRoutes = Array.from(this.routes.entries())
      .sort(([a], [b]) => a.localeCompare(b));
      
    // Agrupar rotas por caminho base para melhor organização
    const routeGroups: Record<string, string[]> = {};
    
    sortedRoutes.forEach(([path, handlers]) => {
      const methods = Array.from(handlers.keys()).join(', ');
      const displayPath = path === '' ? '/' : `/${path}`;
      console.log(`  🔹 ${displayPath} [${methods}]`);
      
      // Para debug: mostrar correspondência completa de URLs
      const baseGroup = path.split('/')[0] || '/';
      if (!routeGroups[baseGroup]) {
        routeGroups[baseGroup] = [];
      }
      routeGroups[baseGroup].push(`${displayPath} [${methods}]`);
    });
    
    // Exibir agrupamentos para melhor visualização
    console.log('[Router] 📊 Rotas agrupadas por caminho base:');
    Object.entries(routeGroups).forEach(([group, routes]) => {
      console.log(`  📁 ${group === '/' ? 'Root' : group}:`);
      routes.forEach(route => console.log(`    → ${route}`));
    });
    
    // Mostrar contagem total
    const totalEndpoints = sortedRoutes.reduce(
      (total, [_, handlers]) => total + handlers.size, 0
    );
    console.log(`[Router] ✅ Total: ${this.routes.size} rotas, ${totalEndpoints} endpoints`);
  }
}

