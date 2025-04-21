import { z } from 'zod';

export const ConfigSchema = z.object({
    app: z.object({
        name: z.string().default('Ninots App'),
        port: z.number().default(3000),
        environment: z.enum(['development', 'production', 'test']).default('development'),
    }),
    cors: z.object({
        enabled: z.boolean().default(true),
        origin: z.string().or(z.array(z.string())).default('*'),
    }),
});

export type Config = z.infer<typeof ConfigSchema>;

export const loadConfig = (): Config => {
    return ConfigSchema.parse({
        app: {
            name: process.env.APP_NAME,
            port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
            environment: process.env.NODE_ENV,
        },
        cors: {
            enabled: process.env.CORS_ENABLED === 'true',
            origin: process.env.CORS_ORIGIN,
        },
    });
}; 