# Ninots starter — agent notes

## How to run

- Install: `bun install` (resolves `@ninots/*@^0.0.1` from npm)
- Hub override (optional): `bun link @ninots/<name>` against local `packages/<name>/`
- Dev: `bun run dev` / `bun run nino serve`
- Tests: `bun test`
- Type-check: `bun run type-check`

## Constraints

- **Runtime:** Bun + direct `@ninots/*` packages (no `@ninots/framework` umbrella in consumer)
- **DX:** TypeScript sources via Bun (`noEmit`); no JS-emit pipeline
- **Unsupported clients:** npm client, Node.js, yarn, pnpm (registry hosts only)
- Zero new runtime deps outside `@ninots/*`
- Ban `any`; zero suppressions (`biome-ignore`, `@ts-ignore`, `@ts-expect-error`, `eslint-disable`)

## Layout

- `bootstrap/` — app + CLI bootstrap
- `app/` — HTTP, providers, models, services
- `routes/` — web + api
- `resources/views/` — TSX via `@ninots/view`
- `nino` — shebang wrapper → `bootstrap/cli.ts`
