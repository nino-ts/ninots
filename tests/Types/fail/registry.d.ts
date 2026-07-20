/**
 * Local RouteRegistry for fail-fixture typechecks (mirrors committed artifact shapes).
 *
 * @packageDocumentation
 */

declare module "@ninots/routing" {
    interface RouteRegistry {
        home: Record<never, never>;
        "users.show": { id: string };
    }
}

export {};
