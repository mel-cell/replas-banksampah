export class WebSocketService {
  private ws: WebSocket | null = null;
  private machineCode: string = "";
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

  connect(machineCode: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    this.machineCode = machineCode;
    // Use current window location for dynamic WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/room/${machineCode}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = (event) => {
        console.log(`WebSocket connected to ${machineCode}`);
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
      };

      this.ws.onmessage = this.handleMessage;
      this.ws.onclose = this.handleClose;
      this.ws.onerror = this.handleError;

    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.scheduleReconnect();
    }
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);

      // Call registered handlers
      const handler = this.messageHandlers.get(data.type);
      if (handler) {
        handler(data);
      }

      // Handle specific message types
      switch (data.type) {
        case "connected":
          console.log(`Connected to machine ${data.machineCode}`);
          break;
        case "bottle_update":
          console.log(`Bottle update: ${data.bottleCount} bottles, ${data.points} points`);
          break;
        case "session_update":
          console.log(`Session update: ${data.status} - ${data.message}`);
          break;
        default:
          console.log("Unknown message type:", data.type);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  private handleClose(event: CloseEvent) {
    console.log(`WebSocket closed for ${this.machineCode}:`, event.code, event.reason);
    this.ws = null;

    // Attempt to reconnect if not a normal closure
    if (event.code !== 1000) {
      this.scheduleReconnect();
    }
  }

  private handleError(event: Event) {
    console.error(`WebSocket error for ${this.machineCode}:`, event);
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectDelay}ms`);

    setTimeout(() => {
      this.connect(this.machineCode);
      // Exponential backoff
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000);
    }, this.reconnectDelay);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, "Client disconnecting");
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

  // Get current machine code
  getMachineCode(): string {
    return this.machineCode;
  }
}

// Singleton instance
export const websocketService = new WebSocketService();
