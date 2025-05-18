# Ninots Framework

Framework backend modular e escalável construído com Bun.js e TypeScript, focado em alta performance e manutenibilidade.

```ts
// Exemplo de uso:
import { initDatabase } from "ninots";
import { User } from "./src/core/domain/entities/user.entity";
import { UserRepositoryImpl } from "./src/core/infrastructure/database/orm/repositories/user.repository.impl";

async function bootstrap() {
    // Inicializar banco de dados
    const dbAdapter = await initDatabase();

    // Usar repositório
    const userRepository = new UserRepositoryImpl();

    // Criar e salvar um usuário
    const user = new User();
    user.name = "João";
    user.email = "joao@exemplo.com";
    user.password = "senha123";
    await userRepository.save(user);

    // Buscar todos os usuários
    const users = await userRepository.findAll();
    console.log(users);
}

bootstrap();
```

## Instalação

```bash
bun add ninots
```

## Características

-   **Arquitetura Limpa**: Separação clara entre domínio, aplicação, interfaces e infraestrutura
-   **Integração ORM**: Integração perfeita com Ninorm para mapeamento objeto-relacional
-   **Design Modular**: Componentes independentes e altamente testáveis
-   **Alta Performance**: Construído sobre Bun.js para máximo desempenho
-   **TypeScript First**: Desenvolvido para tirar proveito total do TypeScript
-   **Escalável**: Projetado para crescer com sua aplicação

## Estrutura do Projeto

```
src/
├── core/                     # Núcleo do framework
│   ├── application/          # Lógica de aplicação
│   ├── domain/               # Regras de negócio e entidades
│   ├── interfaces/           # Adaptadores e interfaces externas
│   └── infrastructure/       # Implementações de infraestrutura
├── shared/                   # Código compartilhado
├── config/                   # Configurações da aplicação
├── container/                # Container de inversão de dependência
└── bootstrap/                # Inicialização da aplicação
```

## Documentação

[Ver documentação completa](./docs)
