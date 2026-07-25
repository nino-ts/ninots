/**
 * Client entry for the Bun fullstack HMR demo (`/hmr-demo`).
 *
 * Prove client HMR with `import.meta.hot` — distinct from `bun --hot` (server)
 * and from `startRoutesAutoHook` (typed `routes.d.ts` rebuild).
 */

const LABEL = "hmr-ready";

function paintLabel(): void {
    const el = document.getElementById("hmr-label");
    if (el === null) {
        return;
    }
    el.textContent = LABEL;
}

paintLabel();

if (import.meta.hot) {
    import.meta.hot.accept();
}
