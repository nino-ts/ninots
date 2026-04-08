import type { WSRoom, WSMessage, WSClient } from '@ninots/websocket';

/**
 * Payment module WebSocket handlers.
 */
export const paymentWSHandlers = {
    '/payments': {
        async open(room: WSRoom, client: WSClient): Promise<void> {
            console.log(`Client connected to payments room: ${client.id}`);
        },
        async message(room: WSRoom, client: WSClient, message: WSMessage): Promise<void> {
            console.log(`Message in payments room: ${message}`);
        },
        async close(room: WSRoom, client: WSClient): Promise<void> {
            console.log(`Client disconnected from payments room: ${client.id}`);
        },
    },
};
