import type { WSClient, WSMessage, WSRoom } from "@ninots/websocket";

/**
 * Post module WebSocket handlers.
 */
export const postWSHandlers = {
    "/posts": {
        async open(_room: WSRoom, _client: WSClient): Promise<void> {},
        async message(_room: WSRoom, _client: WSClient, _message: WSMessage): Promise<void> {},
        async close(_room: WSRoom, _client: WSClient): Promise<void> {},
    },
};
