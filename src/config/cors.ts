export default {
    /**
     * Allowed HTTP methods
     */
    allowedMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    /**
     * Allowed headers
     */
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],

    /**
     * Allowed origins
     */
    allowedOrigins: ["http://localhost:3000"],

    /**
     * Exposed headers
     */
    exposedHeaders: ["X-Request-Id"],

    /**
     * Max age for preflight cache
     */
    maxAge: 3600,

    /**
     * Allow credentials
     */
    credentials: true,
};
