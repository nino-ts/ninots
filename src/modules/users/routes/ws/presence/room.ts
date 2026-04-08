import type { WSRoom, WSMessage, WSClient } from '@ninots/websocket';

/**
 * User presence WebSocket handlers.
 *
 * WebSocket /ws/users/presence
 */
export const userPresenceWS = {
    /**
     * Called when a client connects.
     *
     * @param room - The WebSocket room
     * @param client - The connected client
     */
    async open(room: WSRoom, client: WSClient): Promise<void> {
        room.broadcast({
            type: 'user_online',
            userId: client.data?.userId,
            timestamp: Date.now(),
        });
    },

    /**
     * Called when a message is received.
     *
     * @param room - The WebSocket room
     * @param client - The client that sent the message
     * @param message - The received message
     */
    async message(room: WSRoom, client: WSClient, message: WSMessage): Promise<void> {
        const { action } = message as Record<string, string>;

        if (action === 'ping') {
            client.send({ type: 'pong', timestamp: Date.now() });
        }
    },

    /**
     * Called when a client disconnects.
     *
     * @param room - The WebSocket room
     * @param client - The disconnected client
     */
    async close(room: WSRoom, client: WSClient): Promise<void> {
        room.broadcast({
            type: 'user_offline',
            userId: client.data?.userId,
            timestamp: Date.now(),
        });
    },
};

/**
 * Export handlers for WebSocket routing.
 */
export const userWSHandlers = {
    '/users/presence': userPresenceWS,
};
