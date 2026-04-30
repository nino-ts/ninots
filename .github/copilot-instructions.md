# Copilot instructions for this repository

## Build, test, and run commands

- Install dependencies: `bun install`
- Start dev server (hot reload): `bun run dev`
- Start production server: `bun run start`
- Build binary: `bun run build`
- Run CLI commands directly: `bun run nino --help`
- Run all tests: `bun test`
- Run a single test file: `bun test src/modules/users/tests/Unit/UserService.test.ts`
- Run a single test by name: `bun test src/modules/users/tests/Unit/UserService.test.ts -t "should create a new user"`

## High-level architecture

- **Runtime shape:** This is a Bun + Ninots app. Entry point is `src/nino.ts`, which defines CLI commands through `@ninots/console` (`serve`, `routes:list`, `cache:clear`).
- **Boot flow:** `serve` calls `bootstrap()` from `src/bootstrap/app.ts`:
  1. create DI container (`createContainer`)
  2. create `Application`
  3. register providers from `src/bootstrap/providers.ts`
  4. call `app.boot()`
  5. build `Bun.serve` options with `loadRoutes(app)` and `loadWebSocketHandlers(app)`
- **Routing model:** Routes are file-based with group layouts under `src/routes/`:
  - `(api)/layout.ts` sets API prefix and middleware
  - `(web)/layout.ts` configures web routes
  - `(ws)/layout.ts` sets WebSocket prefix and middleware
  - `(api)/api.ts` and `(ws)/ws.ts` aggregate module route exports
- **Domain organization:** Features live under `src/modules/<domain>/` (users, posts, payments, notifications), typically with `routes/`, `services/`, `models/`, and optional `requests/`, `middleware/`, `events/`, `jobs/`, `listeners/`, and tests under `tests/Feature` and `tests/Unit`.

## Key codebase conventions

- Use the `@/` TypeScript path alias for internal imports (`tsconfig.json` maps `@/*` to `src/*`).
- HTTP file routes use exported uppercase method functions (`GET`, `POST`, `PUT`, `DELETE`) and `RouteContext<'/path/[param]'>` for typed dynamic params.
- Validation for route handlers is done with `@Validate(...)` decorators plus request classes in `src/modules/*/requests` that extend `FormRequest` from `@ninots/validation`.
- Business logic belongs in `*Service` classes; route handlers/controllers delegate to services rather than embedding domain logic.
- DI uses decorators from `@ninots/container` (`@Inject()`), often injecting model classes (`typeof User`, `typeof Post`) into services.
- ORM models use decorators from `@ninots/orm` (`@Table`, `@Column`) and follow a `fill(...)` + `save()` pattern in services.
