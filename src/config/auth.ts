export default {
    /**
     * Default authentication guard
     */
    defaults: {
        guard: 'session',
    },

    /**
     * Authentication guards
     */
    guards: {
        session: {
            driver: 'session',
            provider: 'users',
        },
        token: {
            driver: 'token',
            provider: 'users',
        },
    },

    /**
     * User providers
     */
    providers: {
        users: {
            driver: 'eloquent',
            model: 'User',
        },
    },

    /**
     * Password reset configuration
     */
    passwords: {
        users: {
            provider: 'users',
            table: 'password_reset_tokens',
            expire: 60,
            throttle: 60,
        },
    },
};
