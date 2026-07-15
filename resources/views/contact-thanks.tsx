import { withLayout } from "@ninots/view";
import { AppLayout } from "@/resources/views/layouts/app";

export interface ContactThanksProps {
    message?: string;
}

function ContactThanksPage({ message = "" }: ContactThanksProps) {
    return (
        <section className="welcome contact-form">
            <h1>Thanks!</h1>
            <p className="success-note">Your message was received.</p>
            <blockquote className="message-preview">{message}</blockquote>
            <p>
                <a href="/contact">Send another message</a>
            </p>
        </section>
    );
}

export const ContactThanks = withLayout(AppLayout, ContactThanksPage, { title: "Message sent — Ninots" });
