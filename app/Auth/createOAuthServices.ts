import type { ProviderConfig } from "@ninots/social-auth";
import { OAuthManager } from "@ninots/social-auth";

/**
 * Optional OAuth / social-auth wiring for the starter.
 * Compose in the app only — `@ninots/auth` does not import `@ninots/social-auth`.
 *
 * Env keys (see `.env.example`): GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URI.
 */
export const OAUTH_MANAGER_KEY = "ninots.oauth";

export function createOAuthManager(): OAuthManager | null {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri = process.env.GITHUB_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        return null;
    }

    const github: ProviderConfig = {
        clientId,
        clientSecret,
        redirectUri,
        scopes: ["read:user", "user:email"],
        usePkce: true,
    };

    return new OAuthManager({ github });
}
