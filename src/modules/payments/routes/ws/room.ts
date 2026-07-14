import type { WSClient, WSMessage, WSRoom } from "@ninots/websocket";

/**
 * Payment module WebSocket handlers.
 */
export const paymentWSHandlers = {
    "/payments": {
        async open(_room: WSRoom, _client: WSClient): Promise<void> {},
        async message(_room: WSRoom, _client: WSClient, _message: WSMessage): Promise<void> {},
        async close(_room: WSRoom, _client: WSClient): Promise<void> {},
    },
};
