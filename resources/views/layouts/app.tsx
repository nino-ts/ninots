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

.welcome a {
    color: var(--accent);
}

.site-footer {
    padding: 1.5rem 0 2rem;
    border-top: 1px solid var(--border);
    color: var(--muted);
    font-size: 0.95rem;
}

.stack-form {
    display: grid;
    gap: 1.25rem;
    margin-top: 1.5rem;
}

.field {
    display: grid;
    gap: 0.5rem;
}

.field-label {
    font-weight: 600;
    color: var(--text);
}

.field textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border);
    background: color-mix(in srgb, var(--bg) 70%, var(--surface));
    color: var(--text);
    font: inherit;
    resize: vertical;
}

.field textarea:focus {
    outline: 2px solid color-mix(in srgb, var(--accent) 55%, transparent);
    border-color: var(--accent);
}

.button-primary {
    justify-self: start;
    padding: 0.65rem 1.25rem;
    border: none;
    border-radius: 0.5rem;
    background: linear-gradient(135deg, var(--accent), #0ea5e9);
    color: #0f172a;
    font-weight: 700;
    cursor: pointer;
}

.button-primary:hover {
    filter: brightness(1.05);
}

.success-note {
    color: #86efac;
    font-weight: 600;
}

.message-preview {
    margin: 1rem 0 0;
    padding: 1rem 1.25rem;
    border-left: 4px solid var(--accent);
    background: color-mix(in srgb, var(--surface) 90%, transparent);
    color: var(--text);
}

.contact-form a {
    color: var(--accent);
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
