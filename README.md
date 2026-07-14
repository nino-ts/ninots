# Ninots

`ninots` is the official **starter kit** for the Nino ecosystem. It provides a production-ready project structure on top of **Bun** and **TypeScript** using `@ninots/framework`.

Nino focuses on developer experience inspired by Laravel and Next.js, while remaining its own framework and API design (not a compatibility layer for either).

## Ecosystem Overview

- **Organization:** [nino-ts](https://github.com/nino-ts)
- **Maintainer organization:** [pandowLABS](https://github.com/pandowlabs)
- **Starter kit (this repository):** `nino-ts/ninots`
- **Framework meta-package:** `nino-ts/framework`

The framework is modular and monorepo-based (multiple internal packages with clear boundaries, such as HTTP, routing, ORM, container, foundation, etc.).  
`ninots` consumes those capabilities as an application template.

## Core Principles

- **Bun-native runtime:** built for Bun APIs first
- **Strict TypeScript:** strongly typed project structure
- **Modular architecture:** domain modules can be reused across projects
- **Pragmatic wrappers:** use native Bun resources whenever possible, with lightweight abstractions where they improve DX
- **Scalable structure:** suitable for small apps and large modular systems

## Requirements

- [Bun](https://bun.sh/) (latest stable recommended)

## Quickstart

```bash
# 1) Install dependencies
bun install

# 2) Start development server (hot reload)
bun run dev

# 3) Start production mode
bun run start

# 4) Build binary
bun run build

# 5) Explore CLI commands
bun run nino --help
```

## Available Commands

| Command | Description |
| --- | --- |
| `bun run dev` | Runs `src/nino.ts serve` with hot reload |
| `bun run start` | Starts server in production mode |
| `bun run build` | Builds a compiled binary (`ninots`) |
| `bun run nino --help` | Lists CLI commands |
| `bun test` | Runs all tests |

## Architecture

### Boot Flow

`src/nino.ts` is the CLI entrypoint. The `serve` command:

1. Calls `bootstrap()` from `src/bootstrap/app.ts`
2. Creates container + application instance
3. Registers providers from `src/bootstrap/providers.ts`
4. Boots the app
5. Starts `Bun.serve(...)` with generated options

### Routing Model

Routes are grouped by layout under `src/routes/`:

- `(api)` for HTTP API routes (with `/api` prefix and middleware)
- `(web)` for web routes
- `(ws)` for WebSocket routes (with `/ws` prefix and middleware)

Route aggregates compose module routes (users, posts, payments, notifications).

### Domain Modules

Application features live in `src/modules/<domain>/` and usually contain:

- `routes/`
- `services/`
- `models/` (when applicable)
- optional domain concerns (`middleware`, `events`, `jobs`, `listeners`, `requests`, `tests`)

### TypeScript Aliases

This project uses `@/* -> src/*` path mapping.

## Project Structure (High Level)

```text
src/
  bootstrap/      # app/container bootstrapping and provider registration
  config/         # runtime configuration
  modules/        # domain modules (users, posts, payments, notifications, ...)
  routes/         # route groups: (api), (web), (ws)
  shared/         # shared providers and HTTP middleware
  nino.ts         # CLI entrypoint
tests/
  setup.ts        # Bun test preload setup
```

## Development and Testing

```bash
# Run all tests
bun test

# Run a single test file
bun test src/modules/users/tests/Unit/UserService.test.ts

# Run a test by name
bun test src/modules/users/tests/Unit/UserService.test.ts -t "should create a new user"
```

## Maintainers

- João Vitor de Jesus Oliveira ([site](https://joaovjo.com.br), [GitHub](https://github.com/joaovjo))
- Victor Geruso ([site](https://geruso.com), [GitHub](https://github.com/vgeruso))

## Contributing

Issues and pull requests are welcome in the [nino-ts organization](https://github.com/nino-ts).

## License

Nino is open-source software released under the MIT License.
