import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  Users, 
  Briefcase, 
  CreditCard, 
  Video,
  MessageSquare,
  TrendingUp,
  LayoutDashboard, 
  Search, 
  Filter,
  Plus,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ShieldCheck,
  Shield,
  Globe,
  Zap,
  GraduationCap,
  Trophy,
  RefreshCw,
  Code2,
  Terminal,
  Play,
  Languages,
  Database,
  AlertTriangle,
  Activity
} from "lucide-react";
import DistrictMap from "@/components/dashboard/DistrictMap";
import TruthMeter from "@/components/dashboard/TruthMeter";
import SyncPortal from "@/components/dashboard/SyncPortal";
import DataLab from "@/components/dashboard/DataLab";
import ChatPortal from "@/components/dashboard/ChatPortal";
import MeetingHub from "@/components/dashboard/MeetingHub";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSocket } from "@/lib/socket";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [dbStatus, setDbStatus] = useState<{ status: string; database?: string; firebase?: string }>({ status: "Checking..." });
  const [stats, setStats] = useState({
    activeAgents: "...",
    totalProjects: "...",
    pendingPayments: "...",
    complianceScore: "..."
  });
  const [staff, setStaff] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  // Create User State
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("Field Agent");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingUser(true);
    try {
      const token = localStorage.getItem("statgate_token");
      const headers = { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };
      const response = await fetch("/api/v1/admin/users", {
        method: "POST",
        headers,
        body: JSON.stringify({ email: newUserEmail, password: newUserPassword, role: newUserRole })
      });
      if (response.ok) {
        const newUser = await response.json();
        setUsers([newUser, ...users]);
        setIsCreateUserOpen(false);
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserRole("Field Agent");
      } else {
        alert("Failed to create user. Please check permissions.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setIsCreatingUser(false);
    }
  };

  const currentUser = JSON.parse(localStorage.getItem("statgate_user") || "{}");

  const [liveMetrics, setLiveMetrics] = useState<any>(({
    activeQueries: 0,
    pipelineThroughput: 0,
    activeUsers: 0,
    systemLoad: "0%"
  }));
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("statgate_token");
    if (token) {
      const socket = getSocket(token);
      socket.connect();
      socket.on("connect", () => setSocketConnected(true));
      socket.on("disconnect", () => setSocketConnected(false));
      socket.on("live_metrics", (data) => setLiveMetrics(data));
      
      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("live_metrics");
        socket.disconnect();
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("statgate_token");
    const headers = token ? { "Authorization": `Bearer ${token}` } : {};

    fetch("/api/v1/health", { headers })
      .then(res => res.json())
      .then(data => setDbStatus({ status: data.status, database: data.database, firebase: data.firebase }))
      .catch(() => setDbStatus({ status: "Offline" }));

    fetch("/api/v1/analytics/dashboard/stats", { headers })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to fetch stats:", err));

    fetch("/api/v1/analytics/staff", { headers })
      .then(res => res.json())
      .then(data => setStaff(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch staff:", err));

    fetch("/api/v1/reports", { headers })
      .then(res => res.json())
      .then(data => setReports(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch reports:", err));

    fetch("/api/v1/analytics/districts", { headers })
      .then(res => res.json())
      .then(data => setDistricts(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch districts:", err));

    fetch("/api/v1/fellowship/leaderboard", { headers })
      .then(res => res.json())
      .then(data => setLeaderboard(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch leaderboard:", err));

    fetch("/api/v1/admin/audit", { headers })
      .then(res => res.json())
      .then(data => setAuditLogs(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch audit logs:", err));

    if (currentUser.role === "Sovereign Admin") {
      fetch("/api/v1/admin/users", { headers })
        .then(res => res.json())
        .then(data => setUsers(Array.isArray(data) ? data : []))
        .catch(err => console.error("Failed to fetch users:", err));
    }
  }, []);

  const agents = [
    { id: "AGT001", name: "Sarah Namukasa", region: "Kampala", status: "Active", projects: 3, rating: 4.8 },
    { id: "AGT002", name: "James Okello", region: "Gulu", status: "On Leave", projects: 1, rating: 4.5 },
    { id: "AGT003", name: "Mary Atwine", region: "Mbarara", status: "Active", projects: 5, rating: 4.9 },
    { id: "AGT004", name: "Peter Musoke", region: "Jinja", status: "Pending", projects: 0, rating: 0 },
  ];

  const transactions = [
    { id: "TXN1001", date: "2026-04-10", entity: "Sarah Namukasa", type: "Smart-Pay", amount: "50,000 UGX", status: "Completed" },
    { id: "TXN1002", date: "2026-04-09", entity: "DataCorp Uganda", type: "Vendor Payment", amount: "2,500,000 UGX", status: "Pending" },
    { id: "TXN1003", date: "2026-04-10", entity: "James Okello", type: "Salary", amount: "800,000 UGX", status: "Processing" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-primary font-serif">{t("dashboard.title")}</h1>
              <Badge 
                variant={dbStatus.database?.includes("Connected") ? "default" : "destructive"}
                className={cn(
                  "flex items-center gap-1",
                  dbStatus.database?.includes("Connected") ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                )}
              >
                {dbStatus.database?.includes("Connected") ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <AlertTriangle className="h-3 w-3" />
                )}
                DB: {dbStatus.database || "Disconnected"}
              </Badge>
              {dbStatus.firebase === "Active" && (
                <Badge 
                  variant="default"
                  className="flex items-center gap-1 bg-[#0A1D56] text-white font-semibold"
                >
                  <Database className="h-3 w-3 animate-pulse" />
                  Cloud Node Active
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
              Welcome back to <span className="font-bold text-[#0A1D56]">StatGate Uganda</span>. 
              Here is your central command center for all sovereign data operations across the nation.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-primary text-primary">
              <CreditCard className="mr-2 h-4 w-4" /> Export Ledger
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> New Deployment
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="flex flex-col lg:flex-row gap-8 items-start relative w-full animate-fade-in" onValueChange={setActiveTab}>
          {/* Dashboard Left Sidebar */}
          <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-primary/10 rounded-xl p-4 shadow-sm">
              <div className="space-y-3">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 font-semibold">
                  Sovereign Panel
                </div>
                <TabsList className="flex flex-row lg:flex-col h-auto w-full p-0 bg-transparent gap-1 overflow-x-auto lg:overflow-x-visible">
                  <TabsTrigger value="overview" className="justify-start data-[state=active]:bg-primary data-[state=active]:text-white w-full py-2 px-3 text-left">
                    <LayoutDashboard className="mr-2 h-4 w-4 shrink-0" /> <span className="truncate">{t("dashboard.overview")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="sync" className="justify-start data-[state=active]:bg-primary data-[state=active]:text-white w-full py-2 px-3 text-left">
                    <RefreshCw className="mr-2 h-4 w-4 shrink-0" /> <span className="truncate">{t("dashboard.sync")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="agents" className="justify-start data-[state=active]:bg-primary data-[state=active]:text-white w-full py-2 px-3 text-left">
                    <Users className="mr-2 h-4 w-4 shrink-0" /> <span className="truncate">{t("dashboard.agents")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="reports" className="justify-start data-[state=active]:bg-primary data-[state=active]:text-white w-full py-2 px-3 text-left">
                    <FileText className="mr-2 h-4 w-4 shrink-0" /> <span className="truncate">{t("dashboard.reports")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="fellowship" className="justify-start data-[state=active]:bg-primary data-[state=active]:text-white w-full py-2 px-3 text-left">
                    <GraduationCap className="mr-2 h-4 w-4 shrink-0" /> <span className="truncate">{t("dashboard.fellowship")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="sandbox" className="justify-start data-[state=active]:bg-primary data-[state=active]:text-white w-full py-2 px-3 text-left">
                    <Terminal className="mr-2 h-4 w-4 shrink-0" /> <span className="truncate">{t("dashboard.sandbox")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="audit" className="justify-start data-[state=active]:bg-primary data-[state=active]:text-white w-full py-2 px-3 text-left">
                    <Shield className="mr-2 h-4 w-4 shrink-0" /> <span className="truncate">{t("dashboard.audit")}</span>
                  </TabsTrigger>
                  {(currentUser.role === "Sovereign Admin" || currentUser.role === "Lead Analyst") && (
                    <TabsTrigger value="datalab" className="justify-start data-[state=active]:bg-primary data-[state=active]:text-white w-full py-2 px-3 text-left">
                      <TrendingUp className="mr-2 h-4 w-4 shrink-0" /> <span className="truncate">Data Lab</span>
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="chat" className="justify-start data-[state=active]:bg-primary data-[state=active]:text-white w-full py-2 px-3 text-left">
                    <MessageSquare className="mr-2 h-4 w-4 shrink-0" /> <span className="truncate">Comms</span>
                  </TabsTrigger>
                  <TabsTrigger value="hub" className="justify-start data-[state=active]:bg-primary data-[state=active]:text-white w-full py-2 px-3 text-left">
                    <Video className="mr-2 h-4 w-4 shrink-0" /> <span className="truncate">Hub</span>
                  </TabsTrigger>
                  <TabsTrigger value="vendors" className="justify-start data-[state=active]:bg-primary data-[state=active]:text-white w-full py-2 px-3 text-left">
                    <Briefcase className="mr-2 h-4 w-4 shrink-0" /> <span className="truncate">Vendors</span>
                  </TabsTrigger>
                  <TabsTrigger value="ledger" className="justify-start data-[state=active]:bg-primary data-[state=active]:text-white w-full py-2 px-3 text-left">
                    <CreditCard className="mr-2 h-4 w-4 shrink-0" /> <span className="truncate">Financial Ledger</span>
                  </TabsTrigger>
                  {currentUser.role === "Sovereign Admin" && (
                    <TabsTrigger value="users" className="justify-start data-[state=active]:bg-primary data-[state=active]:text-white w-full py-2 px-3 text-left">
                      <Users className="mr-2 h-4 w-4 shrink-0" /> <span className="truncate">User Management</span>
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content Area */}
          <div className="flex-1 w-full min-w-0 space-y-6">

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DistrictMap districts={districts} />
              </div>
              <div className="flex flex-col gap-6">
                <TruthMeter score={98.4} />
                <Card className="border-primary/10 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-mono uppercase tracking-widest text-muted-foreground">System Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Engine Version</span>
                      <Badge variant="outline" className="font-mono text-[10px]">V2.0 SOVEREIGN</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Data Sovereignty</span>
                      <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> ENFORCED
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Storage Node</span>
                      <span className="text-xs font-mono">KAMPALA-01</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">System Load</span>
                      <span className="text-xs font-mono text-purple-600 font-bold">{liveMetrics.systemLoad}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Pipeline Throughput</span>
                      <span className="text-xs font-mono font-bold">{liveMetrics.pipelineThroughput} req/s</span>
                    </div>
                    <div className="pt-2 border-t border-dashed">
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <div className={`h-2 w-2 rounded-full ${socketConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                        {socketConnected ? "LIVE TELEMETRY STREAM ACTIVE" : "TELEMETRY DISCONNECTED"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Active Agents", value: stats.activeAgents, icon: Users, trend: "+12%", trendLabel: "from last month" },
                { title: "Total Projects", value: stats.totalProjects, icon: Briefcase, trend: "8", trendLabel: "active in field" },
                { title: "Pending Payments", value: stats.pendingPayments, icon: CreditCard, trend: "3d", trendLabel: "until due" },
                { title: "Compliance Score", value: stats.complianceScore, icon: CheckCircle2, trend: "Top 5%", trendLabel: "regionally" },
              ].map((stat, i) => (
                <Card key={i} className="border-primary/5 hover:border-primary/20 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <Badge variant="secondary" className="text-[10px] bg-primary/5 text-primary border-none">
                        {stat.trend}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">{stat.trendLabel}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-primary">Recent Agent Activity</CardTitle>
                  <CardDescription>Latest updates from field deployments.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {staff.slice(0, 4).map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${agent.name}`} />
                            <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-primary">{agent.name}</p>
                            <p className="text-xs text-muted-foreground">{agent.region} • {agent.district}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={agent.status === "Active" ? "default" : "secondary"} className={agent.status === "Active" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                            {agent.status}
                          </Badge>
                          <div className="text-xs font-bold text-secondary">{agent.integrityScore}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-serif text-primary">Ledger Overview</CardTitle>
                  <CardDescription>Recent financial transactions and status.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((txn) => (
                      <div key={txn.id} className="flex items-center justify-between p-3 rounded-lg border bg-background/50">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${txn.status === "Completed" ? "bg-green-100 text-green-600" : txn.status === "Pending" ? "bg-yellow-100 text-yellow-600" : "bg-blue-100 text-blue-600"}`}>
                            {txn.status === "Completed" ? <CheckCircle2 className="h-4 w-4" /> : txn.status === "Pending" ? <Clock className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-primary">{txn.entity}</p>
                            <p className="text-xs text-muted-foreground">{txn.type} • {txn.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-primary">{txn.amount}</p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{txn.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary hover:bg-primary/5">
                    View Full Ledger
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sync">
            <SyncPortal />
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-serif text-primary">Immutable Audit Ledger</CardTitle>
                    <CardDescription>Cryptographically signed logs of all Sovereign Engine operations.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="font-mono text-xs">
                    <Shield className="mr-2 h-3 w-3" /> Verify Chain
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Audit ID</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Integrity</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.length > 0 ? (
                      auditLogs.map((log, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-mono text-xs">AUDIT-{i + 1000}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] font-mono">{log.action}</Badge>
                          </TableCell>
                          <TableCell className="text-xs font-bold">{log.userId}</TableCell>
                          <TableCell className="text-xs text-secondary font-bold">99.9%</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1 text-[10px] text-green-600 font-bold">
                              <CheckCircle2 className="h-3 w-3" /> VERIFIED
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      [
                        { id: "AUDIT-9821", time: "2026-04-10 14:22", action: "DATA_SYNC", actor: "ADMIN-01", integrity: "99.8%", status: "VERIFIED" },
                        { id: "AUDIT-9820", time: "2026-04-10 13:45", action: "AUTH_LOGIN", actor: "AGENT-42", integrity: "100%", status: "VERIFIED" },
                        { id: "AUDIT-9819", time: "2026-04-10 12:10", action: "PII_STRIP", actor: "ENGINE", integrity: "99.9%", status: "VERIFIED" },
                      ].map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-xs">{log.id}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{log.time}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px] font-mono">{log.action}</Badge>
                          </TableCell>
                          <TableCell className="text-xs font-bold">{log.actor}</TableCell>
                          <TableCell className="text-xs text-secondary font-bold">{log.integrity}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1 text-[10px] text-green-600 font-bold">
                              <CheckCircle2 className="h-3 w-3" /> {log.status}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-serif text-primary">Field Agents</CardTitle>
                  <CardDescription>Manage and monitor your network of field researchers.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search agents..." className="pl-8 w-[250px]" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Region/District</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Integrity Score</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell className="font-mono text-xs">{agent.id}</TableCell>
                        <TableCell className="font-medium">{agent.name}</TableCell>
                        <TableCell>
                          <div className="text-sm">{agent.region}</div>
                          <div className="text-xs text-muted-foreground">{agent.district}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={agent.status === "Active" ? "border-green-500 text-green-600" : ""}>
                            {agent.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${agent.integrityScore > 90 ? 'bg-green-500' : agent.integrityScore > 70 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${agent.integrityScore}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold">{agent.integrityScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {agent.lastActive ? new Date(agent.lastActive).toLocaleDateString() : "Never"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fellowship">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif text-primary">Fellowship Pipeline</CardTitle>
                  <CardDescription>Automated induction and technical benchmarking for the next 500+ staff.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border bg-muted/5 space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                        <Zap className="h-4 w-4" />
                        <h3 className="font-bold">Automated Induction</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">Modules on the "StatGate Method" and the "Privacy Oath." Required for all field engineers.</p>
                      <Button variant="outline" size="sm" className="w-full">View Modules</Button>
                    </div>
                    <div className="p-4 rounded-xl border bg-muted/5 space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                        <Search className="h-4 w-4" />
                        <h3 className="font-bold">Technical Benchmarking</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">Real-time leaderboard for the top Data Scientists solving R/Python statistical problems.</p>
                      <Button variant="outline" size="sm" className="w-full">View Problems</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-primary flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-secondary" />
                      Top Fellows Leaderboard
                    </h3>
                    <div className="rounded-xl border overflow-hidden">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow>
                            <TableHead className="w-12">Rank</TableHead>
                            <TableHead>Fellow Name</TableHead>
                            <TableHead>Specialty</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {leaderboard.map((fellow) => (
                            <TableRow key={fellow.rank}>
                              <TableCell className="font-bold text-primary">#{fellow.rank}</TableCell>
                              <TableCell className="font-medium">{fellow.name}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-[10px]">{fellow.specialty}</Badge>
                              </TableCell>
                              <TableCell className="text-right font-mono font-bold text-secondary">{fellow.score}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-primary text-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-serif">The Privacy Oath</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-white/70 italic leading-relaxed">
                      "I solemnly swear to protect the sanctity of African data, to enforce the Architecture of Truth, and to ensure that no fabrication enters the Sovereign Engine."
                    </p>
                    <div className="pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span>CERTIFIED FELLOWS</span>
                        <span className="text-secondary">42 / 500</span>
                      </div>
                      <div className="h-1 w-full bg-white/10 rounded-full mt-2">
                        <div className="h-full bg-secondary w-[8.4%]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-bold">Active Challenges</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { title: "R/Tidyverse Cleaning", difficulty: "Hard", points: 250 },
                      { title: "PostGIS Spatial Query", difficulty: "Medium", points: 150 },
                      { title: "PII Anonymization Script", difficulty: "Expert", points: 400 },
                    ].map((challenge, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded border text-xs">
                        <div>
                          <div className="font-medium">{challenge.title}</div>
                          <div className="text-[10px] text-muted-foreground">{challenge.difficulty}</div>
                        </div>
                        <div className="font-bold text-primary">+{challenge.points}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sandbox">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-serif text-primary">Sovereign Data Sandbox</CardTitle>
                    <CardDescription>Run secure analysis scripts against anonymized EAC datasets.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="font-mono">R-KERNEL: ACTIVE</Badge>
                    <Badge variant="outline" className="font-mono">PYTHON-3.11: ACTIVE</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border bg-zinc-950 font-mono text-sm p-4 text-zinc-300 min-h-[300px]">
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8 text-zinc-400 hover:text-white hover:bg-zinc-800">
                        <Code2 className="h-4 w-4 mr-2" /> Format
                      </Button>
                      <Button size="sm" className="h-8 bg-green-600 hover:bg-green-500 text-white">
                        <Play className="h-4 w-4 mr-2" /> Run Script
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <p><span className="text-purple-400">library</span>(tidyverse)</p>
                      <p><span className="text-purple-400">library</span>(statgate_eac)</p>
                      <p>&nbsp;</p>
                      <p><span className="text-zinc-500"># Load anonymized district data</span></p>
                      <p>df {"<-"} <span className="text-yellow-400">load_sovereign_data</span>(district = <span className="text-green-400">"Kampala"</span>)</p>
                      <p>&nbsp;</p>
                      <p><span className="text-zinc-500"># Calculate integrity-weighted mean</span></p>
                      <p>results {"<-"} df {"%>%"} </p>
                      <p>&nbsp;&nbsp;<span className="text-yellow-400">group_by</span>(sub_county) {"%>%"} </p>
                      <p>&nbsp;&nbsp;<span className="text-yellow-400">summarise</span>(</p>
                      <p>&nbsp;&nbsp;&nbsp;&nbsp;avg_score = <span className="text-yellow-400">weighted.mean</span>(value, integrity_score)</p>
                      <p>&nbsp;&nbsp;)</p>
                      <p>&nbsp;</p>
                      <p><span className="text-yellow-400">print</span>(results)</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border bg-muted/30 font-mono text-xs space-y-2">
                    <p className="text-muted-foreground">Output Console:</p>
                    <p className="text-green-600">[SUCCESS] Script executed in 1.2s</p>
                    <p className="text-primary">Sub-County | Avg Score</p>
                    <p className="text-primary">-----------|----------</p>
                    <p className="text-primary">Central    | 94.2</p>
                    <p className="text-primary">Kawempe    | 88.7</p>
                    <p className="text-primary">Makindye   | 91.5</p>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-bold">Sandbox Constraints</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>PII Access: BLOCKED</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>External Network: BLOCKED</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>Export Limit: 50MB/day</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-primary text-white">
                  <CardHeader>
                    <CardTitle className="text-sm">Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[10px] opacity-80 mb-4">Our Lead Analysts are available to help you optimize your R/Python scripts for the Sovereign Engine.</p>
                    <Button variant="secondary" size="sm" className="w-full text-primary">Open Documentation</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-serif text-primary">District Reports</CardTitle>
                  <CardDescription>Monitor research progress and workflow status across regions.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Central</Button>
                  <Button variant="outline" size="sm">Northern</Button>
                  <Button variant="outline" size="sm">Western</Button>
                  <Button variant="outline" size="sm">Eastern</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>District/Region</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-mono text-xs">{report.id}</TableCell>
                        <TableCell className="font-medium">{report.title}</TableCell>
                        <TableCell>
                          <div className="text-sm">{report.district}</div>
                          <div className="text-xs text-muted-foreground">{report.region}</div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={report.status === "Completed" ? "default" : "secondary"}
                            className={report.status === "Completed" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                          >
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{report.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ledger">
             <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-primary">Financial Ledger</CardTitle>
                <CardDescription>Comprehensive tracking of all platform transactions.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                        <TableCell>{txn.date}</TableCell>
                        <TableCell className="font-medium">{txn.entity}</TableCell>
                        <TableCell>{txn.type}</TableCell>
                        <TableCell className="font-bold">{txn.amount}</TableCell>
                        <TableCell>
                          <Badge variant={txn.status === "Completed" ? "default" : "secondary"}>
                            {txn.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-primary">Sovereign Audit Ledger</CardTitle>
                <CardDescription>Immutable record of all system actions and data refinements.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell className="font-bold text-primary">{log.user_id || log.userId}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-[10px] uppercase">
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.entity}</TableCell>
                        <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                          {JSON.stringify(log.changes)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {currentUser.role === "Sovereign Admin" && (
            <TabsContent value="users">
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-serif text-primary">User Management</CardTitle>
                    <CardDescription>Manage Sovereign Identities and RBAC assignments.</CardDescription>
                  </div>
                  <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                    <DialogTrigger render={<Button className="bg-primary text-white">Create User</Button>} />
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Account</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCreateUser} className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email Address</label>
                          <Input 
                            type="email" 
                            required 
                            placeholder="user@example.com"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Password</label>
                          <Input 
                            type="password" 
                            required 
                            placeholder="Secure password"
                            value={newUserPassword}
                            onChange={(e) => setNewUserPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 flex flex-col">
                          <label className="text-sm font-medium">Role</label>
                          <select 
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={newUserRole}
                            onChange={(e) => setNewUserRole(e.target.value)}
                          >
                            <option value="Sovereign Admin">Sovereign Admin</option>
                            <option value="Lead Analyst">Lead Analyst</option>
                            <option value="Field Agent">Field Agent</option>
                            <option value="Vendor Partner">Vendor Partner</option>
                            <option value="Engineer">Engineer</option>
                          </select>
                        </div>
                        <DialogFooter className="pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsCreateUserOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isCreatingUser}>
                            {isCreatingUser ? "Creating..." : "Create Account"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-mono text-xs">{user.id}</TableCell>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-none">
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">Deactivate</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="datalab">
            <DataLab />
          </TabsContent>

          <TabsContent value="chat">
            <ChatPortal />
          </TabsContent>

          <TabsContent value="hub">
            <MeetingHub />
          </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
