# Agent / contributor notes for the Ninots starter

## Commands

- Install: `bun run deps:fetch && bun install` (fetches `@ninots/view` via `.deps/` — not on npm yet)
- Hub override (optional): after install, `bun link @ninots/framework` / `bun link @ninots/view` against a local `framework/` clone
- Dev server: `bun run dev` (`nino serve` + hot reload)
- Production: `bun run start` or Docker (`docker compose up --build`)
- CLI: `bun run nino --help` (wrapper `./nino` → `bootstrap/cli.ts`)
- Typed routes: `bun run nino routes:compile` → `types/routes.d.ts`
- Verify route fail-fixtures: `bun run verify:route-types`
- Tests: `bun test` · Types: `bun run type-check` · Lint: `bun run lint`

## Architecture

- **Runtime:** Bun + `@ninots/framework` starter app
- **Boot:** `serve` → `bootstrap()` in `bootstrap/app.ts` (container → Application → providers → `app.boot()` → `Bun.serve`)
- **Routing:** Fluent only under `routes/web.ts` and `routes/api.ts`. Named routes + `route()` + committed `types/routes.d.ts`. File-based `loadRoutes` is experimental and **not** wired here.
- **Layout:** Laravel-like root — `app/`, `bootstrap/`, `config/`, `routes/`, `resources/views/`, `database/`
- **Alias:** `@/*` → project root (not `src/`)

## CEO gates

- Zero `any` (explicit or implicit)
- Zero suppressions (`biome-ignore`, `@ts-ignore`, `@ts-expect-error`, `eslint-disable`)
- Zero new runtime deps outside `@ninots/*`
- Merge PRs with regular merge only (never squash/rebase)
