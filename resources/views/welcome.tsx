import { withLayout } from "@ninots/view";
import { AppLayout } from "@/resources/views/layouts/app";

export interface WelcomeProps {
    subtitle?: string;
    contactHref?: string;
}

function WelcomePage({
    subtitle = "Your application is ready. Start building in routes/web.ts.",
    contactHref = "/contact",
}: WelcomeProps) {
    return (
        <section className="welcome">
            <h1>Welcome to Ninots</h1>
            <p>
                {subtitle} Explore <strong>api</strong>, <strong>web</strong>, and <strong>websocket</strong> surfaces. Try the{" "}
                <a href={contactHref}>contact form</a>.
            </p>
        </section>
    );
}

export const Welcome = withLayout(AppLayout, WelcomePage, { title: "Ninots" });
