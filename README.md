# Ninots

`ninots` is the official **starter kit** for the Nino ecosystem. It provides a production-ready project structure on top of **Bun** and **TypeScript** using `@ninots/framework`.

Nino focuses on developer experience inspired by Laravel and Next.js, while remaining its own framework and API design (not a compatibility layer for either).

## Ecosystem Overview

- **Organization:** [nino-ts](https://github.com/nino-ts)
- **Maintainer organization:** [pandowLABS](https://github.com/pandowlabs)
- **Starter kit (this repository):** `nino-ts/ninots`
- **Framework meta-package:** `nino-ts/framework`

## Requirements

- [Bun](https://bun.sh/) (latest stable recommended)
- Optional: [Docker Desktop](https://www.docker.com/products/docker-desktop/) for `docker compose up`

## Quickstart (local Bun)

```bash
# 1) Resolve @ninots/view (file dep via .deps/) + install
bun run deps:fetch
bun install

# 2) Copy env
cp .env.example .env

# 3) Dev server (hot reload)
bun run dev

# 4) Explore CLI
bun run nino --help
```

Hub developers (local `framework/` sibling) can optionally override with `bun link` after install.

### Typed routes

```bash
bun run nino routes:compile   # writes types/routes.d.ts
bun run verify:route-types    # fail-fixture checks
```

Named routes use `.name("recurso.ação")`; typed URLs via `route(name, params?)`.

## Docker (compose)

Default stack: **app + SQLite volume** (no extra DB container).

```bash
cp .env.example .env
docker compose up --build -d
# smoke: curl -sf http://localhost:3000/  → HTTP 200
docker compose down
```

Optional **Postgres** profile:

```bash
docker compose --profile postgres up --build -d
# app-postgres uses DB_CONNECTION=postgres → host `postgres`
docker compose --profile postgres down
```

Entry command: `./nino serve --port 3000` (wrapper → `bootstrap/cli.ts`).

## Available Commands

| Command | Description |
| --- | --- |
| `bun run deps:fetch` | Ensure `.deps/ninots-framework` (hub link or git clone) |
| `bun run dev` | `nino serve` with hot reload |
| `bun run start` | Production-style serve |
| `bun run build` | Compiled binary (`ninots`) |
| `bun run nino --help` | CLI help |
| `bun test` | All tests |
| `bun run type-check` | `tsc --noEmit` |
| `bun run lint` | Biome check |
| `docker compose up --build` | Containerized app (SQLite volume) |

## Architecture

### Boot flow

`nino` (wrapper → `bootstrap/cli.ts`) is the CLI entrypoint. The `serve` command:

1. Calls `bootstrap()` from `bootstrap/app.ts`
2. Creates container + application instance
3. Registers providers from `bootstrap/providers.ts`
4. Boots the app
5. Starts `Bun.serve(...)` with generated options

### Routing

Fluent registration under `routes/web.ts` and `routes/api.ts` (Laravel-like). File-based `loadRoutes` exists in `@ninots/routing` but is **not** wired in this starter.

### Layout

```text
app/              # Http, Models, Providers, …
bootstrap/        # app.ts, cli.ts, providers
config/           # runtime configuration
routes/           # web, api, console
resources/views/  # TSX views (@ninots/view)
database/         # migrations, seeders
types/            # routes.d.ts (compile artifact)
nino              # CLI wrapper → bootstrap/cli.ts
Dockerfile        # Bun official image
compose.yaml      # SQLite default; postgres profile
```

Path alias: `@/*` → project root.

## Development and Testing

```bash
bun test
bun run type-check
bun run verify:route-types
bun run lint
```

## CEO gates (contributions)

- Zero `any` (explicit or implicit)
- Zero suppressions (`biome-ignore`, `@ts-ignore`, `@ts-expect-error`, `eslint-disable`)
- Zero new runtime deps outside `@ninots/*`
- See `AGENTS.md` for agent-oriented notes

## Maintainers

- João Vitor de Jesus Oliveira ([site](https://joaovjo.com.br), [GitHub](https://github.com/joaovjo))
- Victor Geruso ([site](https://geruso.com), [GitHub](https://github.com/vgeruso))

## Contributing

Issues and pull requests are welcome in the [nino-ts organization](https://github.com/nino-ts).

## License

Nino is open-source software released under the MIT License.
