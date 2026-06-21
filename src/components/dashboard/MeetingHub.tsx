import React, { useState, useEffect, useRef } from "react";
import { 
  Video, 
  Presentation, 
  Users, 
  Monitor, 
  Mic, 
  Camera, 
  Share2,
  Layout,
  Pencil,
  Square,
  Circle as CircleIcon,
  Trash2,
  Download
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Stage, Layer, Rect, Circle, Line } from 'react-konva';
import { toast } from "sonner";

export default function MeetingHub() {
  const [activeTab, setActiveTab] = useState("video");
  const [roomName, setRoomName] = useState("StatGate-Sovereign-Council");
  const [lines, setLines] = useState<any[]>([]);
  const isDrawing = useRef(false);
  const currentUser = JSON.parse(localStorage.getItem("statgate_user") || "{}");

  // Whiteboard Logic
  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool: 'pen', points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const clearWhiteboard = () => {
    setLines([]);
    toast.success("Whiteboard cleared");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-primary flex items-center gap-3">
            Sovereign Hub <Badge className="bg-secondary">Collaboration Suite</Badge>
          </h2>
          <p className="text-muted-foreground">Video conferencing, collaborative presentations, and strategic brainstorming.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Users className="mr-2 h-4 w-4" /> 12 Active
          </Button>
          <Button className="bg-primary">
            <Share2 className="mr-2 h-4 w-4" /> Invite Personnel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="video" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md">
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Video className="h-4 w-4" /> Video Meeting
          </TabsTrigger>
          <TabsTrigger value="whiteboard" className="flex items-center gap-2">
            <Presentation className="h-4 w-4" /> Presentation Deck
          </TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-4">
          <Card className="border-2 border-primary/10 overflow-hidden shadow-2xl">
            <div className="aspect-video bg-black relative">
              {/* Jitsi Meet Integration */}
              <iframe
                src={`https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&userInfo.displayName="${currentUser.email}"`}
                allow="camera; microphone; display-capture; autoplay; clipboard-write"
                className="w-full h-full border-0"
                title="Sovereign Video Council"
              />
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 p-4 rounded-full bg-black/50 backdrop-blur-md border border-white/20 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="rounded-full text-white hover:bg-white/20">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full text-white hover:bg-white/20">
                  <Camera className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-full text-white hover:bg-white/20">
                  <Monitor className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <CardHeader className="bg-muted/30 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-serif">Sovereign Council Chamber</CardTitle>
                  <CardDescription>Secure, encrypted video channel for high-level coordination.</CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
                  Room: {roomName}
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </TabsContent>

        <TabsContent value="whiteboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-3 border-2 border-primary/10 overflow-hidden bg-white shadow-lg">
              <div className="p-2 border-b bg-muted/20 flex items-center justify-between">
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Square className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8"><CircleIcon className="h-4 w-4" /></Button>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={clearWhiteboard} className="h-8 w-8 text-red-500"><Trash2 className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="bg-muted/5 cursor-crosshair">
                <Stage
                  width={800}
                  height={500}
                  onMouseDown={handleMouseDown}
                  onMousemove={handleMouseMove}
                  onMouseup={handleMouseUp}
                >
                  <Layer>
                    {lines.map((line, i) => (
                      <Line
                        key={i}
                        points={line.points}
                        stroke="#1e3a8a"
                        strokeWidth={3}
                        tension={0.5}
                        lineCap="round"
                        globalCompositeOperation={
                          line.tool === 'eraser' ? 'destination-out' : 'source-over'
                        }
                      />
                    ))}
                  </Layer>
                </Stage>
              </div>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-serif">Presentation Assets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="p-3 rounded-lg border bg-muted/10 text-xs flex items-center gap-2 cursor-pointer hover:bg-muted/20">
                    <Layout className="h-3 w-3" /> Q1_Regional_Stats.pdf
                  </div>
                  <div className="p-3 rounded-lg border bg-muted/10 text-xs flex items-center gap-2 cursor-pointer hover:bg-muted/20">
                    <Layout className="h-3 w-3" /> Field_Agent_Protocol.docx
                  </div>
                  <Button variant="outline" size="sm" className="w-full text-[10px] uppercase">
                    Upload Asset
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-primary text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-serif">Live Sync</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[10px] opacity-80 mb-4">
                    Your whiteboard changes are being broadcasted to all participants in real-time.
                  </p>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-6 w-6 rounded-full border-2 border-primary bg-secondary flex items-center justify-center text-[8px] font-bold">
                        U{i}
                      </div>
                    ))}
                    <div className="h-6 w-6 rounded-full border-2 border-primary bg-muted text-primary flex items-center justify-center text-[8px] font-bold">
                      +9
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
