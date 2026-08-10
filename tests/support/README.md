# Feature test support

Helpers for Feature tests in this starter. Prefer these over raw `bootstrap` + `Bun.serve` boilerplate.

## HTTP (`http.ts`)

```ts
import { describe, expect, test } from "bun:test";
import { assertJson, assertStatus, createTestApp } from "../support/http";

describe("example", () => {
    test("GET /health", async () => {
        const t = await createTestApp();
        try {
            const response = await t.get("/health");
            assertStatus(response, 200);
            await assertJson(response, { status: "ok", service: "ninots" });
        } finally {
            t.stop();
        }
    });
});
```

| Helper | Role |
|--------|------|
| `createTestApp()` | `bootstrap` + serve on `127.0.0.1:0` → `{ app, baseUrl, get, post, stop }` |
| `get` / `post` | `fetch` wrappers (`headers` / `body` opcionais) |
| `assertStatus` | status HTTP |
| `assertJson` | body JSON + Content-Type |
| `responseText` | corpo texto (HTML) |

## Database (`database.ts`)

`setupTestDatabase()` / `teardownTestDatabase()` — SQLite in-memory + migrations (ORM Feature tests).

## Notes

- Runtime: **Bun only** (`bun:test` + APIs Bun). Sem deps npm extras de testing.
- Package `@ninots/testing` **não** existe neste horizonte — DX fica no skeleton (mesmo padrão `./nino` vs `@ninots/cli`).
