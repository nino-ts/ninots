# Copilot instructions for this repository

## Build, test, and run commands

- Install dependencies: `bun install`
- Start dev server (hot reload): `bun run dev`
- Start production server: `bun run start`
- Build binary: `bun run build`
- Run CLI commands directly: `bun run nino --help`
- Compile typed route registry: `bun run nino routes:compile` (writes `types/routes.d.ts`)
- Run all tests: `bun test`
- Type-check: `bun run type-check`
- Verify route type fail-fixtures: `bun run verify:route-types`

## High-level architecture

- **Runtime shape:** This is a Bun + Ninots app. Entry point is `nino` (wrapper → `bootstrap/cli.ts`), which defines CLI commands through `@ninots/console` (`serve`, `routes:list`, `routes:compile`, `cache:clear`, `make:*`, `migrate*`).
- **Boot flow:** `serve` calls `bootstrap()` from `bootstrap/app.ts`:
  1. create DI container
  2. create `Application` (foundation wires router + `setRouteResolver`)
  3. register providers from `bootstrap/providers.ts`
  4. call `app.boot()`
  5. build `Bun.serve` options from the application HTTP handler
- **Routing model:** Fluent registration under `routes/web.ts` and `routes/api.ts` (Laravel-like). Named routes use `.name("recurso.ação")`. Typed URLs via `route(name, params?)` and the committed artifact `types/routes.d.ts` (module augmentation of `RouteRegistry`). File-based `loadRoutes` exists in `@ninots/routing` but is experimental and not wired here.
- **Domain organization:** App code lives under `app/` (Http/Controllers, Models, Providers, Modules). Views under `resources/views/`. Config under `config/`.

## Key codebase conventions

- Use the `@/` TypeScript path alias for internal imports (`tsconfig.json` maps `@/*` to `./*`).
- Prefer fluent `Router` APIs; keep route names in sync with `nino routes:compile`.
- Validation uses `@ninots/validation` where applicable.
- Business logic belongs in services/controllers; route handlers stay thin.
- DI uses the container from `@ninots/container` / foundation `Application`.
- ORM models use `@ninots/orm` (`@Table`, etc.).
