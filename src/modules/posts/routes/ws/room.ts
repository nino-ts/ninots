import type { WSRoom, WSMessage, WSClient } from '@ninots/websocket';

/**
 * Post module WebSocket handlers.
 */
export const postWSHandlers = {
    '/posts': {
        async open(room: WSRoom, client: WSClient): Promise<void> {
            console.log(`Client connected to posts room: ${client.id}`);
        },
        async message(room: WSRoom, client: WSClient, message: WSMessage): Promise<void> {
            console.log(`Message in posts room: ${message}`);
        },
        async close(room: WSRoom, client: WSClient): Promise<void> {
            console.log(`Client disconnected from posts room: ${client.id}`);
        },
    },
};
