import { notificationRoutes } from "@/modules/notifications/routes/api";
import { paymentRoutes } from "@/modules/payments/routes/api";
import { postRoutes } from "@/modules/posts/routes/api";
import { userRoutes } from "@/modules/users/routes/api";

/**
 * Aggregate all API routes from modules.
 */
export const apiRoutes = {
    ...userRoutes,
    ...postRoutes,
    ...paymentRoutes,
    ...notificationRoutes,
};
