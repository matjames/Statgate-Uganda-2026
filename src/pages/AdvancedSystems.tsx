import { useState, useEffect } from "react";
import { Shield, Activity, FileText, Cpu, CheckCircle2, AlertTriangle, Terminal, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export default function AdvancedSystems() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"diagnostics" | "simulation" | "contracts">("diagnostics");
  
  // Data States
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  
  // Simulation State
  const [simPolicy, setSimPolicy] = useState("");
  const [simResult, setSimResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (!token) return;

    if (activeTab === "diagnostics") {
      fetch("/api/v1/advanced/diagnostics", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setDiagnostics(data))
        .catch(console.error);
    } else if (activeTab === "contracts") {
      fetch("/api/v1/advanced/contracts", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => setContracts(data))
        .catch(console.error);
    }
  }, [activeTab, token]);

  const runSimulation = async () => {
    if (!simPolicy) return;
    setIsSimulating(true);
    try {
      const res = await fetch("/api/v1/advanced/simulate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ policy: simPolicy })
      });
      const data = await res.json();
      setSimResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-[#0A1D56] text-white rounded-xl p-6 mb-8 shadow-md flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <Badge className="bg-[#FFC107] text-[#0A1D56] mb-2 font-bold tracking-widest">ADVANCED COMMAND</Badge>
            <h2 className="text-2xl font-bold tracking-tight uppercase">Sovereign Systems Control</h2>
            <p className="text-gray-300">Unified interface for Phases 20, 27, and 35.</p>
          </div>
          <Cpu className="hidden md:block absolute right-8 text-white/10" size={100} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-sm border-t-4 border-t-[#0A1D56]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Architectural Modules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${activeTab === 'diagnostics' ? 'bg-[#0A1D56] text-white hover:bg-[#0A1D56]/90 hover:text-white' : ''}`}
                  onClick={() => setActiveTab('diagnostics')}
                >
                  <Activity className="mr-2 h-4 w-4" /> 
                  <div className="flex flex-col items-start ml-2">
                    <span>System Diagnostics</span>
                    <span className="text-[10px] opacity-70 uppercase">Phase 27</span>
                  </div>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${activeTab === 'simulation' ? 'bg-[#0A1D56] text-white hover:bg-[#0A1D56]/90 hover:text-white' : ''}`}
                  onClick={() => setActiveTab('simulation')}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  <div className="flex flex-col items-start ml-2">
                    <span>Policy Simulation</span>
                    <span className="text-[10px] opacity-70 uppercase">Phase 35</span>
                  </div>
                </Button>

                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${activeTab === 'contracts' ? 'bg-[#0A1D56] text-white hover:bg-[#0A1D56]/90 hover:text-white' : ''}`}
                  onClick={() => setActiveTab('contracts')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <div className="flex flex-col items-start ml-2">
                    <span>Data Contracts</span>
                    <span className="text-[10px] opacity-70 uppercase">Phase 20</span>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Module Content */}
          <div className="lg:col-span-3">
            {activeTab === "diagnostics" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#0A1D56] font-serif uppercase tracking-tight mb-2">Self-Diagnostics & Observability</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs uppercase text-muted-foreground">Framework Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="text-green-500 h-5 w-5" />
                        <span className="text-2xl font-bold">{diagnostics?.status || 'Loading...'}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs uppercase text-muted-foreground">CPU Usage (Aggregated)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-2xl font-bold">{diagnostics?.cpuUsage || 0}%</span>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs uppercase text-muted-foreground">Active Nodes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className="text-2xl font-bold">{diagnostics?.activeNodes || 0}</span>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-0 shadow-sm">
                   <CardHeader>
                      <CardTitle className="text-sm font-bold uppercase">System Logs</CardTitle>
                   </CardHeader>
                   <CardContent>
                      <div className="bg-slate-900 text-slate-300 p-4 rounded-md font-mono text-sm space-y-2 h-64 overflow-y-auto">
                        {diagnostics?.logs ? diagnostics.logs.map((log: any) => (
                           <div key={log.id} className="flex gap-2">
                              <span className="opacity-50">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                              <span className={log.type === 'warn' ? 'text-yellow-400' : 'text-blue-400'}>[{log.type.toUpperCase()}]</span>
                              <span>{log.message}</span>
                           </div>
                        )) : <span>Booting log aggregation...</span>}
                      </div>
                   </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "simulation" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#0A1D56] font-serif uppercase tracking-tight mb-2">Policy Simulation Engine</h3>
                <Card className="border-0 shadow-sm">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Input Policy Parameters</label>
                      <textarea 
                         value={simPolicy}
                         onChange={(e) => setSimPolicy(e.target.value)}
                         placeholder="e.g., Increase education grants by 15% in Western Region..."
                         className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[100px]"
                      />
                    </div>
                    <Button 
                      onClick={runSimulation} 
                      disabled={isSimulating || !simPolicy}
                      className="bg-[#0A1D56] hover:bg-[#0A1D56]/90 text-white"
                    >
                      {isSimulating ? "Running Digital Twin Computation..." : "Run Simulation"}
                    </Button>
                  </CardContent>
                </Card>

                {simResult && (
                  <Card className="border-0 shadow-sm border-l-4 border-l-[#FFC107]">
                     <CardHeader>
                       <CardTitle className="text-sm font-bold uppercase">Simulation Results</CardTitle>
                       <CardDescription>Confidence Score: {(simResult.confidenceScore * 100).toFixed(0)}%</CardDescription>
                     </CardHeader>
                     <CardContent>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <span className="text-xs font-bold text-muted-foreground block mb-1 uppercase">Economic Growth</span>
                            <span className="text-xl font-bold text-green-600">{simResult.predictedImpact.economicGrowth}</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <span className="text-xs font-bold text-muted-foreground block mb-1 uppercase">Population Shift</span>
                            <span className="text-xl font-bold text-blue-600">{simResult.predictedImpact.populationShift}</span>
                          </div>
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <span className="text-xs font-bold text-muted-foreground block mb-1 uppercase">Fiscal Cost</span>
                            <span className="text-xl font-bold text-red-600">{simResult.predictedImpact.fiscalCost}</span>
                          </div>
                       </div>
                     </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "contracts" && (
              <div className="space-y-6">
                 <h3 className="text-xl font-bold text-[#0A1D56] font-serif uppercase tracking-tight mb-2">Data Contracts & Governance</h3>
                 <Card className="border-0 shadow-sm">
                   <CardContent className="p-0">
                     <div className="rounded-md border-0">
                        <table className="w-full text-sm text-left">
                           <thead className="bg-slate-50">
                              <tr>
                                 <th className="px-6 py-3 font-bold text-slate-700 uppercase">Contract Name</th>
                                 <th className="px-6 py-3 font-bold text-slate-700 uppercase">Status</th>
                                 <th className="px-6 py-3 font-bold text-slate-700 uppercase">Compliance</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                             {contracts.map(contract => (
                                <tr key={contract.id} className="hover:bg-slate-50">
                                   <td className="px-6 py-4 font-medium text-[#0A1D56]">{contract.name}</td>
                                   <td className="px-6 py-4">
                                      {contract.status === 'Warning' ? (
                                        <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50"><AlertTriangle className="mr-1 h-3 w-3"/> Warning</Badge>
                                      ) : (
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50"><CheckCircle2 className="mr-1 h-3 w-3"/> Active</Badge>
                                      )}
                                   </td>
                                   <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                         <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div className={`h-2 rounded-full ${contract.compliance >= 90 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${contract.compliance}%` }}></div>
                                         </div>
                                         <span className="font-mono text-xs">{contract.compliance}%</span>
                                      </div>
                                   </td>
                                </tr>
                             ))}
                           </tbody>
                        </table>
                        {contracts.length === 0 && <div className="p-8 text-center text-muted-foreground font-medium">Loading contracts...</div>}
                     </div>
                   </CardContent>
                 </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
