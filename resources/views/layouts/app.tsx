const APP_STYLES = `
:root {
    color-scheme: light dark;
    --bg: #0f172a;
    --surface: #1e293b;
    --text: #f8fafc;
    --muted: #94a3b8;
    --accent: #38bdf8;
    --border: #334155;
}

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    min-height: 100vh;
    font-family: "Segoe UI", system-ui, sans-serif;
    background: radial-gradient(circle at top, #1e3a5f 0%, var(--bg) 55%);
    color: var(--text);
}

.site-header,
.site-footer,
.site-main {
    width: min(960px, calc(100% - 2rem));
    margin-inline: auto;
}

.site-header {
    padding: 2rem 0 1rem;
    border-bottom: 1px solid var(--border);
}

.brand {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
}

.tagline {
    margin: 0.35rem 0 0;
    color: var(--muted);
}

.site-main {
    padding: 2.5rem 0 3rem;
}

.welcome {
    background: color-mix(in srgb, var(--surface) 88%, transparent);
    border: 1px solid var(--border);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.35);
}

.welcome h1 {
    margin: 0 0 0.75rem;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
}

.welcome p {
    margin: 0;
    color: var(--muted);
    line-height: 1.6;
}

.welcome strong {
    color: var(--accent);
}

.site-footer {
    padding: 1.5rem 0 2rem;
    border-top: 1px solid var(--border);
    color: var(--muted);
    font-size: 0.95rem;
}
`;

export interface AppLayoutProps {
    title: string;
    children: string;
}

export function AppLayout({ title, children }: AppLayoutProps) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>{title}</title>
                <style dangerouslySetInnerHTML={{ __html: APP_STYLES }} />
            </head>
            <body>
                <header className="site-header">
                    <p className="brand">Ninots</p>
                    <p className="tagline">Laravel-like starter on Bun</p>
                </header>
                <main className="site-main" dangerouslySetInnerHTML={{ __html: children }} />
                <footer className="site-footer">
                    <p>Built with Bun + TypeScript</p>
                </footer>
            </body>
        </html>
    );
}
