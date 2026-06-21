import { useState } from "react";
import { MessageSquare, Sparkles, Send, BrainCircuit, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

export default function AIWorkspace() {
  const { token } = useAuth();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", content: "I am the StatGate AI Consultant. How can I assist you with data analysis today?" }
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !token) return;

    setMessages([...messages, { role: "user", content: query }]);
    const currentQuery = query;
    setQuery("");
    
    try {
      const response = await fetch("/api/v1/ai/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ query: currentQuery })
      });
      const data = await response.json();
      setMessages(prev => [...prev, data]);
    } catch (err) {
      console.error("Failed to fetch AI response:", err);
      setMessages(prev => [...prev, { role: "ai", content: "Error connecting to Intelligence Layer." }]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8 flex flex-col h-[calc(100vh-100px)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-primary font-serif">AI Consultant</h1>
              <Badge variant="outline" className="font-mono bg-indigo-500/10 text-indigo-600 border-indigo-500/20">
                ACTIVE
              </Badge>
            </div>
            <p className="text-muted-foreground">Natural language querying and intelligence generation.</p>
          </div>
          <div className="flex gap-4 items-center">
             <div className="flex items-center gap-2 text-sm text-muted-foreground mr-4">
                <Activity className="h-4 w-4 text-green-500" /> Model Ready
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
          <Card className="lg:col-span-1 flex flex-col hidden lg:flex">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                 <BrainCircuit className="h-5 w-5" /> Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <h4 className="font-semibold mb-1">Natural Language Queries</h4>
                <p className="text-muted-foreground">Ask questions like "What is the population growth in Wakiso?"</p>
              </div>
              <div className="text-sm">
                <h4 className="font-semibold mb-1">Automated Insights</h4>
                <p className="text-muted-foreground">Detect anomalies and trends securely.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 flex flex-col min-h-0 bg-background/50 border shadow-inner">
             <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        msg.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted border text-foreground"
                    }`}>
                        {msg.role === "ai" && <Sparkles className="h-4 w-4 mb-2 inline-block mr-2" />}
                        <span className="text-sm leading-relaxed">{msg.content}</span>
                    </div>
                  </div>
                ))}
             </div>
             <div className="p-4 border-t bg-background shrink-0">
               <form onSubmit={handleSend} className="flex gap-2">
                 <Input 
                   value={query} 
                   onChange={(e) => setQuery(e.target.value)}
                   placeholder="Ask a question about the latest datasets..." 
                   className="flex-1"
                 />
                 <Button type="submit" disabled={!query.trim()}>
                   <Send className="h-4 w-4 mr-2" /> Ask AI
                 </Button>
               </form>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
