import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { 
  Send, 
  User, 
  MessageSquare, 
  Circle, 
  Hash,
  Clock,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Message {
  id: number;
  sender_email: string;
  content: string;
  created_at: string;
}

export default function ChatPortal() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentUser = JSON.parse(localStorage.getItem("statgate_user") || "{}");

  useEffect(() => {
    const token = localStorage.getItem("statgate_token");
    if (!token) return;

    // Fetch history
    fetch("/api/v1/chat/history", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setMessages(data))
    .catch(() => toast.error("Failed to load chat history"));

    // Initialize Socket
    const socket = io({
      auth: { token }
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    
    socket.on("receive_message", (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit("send_message", newMessage);
    setNewMessage("");
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-primary flex items-center gap-2">
            Sovereign Comms <Badge variant="outline" className="font-mono text-[10px] uppercase">Secure</Badge>
          </h2>
          <p className="text-muted-foreground">Real-time encrypted communication for all system users.</p>
        </div>
        <div className="flex items-center gap-2">
          <Circle className={`h-3 w-3 fill-current ${isConnected ? "text-green-500" : "text-red-500"}`} />
          <span className="text-xs font-mono uppercase tracking-widest">
            {isConnected ? "Connection Active" : "Offline"}
          </span>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-2 border-primary/10 shadow-xl">
        <CardHeader className="border-b bg-muted/30 py-3">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" />
            <span className="font-bold text-sm">#general-broadcast</span>
          </div>
        </CardHeader>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg, i) => {
              const isMe = msg.sender_email === currentUser.email;
              return (
                <div key={msg.id || i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {!isMe && <User className="h-3 w-3 text-primary" />}
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      {isMe ? "You" : msg.sender_email}
                    </span>
                    <Clock className="h-2 w-2 text-muted-foreground" />
                    <span className="text-[8px] text-muted-foreground">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                    isMe 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-muted border border-primary/5 rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <CardFooter className="p-4 border-t bg-muted/10">
          <form onSubmit={sendMessage} className="flex w-full gap-2">
            <Input
              placeholder="Type your secure message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-white border-primary/20 focus-visible:ring-primary"
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>

      <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg border border-primary/10">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span className="text-[10px] font-mono text-primary/70 uppercase tracking-widest">
          End-to-End Sovereignty Guaranteed • All messages are logged for audit compliance
        </span>
      </div>
    </div>
  );
}
