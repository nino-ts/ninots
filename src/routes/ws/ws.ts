import { userWSHandlers } from '@/modules/users/routes/ws';
import { postWSHandlers } from '@/modules/posts/routes/ws';
import { paymentWSHandlers } from '@/modules/payments/routes/ws';
import { notificationWSHandlers } from '@/modules/notifications/routes/ws';

/**
 * Aggregate all WebSocket handlers from modules.
 */
export const wsHandlers = {
    ...userWSHandlers,
    ...postWSHandlers,
    ...paymentWSHandlers,
    ...notificationWSHandlers,
};
