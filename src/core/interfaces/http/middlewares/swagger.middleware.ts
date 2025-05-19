/**
 * Middleware para servir documentação Swagger
 */

import {
    HttpRequest,
    HttpResponse,
} from "../interfaces/http/middlewares/auth.middleware";
import { openApiSchema } from "../documentation/openapi";

/**
 * Middleware que serve a documentação Swagger
 */
export function swaggerMiddleware() {
    return async (
        request: HttpRequest,
        next: () => Promise<HttpResponse>
    ): Promise<HttpResponse> => {
        const { params } = request;
        const path = request.params["path"] || "";

        if (path === "swagger.json") {
            return {
                status: 200,
                body: openApiSchema,
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }

        if (path === "" || path === "index.html") {
            return {
                status: 200,
                body: generateSwaggerUI(),
                headers: {
                    "Content-Type": "text/html",
                },
            };
        }

        // Para outros caminhos, continuar para o próximo middleware
        return next();
    };
}

/**
 * Gera a página HTML do Swagger UI
 */
function generateSwaggerUI(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ninots API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
  <style>
    body {
      margin: 0;
      padding: 0;
    }
    #swagger-ui {
      max-width: 1460px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: "./swagger.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout",
        tagSorter: "alpha",
        operationsSorter: "alpha",
        docExpansion: "list"
      });
    };
  </script>
</body>
</html>`;
}
