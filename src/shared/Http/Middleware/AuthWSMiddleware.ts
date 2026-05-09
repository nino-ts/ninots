import type { WSClient } from "@ninots/websocket";

/**
 * WebSocket authentication middleware.
 *
 * Ensures WebSocket connections are authenticated.
 */
export function authWS(_ws: WSClient, next: () => void): void {
    // TODO: Implement WebSocket authentication
    // const token = ws.data?.token;
    // if (!token || !isValidToken(token)) {
    //     ws.close(4001, 'Unauthorized');
    //     return;
    // }
    next();
}
