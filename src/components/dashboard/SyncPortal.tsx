import { useState } from "react";
import { 
  Upload, 
  Database, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  MapPin,
  BrainCircuit,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

export default function SyncPortal() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState<"idle" | "uploading" | "refining" | "complete">("idle");
  const [stats, setStats] = useState<any>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus("uploading");
    setProgress(0);

    // Simulate Upload
    const uploadInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 40) {
          clearInterval(uploadInterval);
          setSyncStatus("refining");
          return 40;
        }
        return prev + 5;
      });
    }, 200);

    // Simulate Refinement Engine
    setTimeout(() => {
      const refineInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(refineInterval);
            setSyncStatus("complete");
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }, 2000);

    // Actual API Call (Mocked)
    try {
      const response = await fetch("/api/v1/sync/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "admin-01",
          coords: [0.3476, 32.5825], // Kampala
          data: [
            { id: 1, name: "John Doe", pii: "secret-email@gmail.com", district: "Kampala", response: "The community needs more water access points." },
            { id: 2, name: "Jane Smith", pii: "private-phone", district: "Gulu", response: "We are satisfied with the current progress." }
          ]
        })
      });
      const data = await response.json();
      setStats(data);
      toast.success("Sovereign Sync Complete: Data refined and anonymized.");
    } catch (error) {
      toast.error("Sync failed. Local node unreachable.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-primary">Field Data Sync</CardTitle>
          <CardDescription>Upload raw field data to the Sovereign Engine for real-time refinement and anonymization.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="border-2 border-dashed border-primary/20 rounded-2xl p-12 text-center bg-muted/5">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full ${isSyncing ? "bg-secondary/20 text-secondary animate-pulse" : "bg-primary/10 text-primary"}`}>
                <Upload size={48} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">Ready for Ingestion</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
              Drag and drop ODK/CSV files or click to select from your local device.
            </p>
            <Button 
              onClick={handleSync} 
              disabled={isSyncing}
              className="bg-primary hover:bg-primary/90 text-white px-8 h-12"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Start Sovereign Sync"
              )}
            </Button>
          </div>

          {syncStatus !== "idle" && (
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-primary uppercase tracking-widest">
                    {syncStatus === "uploading" && "Uploading to Kampala Node..."}
                    {syncStatus === "refining" && "Refinement Engine Active..."}
                    {syncStatus === "complete" && "Sync Finalized"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {syncStatus === "uploading" && "Establishing TLS 1.3 Tunnel"}
                    {syncStatus === "refining" && "Applying PII Anonymization & R-Logic"}
                    {syncStatus === "complete" && "Data committed to Immutable Ledger"}
                  </p>
                </div>
                <span className="text-2xl font-bold text-primary font-mono">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-muted" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Refinement Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-muted-foreground">PII Stripped</span>
                </div>
                <span className="text-xs font-bold">{stats?.processedCount || 0} Records</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-secondary" />
                  <span className="text-xs text-muted-foreground">Integrity Score</span>
                </div>
                <span className="text-xs font-bold text-secondary">{stats?.integrityScore || "0.0"}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Geofence</span>
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded",
                  stats?.geofenceStatus === "VERIFIED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                )}>
                  {stats?.geofenceStatus || "PENDING"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-purple-500" />
                  <span className="text-xs text-muted-foreground">Ghost-Writer Check</span>
                </div>
                <span className="text-xs font-bold">PASSED</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Storage Node</span>
                </div>
                <span className="text-xs font-mono">{stats?.storageLocation || "N/A"}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border border-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-3 w-3 text-yellow-500" />
                <span className="text-[10px] font-bold uppercase tracking-tighter">Audit Trail Note</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Every sync operation is logged in the non-mutable ledger. 
                Falsification attempts trigger an immediate system-wide alert.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/10 border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold">Recent Syncs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { id: "SYNC-001", date: "2h ago", status: "Success" },
              { id: "SYNC-002", date: "5h ago", status: "Success" },
            ].map(sync => (
              <div key={sync.id} className="flex justify-between items-center text-[10px] p-2 rounded bg-background border">
                <span className="font-mono">{sync.id}</span>
                <span className="text-muted-foreground">{sync.date}</span>
                <CheckCircle2 className="h-3 w-3 text-green-500" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
