import { generateCsrfToken, resolveCsrfConfig, resolveSessionId, route, withSessionCookie } from "@ninots/framework";
import { render } from "@ninots/view";
import type { Router } from "@ninots/framework";
import { Welcome } from "@/resources/views/welcome";
import { ContactForm } from "@/resources/views/contact";
import { ContactThanks } from "@/resources/views/contact-thanks";
import csrfConfig from "@/config/csrf";

// -- nino:web-imports --

const csrfOptions = {
    secret: csrfConfig.secret,
    sessionCookieName: csrfConfig.sessionCookie,
    tokenFieldName: csrfConfig.tokenField,
};

function getCsrfConfig() {
    return resolveCsrfConfig(csrfOptions);
}

/**
 * Web routes (HTML pages rendered via @ninots/view).
 */
export function registerWebRoutes(router: Router): void {
    router.group({ middleware: ["web"] }, () => {
        // -- nino:web-bindings --
        router
            .get("/", () =>
                render(Welcome, {
                    contactHref: route("contact.create"),
                    subtitle: "Laravel-like DX on Bun.",
                }),
            )
            .name("home");

        router
            .get("/contact", async (request: Request) => {
                const config = getCsrfConfig();
                const session = resolveSessionId(request, config.sessionCookieName);
                const token = generateCsrfToken(session.sessionId, config);
                const response = await render(ContactForm, {
                    csrfToken: token,
                    formAction: route("contact.store"),
                });

                return withSessionCookie(response, session, config.sessionCookieName);
            })
            .name("contact.create");

        router
            .post("/contact", async (request: Request) => {
                const formData = await request.formData();
                const message = String(formData.get("message") ?? "").trim();

                return render(ContactThanks, { message: message || "(empty message)" });
            })
            .name("contact.store");

        // -- nino:web-routes --
    });
}
