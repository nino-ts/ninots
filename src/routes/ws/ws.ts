import { notificationWSHandlers } from "@/modules/notifications/routes/ws";
import { paymentWSHandlers } from "@/modules/payments/routes/ws";
import { postWSHandlers } from "@/modules/posts/routes/ws";
import { userWSHandlers } from "@/modules/users/routes/ws";

/**
 * Aggregate all WebSocket handlers from modules.
 */
export const wsHandlers = {
    ...userWSHandlers,
    ...postWSHandlers,
    ...paymentWSHandlers,
    ...notificationWSHandlers,
};
