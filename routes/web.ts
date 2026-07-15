import {
    generateCsrfToken,
    resolveCsrfConfig,
    resolveSessionId,
    withSessionCookie,
} from "@ninots/framework";
import { render } from "@ninots/view";
import type { Router } from "@ninots/framework";
import { Welcome } from "@/resources/views/welcome";
import { ContactForm } from "@/resources/views/contact";
import { ContactThanks } from "@/resources/views/contact-thanks";
import csrfConfig from "@/config/csrf";

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
        router.get("/", () =>
            render(Welcome, {
                subtitle: "Laravel-like DX on Bun.",
            }),
        );

        router.get("/contact", async (request) => {
            const config = getCsrfConfig();
            const session = resolveSessionId(request, config.sessionCookieName);
            const token = generateCsrfToken(session.sessionId, config);
            const response = await render(ContactForm, { csrfToken: token });

            return withSessionCookie(response, session, config.sessionCookieName);
        });

        router.post("/contact", async (request) => {
            const formData = await request.formData();
            const message = String(formData.get("message") ?? "").trim();

            return render(ContactThanks, { message: message || "(empty message)" });
        });
    });
}
