# Recursos Avançados do Ninots

Este guia aborda os recursos avançados do framework Ninots que ajudarão você a construir aplicações backend robustas e de alta performance.

## WebSockets

O Ninots oferece suporte integrado para WebSockets, permitindo comunicação em tempo real.

### Configurando o servidor WebSocket

```typescript
// Configure o servidor HTTP com suporte a WebSockets
const server = new HttpServer(router, {
    port: 3000,
    websockets: true, // Habilitar suporte a WebSockets
    websocketHandlers: {
        "/chat": chatHandler,
        "/notifications": notificationHandler,
    },
});
```

### Criando um Handler de WebSocket

```typescript
// Definir um handler de WebSocket
const chatHandler: WebSocketHandler = {
    open: (ws) => {
        console.log("Nova conexão de chat estabelecida");
        ws.send(
            JSON.stringify({ type: "welcome", message: "Bem-vindo ao chat!" })
        );
    },

    message: (ws, message) => {
        // Processar mensagem recebida
        let data;
        try {
            data = JSON.parse(message.toString());
        } catch (e) {
            ws.send(
                JSON.stringify({
                    type: "error",
                    message: "Formato de mensagem inválido",
                })
            );
            return;
        }

        // Broadcast para todos os clientes (exemplo)
        server.broadcast(
            "/chat",
            JSON.stringify({
                type: "message",
                author: data.author,
                text: data.text,
                timestamp: new Date(),
            })
        );
    },

    close: (ws, code, reason) => {
        console.log(`Conexão fechada: ${code} - ${reason}`);
    },
};
```

## Sistema de Logging Avançado

O Ninots possui um sistema de logging flexível e configurável.

### Criando um Logger

```typescript
import { LoggerFactory } from "ninots/logging";

// Criar um logger para um módulo específico
const logger = LoggerFactory.create("user-service");

// Usar o logger
logger.info("Inicializando serviço de usuários");
logger.debug("Configurações carregadas", { config });
logger.warn("Tentativa de acesso suspeito", { ip, userId });
logger.error("Falha ao processar pagamento", { error, orderId });
```

### Child Loggers com Contexto

```typescript
// Criar um child logger com contexto adicional
const requestLogger = logger.child({ requestId: "123", userId: "456" });

requestLogger.info("Requisição recebida"); // Inclui automaticamente requestId e userId
```

### Integrações com OpenTelemetry e Sentry

```typescript
import { LoggerFactory } from "ninots/logging";
import { SentryLogger } from "ninots/logging/sentry";
import { OpenTelemetryLogger } from "ninots/logging/opentelemetry";

// Configurar integrações
LoggerFactory.addObservabilityLogger(
    new SentryLogger({
        dsn: "https://your-sentry-dsn",
        environment: "production",
    })
);

LoggerFactory.addObservabilityLogger(
    new OpenTelemetryLogger({
        serviceName: "api-service",
        endpoint: "http://collector:4317",
    })
);
```

## Container de Injeção de Dependências

O Ninots inclui um container de DI poderoso com suporte para diferentes ciclos de vida.

### Registrando Serviços

```typescript
import { container } from "ninots/container";
import { LifecycleType } from "ninots/container/types";

// Registrar como singleton (padrão)
container.register("UserService", UserService);

// Especificar lifecycles
container.register(
    "TransientService",
    TransientService,
    [],
    LifecycleType.TRANSIENT
);
container.register("RequestService", RequestService, [], LifecycleType.SCOPED);
```

### Serviços com Dependências

```typescript
// Registrar com dependências
container.register("OrderService", OrderService, [
    "UserService",
    "PaymentService",
]);
```

### Escopos

```typescript
// Criar escopo para requisição
const requestScope = container.createScope();

// Resolver serviços no escopo
const requestService = requestScope.resolve("RequestService");
```

## Migração Automática do Banco de Dados

Ninots integra-se com ninorm para oferecer migrações automáticas.

### Configurando Migrações Automáticas

```typescript
import { setupDatabase } from "ninots/database";
import { enableMigrations } from "ninots/database/migrations";

// Habilitar migrações automáticas
await setupDatabase({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "myapp",
    migrations: {
        enabled: true,
        autoRun: true,
        directory: "./src/migrations",
    },
});
```

### Gerando uma Migração

```typescript
import { MigrationGenerator } from "ninots/database/migrations";

// Gerar migração baseada nas mudanças de esquema
await MigrationGenerator.generate({
    name: "AddUserEmail",
    models: [User, Product, Order],
    directory: "./src/migrations",
});
```

## Otimização para Bun.js

Ninots é otimizado para o runtime Bun.js, oferecendo recursos específicos.

### Servindo Arquivos Estáticos

```typescript
// Configuração otimizada para arquivos estáticos
const server = new HttpServer(router, {
    port: 3000,
    publicDir: "./public", // Diretório para arquivos estáticos
    compression: true, // Habilitar compressão
});
```

### Streaming de Respostas

```typescript
// Streaming de arquivo grande
@Get('/download/large-file')
async downloadLargeFile(request: HttpRequest): Promise<HttpResponse> {
  const fileStream = Bun.file('./large-file.zip').stream();

  return {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="large-file.zip"'
    },
    stream: fileStream
  };
}
```

## Segurança Avançada

### Configuração HTTPS/TLS

```typescript
const server = new HttpServer(router, {
    port: 443,
    secure: true,
    certFile: "./certs/cert.pem",
    keyFile: "./certs/key.pem",
});
```

### Limitação de Taxa (Rate Limiting)

```typescript
import { rateLimit } from "ninots/middlewares";

// Aplicar limitação de taxa
router.use(
    rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 100, // limite de 100 requisições por janela
    })
);
```

## Validação com Zod

Ninots integra-se bem com Zod para validação de dados.

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  age: z.number().min(18).optional()
});

@Post('/')
async createUser(request: HttpRequest): Promise<HttpResponse> {
  // Validar dados de entrada
  const result = UserSchema.safeParse(request.body);

  if (!result.success) {
    return {
      status: 400,
      body: { errors: result.error.format() }
    };
  }

  // Dados validados disponíveis em result.data
  const user = await this.userService.createUser(result.data);

  return {
    status: 201,
    body: user
  };
}
```
