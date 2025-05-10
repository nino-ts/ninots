**Ninots Framework v0.1.0**

***

# Ninots Framework

Framework TypeScript para Bun inspirado no Laravel

```ts
// Exemplo de uso:
import { Router } from './app/http/Router';
import { Container } from './app/providers/Container';

// Registrar dependências
Container.bind('UserService', UserService);

// Definir rotas
Router.get('/users', 'UserController@index');

// Iniciar servidor
Router.serve(3000);
```

## Instalação
```bash
bun install ninots
```

## Documentação
[Ver documentação completa](./docs)
