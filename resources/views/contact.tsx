import { withLayout, csrfField } from "@ninots/view";
import { AppLayout } from "@/resources/views/layouts/app";

export interface ContactFormProps {
    csrfToken?: string;
}

function ContactFormPage({ csrfToken = "" }: ContactFormProps) {
    return (
        <section className="welcome contact-form">
            <h1>Contact</h1>
            <p>Send us a message — protected by CSRF middleware.</p>
            <form method="post" action="/contact" className="stack-form">
                <div dangerouslySetInnerHTML={{ __html: csrfField(csrfToken) }} />
                <label className="field">
                    <span className="field-label">Message</span>
                    <textarea name="message" required rows={4} placeholder="Say hello..." />
                </label>
                <button type="submit" className="button-primary">
                    Send message
                </button>
            </form>
        </section>
    );
}

export const ContactForm = withLayout(AppLayout, ContactFormPage, { title: "Contact — Ninots" });
