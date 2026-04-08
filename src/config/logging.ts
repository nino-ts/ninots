export default {
    /**
     * Default logging channel
     */
    default: 'stack',

    /**
     * Logging channels
     */
    channels: {
        stack: {
            driver: 'stack',
            channels: ['single', 'stderr'],
        },
        single: {
            driver: 'single',
            path: 'storage/logs/ninots.log',
            level: 'debug',
        },
        stderr: {
            driver: 'stderr',
            level: 'error',
        },
    },
};
