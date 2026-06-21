import { useState, useEffect } from "react";
import { Shield, GitCommit, FileCheck, CheckCircle2, AlertTriangle, Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { getSocket } from "@/lib/socket";

export default function Governance() {
  const { token, user } = useAuth();
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    fetch("/api/v1/governance/lineage", { headers })
      .then(res => res.json())
      .then(data => setPipelines(data))
      .catch(err => console.error("Failed to fetch lineage:", err));

    fetch("/api/v1/governance/alerts", { headers })
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error("Failed to fetch alerts:", err));

    const socket = getSocket(token);
    socket.connect();

    const onPipelineEvent = (event: any) => {
      setPipelines(prev => {
        const existing = prev.find(p => p.id === event.id);
        if (existing) {
          return prev.map(p => p.id === event.id ? { ...p, ...event } : p);
        } else {
          return [event, ...prev].slice(0, 10);
        }
      });
    };

    socket.on("pipeline_event", onPipelineEvent);

    return () => {
      socket.off("pipeline_event", onPipelineEvent);
    };
  }, [token]);

  const approvePipeline = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/governance/lineage/${id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPipelines(pipelines.map(p => p.id === id ? { ...p, status: "Healthy" } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const acknowledgeAlert = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/governance/alerts/${id}/acknowledge`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setAlerts(alerts.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-primary font-serif">Data Governance</h1>
              <Badge variant="outline" className="font-mono bg-blue-500/10 text-blue-600 border-blue-500/20">
                STRICT
              </Badge>
            </div>
            <p className="text-muted-foreground">Lineage tracing, approvals, and quality assurance.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" /> Audit Policies
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Lineage Graph (Recent Pipelines)</CardTitle>
              <CardDescription>Track the journey of data from ingestion to consumption.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pipelines.map((pipeline: any, idx: number) => (
                  <div key={idx} className={`flex items-center gap-4 p-4 border rounded-lg bg-background ${pipeline.status === 'Running' ? 'border-blue-500 animate-pulse' : ''}`}>
                    <div className="p-3 bg-muted rounded-full">
                      {pipeline.status === 'Running' ? <Loader2 className="h-5 w-5 text-blue-500 animate-spin" /> : <GitCommit className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">
                        {pipeline.name}
                        {pipeline.recordsProcessed && <span className="ml-2 text-xs text-muted-foreground font-normal">({pipeline.recordsProcessed.toLocaleString()} records)</span>}
                      </h3>
                      <p className="text-xs text-muted-foreground">{pipeline.steps}</p>
                    </div>
                    <Badge variant={pipeline.status === "Healthy" ? "default" : pipeline.status === "Running" ? "outline" : "secondary"} 
                           className={pipeline.status === "Healthy" ? "bg-green-100 text-green-800" : pipeline.status === "Running" ? "bg-blue-100 text-blue-800 border-blue-500" : "bg-yellow-100 text-yellow-800"}>
                      {pipeline.status}
                    </Badge>
                    {pipeline.status === "Pending Review" && user?.role === "Sovereign Admin" && (
                      <Button variant="outline" size="sm" onClick={() => approvePipeline(pipeline.id)}>
                        <Check className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quality Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.length === 0 ? (
                <div className="text-sm text-muted-foreground">No active alerts.</div>
              ) : alerts.map((alert: any, idx: number) => (
                <div key={idx} className={`flex items-center justify-between gap-3 p-3 text-sm rounded-md border ${alert.type === 'error' ? 'bg-red-50 text-red-900 border-red-100' : 'bg-blue-50 text-blue-900 border-blue-100'}`}>
                  <div className="flex items-center gap-3">
                    {alert.type === 'error' ? <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" /> : <FileCheck className="h-5 w-5 shrink-0 text-blue-600" />}
                    <div>
                      <div className="font-bold">{alert.title}</div>
                      <div className="text-xs opacity-80">{alert.description}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => acknowledgeAlert(alert.id)}>Dismiss</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
