/**
 * Configuração do Swagger/OpenAPI
 */

/**
 * Informações básicas da API
 */
export const apiInfo = {
    title: "Ninots API",
    description: "API para demonstração do framework Ninots",
    version: "1.0.0",
    contact: {
        name: "Ninots Team",
        url: "https://github.com/joaovjo/ninots",
        email: "contato@joaovjo.com.br",
    },
    license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
    },
};

/**
 * Configuração do servidor
 */
export const servers = [
    {
        url: "http://localhost:3000",
        description: "Servidor de desenvolvimento",
    },
];

/**
 * Componentes reutilizáveis
 */
export const components = {
    securitySchemes: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
        },
    },
    schemas: {
        User: {
            type: "object",
            required: ["id", "name", "email"],
            properties: {
                id: {
                    type: "integer",
                    format: "int64",
                    description: "ID único do usuário",
                },
                name: {
                    type: "string",
                    description: "Nome do usuário",
                },
                email: {
                    type: "string",
                    format: "email",
                    description: "Email do usuário",
                },
                createdAt: {
                    type: "string",
                    format: "date-time",
                    description: "Data de criação",
                },
                updatedAt: {
                    type: "string",
                    format: "date-time",
                    description: "Data de atualização",
                },
            },
        },
        Error: {
            type: "object",
            properties: {
                message: {
                    type: "string",
                    description: "Mensagem de erro",
                },
            },
        },
    },
};

/**
 * Esquema completo do OpenAPI
 */
export const openApiSchema = {
    openapi: "3.0.3",
    info: apiInfo,
    servers,
    components,
    paths: {
        "/users": {
            get: {
                tags: ["Users"],
                summary: "Lista todos os usuários",
                description:
                    "Retorna uma lista de todos os usuários cadastrados",
                operationId: "getUsers",
                responses: {
                    "200": {
                        description: "Lista de usuários",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/User",
                                    },
                                },
                            },
                        },
                    },
                    "500": {
                        description: "Erro interno do servidor",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
            post: {
                tags: ["Users"],
                summary: "Cria um novo usuário",
                description: "Cria um novo usuário no sistema",
                operationId: "createUser",
                requestBody: {
                    description: "Dados do usuário",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["name", "email", "password"],
                                properties: {
                                    name: {
                                        type: "string",
                                        example: "John Doe",
                                    },
                                    email: {
                                        type: "string",
                                        format: "email",
                                        example: "john@example.com",
                                    },
                                    password: {
                                        type: "string",
                                        format: "password",
                                        example: "securepassword",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "201": {
                        description: "Usuário criado com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/User",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Dados inválidos",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                    "409": {
                        description: "Email já em uso",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                    "500": {
                        description: "Erro interno do servidor",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/users/{id}": {
            get: {
                tags: ["Users"],
                summary: "Obtém um usuário pelo ID",
                description: "Retorna os dados de um usuário específico",
                operationId: "getUserById",
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "ID do usuário",
                        required: true,
                        schema: {
                            type: "integer",
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Usuário encontrado",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/User",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Usuário não encontrado",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                    "500": {
                        description: "Erro interno do servidor",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
            put: {
                tags: ["Users"],
                summary: "Atualiza um usuário",
                description: "Atualiza os dados de um usuário existente",
                operationId: "updateUser",
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "ID do usuário",
                        required: true,
                        schema: {
                            type: "integer",
                        },
                    },
                ],
                requestBody: {
                    description: "Dados a serem atualizados",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string",
                                        example: "John Doe Updated",
                                    },
                                    email: {
                                        type: "string",
                                        format: "email",
                                        example: "johnnew@example.com",
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    "200": {
                        description: "Usuário atualizado com sucesso",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/User",
                                },
                            },
                        },
                    },
                    "400": {
                        description: "Dados inválidos",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                    "401": {
                        description: "Não autorizado",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Usuário não encontrado",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                    "500": {
                        description: "Erro interno do servidor",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
            delete: {
                tags: ["Users"],
                summary: "Remove um usuário",
                description: "Remove um usuário pelo ID",
                operationId: "deleteUser",
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
                parameters: [
                    {
                        name: "id",
                        in: "path",
                        description: "ID do usuário",
                        required: true,
                        schema: {
                            type: "integer",
                        },
                    },
                ],
                responses: {
                    "204": {
                        description: "Usuário removido com sucesso",
                    },
                    "401": {
                        description: "Não autorizado",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                    "404": {
                        description: "Usuário não encontrado",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                    "500": {
                        description: "Erro interno do servidor",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
