import { WebSocket } from 'ws';

// Store active WebSocket connections (userId -> WebSocket)
const clients = new Map<string, WebSocket>();

export const websocketUtils = {
  clients,
};