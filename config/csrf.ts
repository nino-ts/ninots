export default {
    secret: Bun.env.CSRF_SECRET ?? "ninots-dev-csrf-secret",
    sessionCookie: Bun.env.CSRF_SESSION_COOKIE ?? "ninots_session",
    tokenField: "_token",
};
