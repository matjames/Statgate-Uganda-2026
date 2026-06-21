import { useState } from "react";
import { MessageSquare, Sparkles, Send, BrainCircuit, Activity, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

export default function AIWorkspace() {
  const { token } = useAuth();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", content: "I am the StatGate AI Consultant. How can I assist you with data analysis today? Ask me about demographic trends, economic indicators, or policy simulations." }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !token) return;

    setMessages([...messages, { role: "user", content: query }]);
    const currentQuery = query;
    setQuery("");
    setIsLoading(true);

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
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8 flex flex-col h-[calc(100vh-100px)]">
        
        {/* Quote Banner */}
        <div className="bg-[#0A1D56] text-white rounded-xl p-6 mb-8 shadow-md flex justify-between items-center relative overflow-hidden shrink-0">
          <div className="relative z-10">
            <Badge className="bg-[#FFC107] text-[#0A1D56] mb-2 uppercase hover:bg-[#FFC107]">Phase 8 Active</Badge>
            <h2 className="text-2xl font-bold tracking-tight">AI Intelligence Layer</h2>
            <p className="text-gray-300 font-medium mt-1">Numbers tell you what happened. Statistics tell you why it matters.</p>
          </div>
          <Sparkles className="hidden md:block absolute right-8 text-white/10" size={100} />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-[#0A1D56] font-serif uppercase tracking-tight">AI Consultant</h1>
            </div>
            <p className="text-muted-foreground mt-1">Natural language querying and intelligence generation.</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border shadow-sm text-sm text-green-700 font-medium font-mono">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            LLM Core: Online
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
          <Card className="lg:col-span-1 flex flex-col hidden lg:flex border-0 shadow-sm">
            <CardHeader className="bg-gray-50/50 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                 <BrainCircuit className="h-4 w-4" /> Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="text-sm">
                <div className="flex items-center gap-2 mb-2 text-[#0A1D56]">
                  <MessageSquare className="h-4 w-4" />
                  <h4 className="font-bold uppercase tracking-wider text-xs">Natural Language</h4>
                </div>
                <p className="text-muted-foreground leading-relaxed">Ask questions like <span className="italic">"What is the population growth in Wakiso?"</span></p>
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-2 mb-2 text-[#0A1D56]">
                  <Database className="h-4 w-4" />
                  <h4 className="font-bold uppercase tracking-wider text-xs">Automated Insights</h4>
                </div>
                <p className="text-muted-foreground leading-relaxed">Detect anomalies and trends securely across multidimensional datasets.</p>
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-2 mb-2 text-[#0A1D56]">
                  <Sparkles className="h-4 w-4" />
                  <h4 className="font-bold uppercase tracking-wider text-xs">Policy Simulation</h4>
                </div>
                <p className="text-muted-foreground leading-relaxed">Model hypothetical scenarios to understand structural impacts.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 flex flex-col min-h-0 border-0 shadow-sm bg-white overflow-hidden">
             <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "ai" && (
                       <div className="w-8 h-8 rounded-full bg-[#0A1D56] flex flex-shrink-0 items-center justify-center mr-3 mt-1 shadow-sm">
                         <Sparkles className="h-4 w-4 text-white" />
                       </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm ${
                        msg.role === "user" 
                        ? "bg-[#0A1D56] text-white rounded-tr-none" 
                        : "bg-white border text-slate-700 rounded-tl-none font-medium leading-relaxed"
                    }`}>
                        <span className="text-sm">{msg.content}</span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                   <div className="flex justify-start">
                     <div className="w-8 h-8 rounded-full bg-[#0A1D56] flex flex-shrink-0 items-center justify-center mr-3 mt-1 shadow-sm">
                       <Sparkles className="h-4 w-4 text-white animate-pulse" />
                     </div>
                     <div className="bg-white border rounded-2xl rounded-tl-none px-5 py-3.5 shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0A1D56] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#0A1D56] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#0A1D56] animate-bounce" style={{ animationDelay: '300ms' }} />
                     </div>
                   </div>
                )}
             </div>
             <div className="p-4 border-t bg-white shrink-0">
               <form onSubmit={handleSend} className="flex gap-3">
                 <Input 
                   value={query} 
                   onChange={(e) => setQuery(e.target.value)}
                   placeholder="Ask a question. The AI Consultant will query the Sovereign Database..." 
                   className="flex-1 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#0A1D56] focus-visible:ring-offset-2"
                   disabled={isLoading}
                 />
                 <Button type="submit" disabled={isLoading || !query.trim()} className="bg-[#FFC107] text-[#0A1D56] hover:bg-[#FFC107]/90 rounded-xl px-6 font-bold shadow-sm">
                   <Send className="h-4 w-4 mr-2" /> Send
                 </Button>
               </form>
               <p className="text-center text-[10px] text-muted-foreground mt-3 font-medium uppercase tracking-widest">
                 StatGate AI operates exclusively under the national data intelligence framework.
               </p>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
