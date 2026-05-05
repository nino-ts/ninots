import type { LayoutConfig } from '@ninots/routing';
import { cors } from '@/shared/Http/Middleware/CorsMiddleware';

/**
 * API layout configuration.
 * Applied to all routes under (api)/
 */
export const layout: LayoutConfig = {
    middleware: [cors],
    prefix: '/api',
};
