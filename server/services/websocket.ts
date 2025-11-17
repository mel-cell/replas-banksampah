import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";

// Store WebSocket connections by machine code
const wsConnections = new Map<string, any>();
// Store admin WebSocket connections
const adminWsConnections = new Set<any>();

export const websocketService = {
  // Initialize WebSocket server
  createWebSocketServer: (app: Hono) => {
    const { upgradeWebSocket } = createBunWebSocket();

    // Room-specific WebSocket for users
    app.get("/ws/room/:machineCode", upgradeWebSocket((c) => {
      const machineCode = c.req.param("machineCode") || "unknown";

      return {
        onOpen: (event, ws) => {
          console.log(`WebSocket connection established for machine: ${machineCode}`);
          wsConnections.set(machineCode, ws);

          // Send initial connection confirmation
          ws.send(JSON.stringify({
            type: "connected",
            machineCode,
            timestamp: new Date().toISOString()
          }));
        },
        onMessage: (event, ws) => {
          console.log(`WebSocket message from ${machineCode}:`, event.data);
          // Handle incoming messages if needed
        },
        onClose: (event, ws) => {
          console.log(`WebSocket connection closed for machine: ${machineCode}`);
          wsConnections.delete(machineCode);
        },
        onError: (event, ws) => {
          console.error(`WebSocket error for machine ${machineCode}:`, event);
          wsConnections.delete(machineCode);
        }
      };
    }));

    // Admin WebSocket for global room monitoring
    app.get("/ws/admin/rooms", upgradeWebSocket((c) => {
      return {
        onOpen: (event, ws) => {
          console.log("Admin WebSocket connection established for room monitoring");
          adminWsConnections.add(ws);

          // Send initial connection confirmation
          ws.send(JSON.stringify({
            type: "admin_connected",
            timestamp: new Date().toISOString()
          }));
        },
        onMessage: (event, ws) => {
          console.log("Admin WebSocket message:", event.data);
          // Handle admin commands if needed
        },
        onClose: (event, ws) => {
          console.log("Admin WebSocket connection closed");
          adminWsConnections.delete(ws);
        },
        onError: (event, ws) => {
          console.error("Admin WebSocket error:", event);
          adminWsConnections.delete(ws);
        }
      };
    }));
  },

  // Send bottle count update to specific machine's WebSocket clients
  sendBottleUpdate: (machineCode: string, bottleCount: number, points: number) => {
    const ws = wsConnections.get(machineCode);
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        type: "bottle_update",
        machineCode,
        bottleCount,
        points,
        timestamp: new Date().toISOString()
      });

      try {
        ws.send(message);
        console.log(`Sent bottle update to ${machineCode}: ${bottleCount} bottles, ${points} points`);
      } catch (error) {
        console.error(`Failed to send WebSocket message to ${machineCode}:`, error);
        wsConnections.delete(machineCode);
      }
    } else {
      console.log(`No active WebSocket connection for machine ${machineCode}`);
    }
  },

  // Send session status update
  sendSessionUpdate: (machineCode: string, status: string, message?: string) => {
    const ws = wsConnections.get(machineCode);
    if (ws && ws.readyState === WebSocket.OPEN) {
      const updateMessage = JSON.stringify({
        type: "session_update",
        machineCode,
        status,
        message,
        timestamp: new Date().toISOString()
      });

      try {
        ws.send(updateMessage);
        console.log(`Sent session update to ${machineCode}: ${status}`);
      } catch (error) {
        console.error(`Failed to send session update to ${machineCode}:`, error);
        wsConnections.delete(machineCode);
      }
    }
  },

  // Broadcast room status update to all admin WebSocket clients
  broadcastRoomUpdate: (roomData: {
    roomCode: string;
    status: string;
    bottleCount?: number;
    points?: number;
    connected: boolean;
    issue?: string;
    lastActivity?: string;
    currentUser?: string;
    location?: string;
  }) => {
    const message = JSON.stringify({
      type: "room_update",
      ...roomData,
      timestamp: new Date().toISOString()
    });

    let sentCount = 0;
    adminWsConnections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(message);
          sentCount++;
        } catch (error) {
          console.error("Failed to send room update to admin WS:", error);
          adminWsConnections.delete(ws);
        }
      }
    });

    console.log(`Broadcasted room update for ${roomData.roomCode} to ${sentCount} admin clients`);
  },

  // Get connection count for monitoring
  getConnectionCount: () => {
    return wsConnections.size;
  },

  // Get connected machines
  getConnectedMachines: () => {
    return Array.from(wsConnections.keys());
  },

  // Get admin connection count
  getAdminConnectionCount: () => {
    return adminWsConnections.size;
  }
};

// Export for use in other modules
export default websocketService;
