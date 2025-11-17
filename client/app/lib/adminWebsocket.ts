export class AdminWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor() {
    this.connect = this.connect.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("Admin WebSocket already connected");
      return;
    }

    // Use current window location for dynamic WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/admin/rooms`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = (event) => {
        console.log("Admin WebSocket connected for room monitoring");
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
      };

      this.ws.onmessage = this.handleMessage;
      this.ws.onclose = this.handleClose;
      this.ws.onerror = this.handleError;

    } catch (error) {
      console.error("Admin WebSocket connection error:", error);
      this.scheduleReconnect();
    }
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      console.log("Admin WebSocket message received:", data);

      // Call registered handlers
      const handler = this.messageHandlers.get(data.type);
      if (handler) {
        handler(data);
      }

      // Handle specific message types
      switch (data.type) {
        case "admin_connected":
          console.log("Connected to admin monitoring");
          break;
        case "room_update":
          console.log(`Room update: ${data.roomCode} - ${data.status}`);
          break;
        default:
          console.log("Unknown admin message type:", data.type);
      }
    } catch (error) {
      console.error("Error parsing admin WebSocket message:", error);
    }
  }

  private handleClose(event: CloseEvent) {
    console.log("Admin WebSocket closed:", event.code, event.reason);
    this.ws = null;

    // Attempt to reconnect if not a normal closure
    if (event.code !== 1000) {
      this.scheduleReconnect();
    }
  }

  private handleError(event: Event) {
    console.error("Admin WebSocket error:", event);
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max admin reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting admin reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectDelay}ms`);

    setTimeout(() => {
      this.connect();
      // Exponential backoff
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
    }, this.reconnectDelay);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, "Admin client disconnecting");
      this.ws = null;
    }
    this.reconnectAttempts = 0;
  }

  // Register handlers for specific message types
  onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
  }

  // Remove message handler
  offMessage(type: string) {
    this.messageHandlers.delete(type);
  }

  // Get connection status
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const adminWebSocketService = new AdminWebSocketService();
