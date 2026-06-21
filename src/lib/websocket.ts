export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onmessage = (event) => {
      console.log("[WebSocket] Message received:", event.data);
    };
    this.ws.onopen = () => {
      console.log("[WebSocket] Connected to", this.url);
    };
    this.ws.onclose = () => {
      console.log("[WebSocket] Disconnected");
    };
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
