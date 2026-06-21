import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Database, Filter, Search, Download, BarChart2, Lightbulb, PieChart as PieChartIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

const COLORS = ['#0A1D56', '#FFC107', '#4CAF50', '#2196F3', '#FF5722'];

export default function Explorer() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const { token } = useAuth();
  const [datasets, setDatasets] = useState<any[]>([]);
  const [activeDataset, setActiveDataset] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "chart">("chart");
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");

  const [queryState, setQueryState] = useState<{dimensions: string[], metrics: string[]}>({
    dimensions: ["district"],
    metrics: ["population", "growthRate"]
  });

  const [isRunningQuery, setIsRunningQuery] = useState(false);
  const [queryResults, setQueryResults] = useState<any>({
    data: [],
    executionTimeMs: 0,
    rowCount: 0
  });

  useEffect(() => {
    if (!token) return;
    fetch("/api/v1/datasets", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setDatasets(data);
        if (data.length > 0) setActiveDataset(data[0].id);
      })
      .catch(err => console.error("Failed to load datasets:", err));
  }, [token]);

  const activeDatasetName = datasets.find(d => d.id === activeDataset)?.name || "Loading...";

  const toggleDimension = (dim: string) => {
    setQueryState(prev => ({
      ...prev,
      dimensions: prev.dimensions.includes(dim) 
        ? prev.dimensions.filter(d => d !== dim)
        : [...prev.dimensions, dim]
    }));
  };

  const toggleMetric = (met: string) => {
    setQueryState(prev => ({
      ...prev,
      metrics: prev.metrics.includes(met) 
        ? prev.metrics.filter(m => m !== met)
        : [...prev.metrics, met]
    }));
  };

  const runMultidimensionalQuery = async () => {
    if (!activeDataset) return;
    setIsRunningQuery(true);
    const start = performance.now();
    try {
      const res = await fetch(`/api/v1/datasets/${activeDataset}/records`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      // Post-process the metric properties to numbers if they are strings
      const processedData = data.map((row: any) => {
        const nr = { ...row };
        if (typeof nr.population === "string") {
          nr.population = parseInt(nr.population.replace(/,/g, ''));
        }
        if (typeof nr.growthRate === "string") {
          nr.growthRate = parseFloat(nr.growthRate.replace(/[^0-9.-]/g, ''));
        }
        return nr;
      });

      const end = performance.now();
      setQueryResults({
        data: processedData,
        executionTimeMs: Math.round(end - start),
        rowCount: processedData.length
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningQuery(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Quote Banner */}
        <div className="bg-[#0A1D56] text-white rounded-xl p-6 mb-8 shadow-md flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <Badge className="bg-[#FFC107] text-[#0A1D56] mb-2">PHASE 7 ACTIVE</Badge>
            <h2 className="text-2xl font-bold tracking-tight">Data Explorer Dominance</h2>
            <p className="text-gray-300">Raw data is noisy. Statistics makes sense out of it.</p>
          </div>
          <Lightbulb className="hidden md:block absolute right-8 text-white/10" size={100} />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-[#0A1D56] font-serif uppercase tracking-tight">System Explorer</h1>
            </div>
            <p className="text-muted-foreground mt-1">Multi-dimensional analytics, filtering, and data extraction.</p>
          </div>
          <div className="flex gap-2 bg-white rounded-lg p-1 border shadow-sm">
             <Button 
                variant={viewMode === "chart" ? "default" : "ghost"} 
                className={viewMode === "chart" ? "bg-[#0A1D56]" : ""}
                size="sm" onClick={() => setViewMode("chart")}
             >
                <BarChart2 className="mr-2 h-4 w-4" /> Visualize
             </Button>
             <Button 
                variant={viewMode === "table" ? "default" : "ghost"} 
                className={viewMode === "table" ? "bg-[#0A1D56]" : ""}
                size="sm" onClick={() => setViewMode("table")}
             >
                <Database className="mr-2 h-4 w-4" /> Raw Data
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-0 shadow-sm border-t-4 border-t-[#0A1D56]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">National Datasets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {datasets.map((dataset) => (
                  <Button 
                    key={dataset.id}
                    variant="ghost" 
                    className={`w-full justify-start ${activeDataset === dataset.id ? 'bg-[#0A1D56] text-white hover:bg-[#0A1D56]/90 hover:text-white' : ''}`}
                    onClick={() => setActiveDataset(dataset.id)}
                  >
                    <Database className="mr-2 h-4 w-4" /> {dataset.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Query Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground">DIMENSIONS (X-AXIS)</label>
                  <div className="flex flex-wrap gap-2">
                    {["district", "region", "year", "status"].map(dim => (
                       <Badge 
                         key={dim}
                         variant={queryState.dimensions.includes(dim) ? "default" : "outline"}
                         className={`cursor-pointer ${queryState.dimensions.includes(dim) ? "bg-[#0A1D56]" : ""}`}
                         onClick={() => toggleDimension(dim)}
                       >
                         {dim}
                       </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground">METRICS (Y-AXIS)</label>
                  <div className="flex flex-wrap gap-2">
                    {["population", "growthRate", "integrityScore"].map(met => (
                       <Badge 
                         key={met}
                         variant={queryState.metrics.includes(met) ? "default" : "outline"}
                         className={`cursor-pointer ${queryState.metrics.includes(met) ? "bg-[#0A1D56]" : ""}`}
                         onClick={() => toggleMetric(met)}
                       >
                         {met}
                       </Badge>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-[#FFC107] hover:bg-[#FFC107]/90 text-[#0A1D56] font-bold" onClick={runMultidimensionalQuery} disabled={isRunningQuery}>
                  <Filter className="mr-2 h-4 w-4" /> {isRunningQuery ? "Running..." : "Execute Query"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <Card className="h-full min-h-[500px] border-0 shadow-sm">
              <CardHeader className="border-b bg-gray-50/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl text-[#0A1D56]">{activeDatasetName}</CardTitle>
                    {queryResults && (
                      <CardDescription className="font-mono text-xs mt-1">
                        EXECUTION_TIME: {queryResults.executionTimeMs}ms • ROWS: {queryResults.rowCount}
                      </CardDescription>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {viewMode === "chart" && (
                      <div className="flex items-center gap-1 border rounded-md p-1 bg-white mr-2">
                        <Button variant={chartType === 'bar' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setChartType('bar')}><BarChart2 size={14} /></Button>
                        <Button variant={chartType === 'line' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setChartType('line')}><Area size={14} /></Button>
                        <Button variant={chartType === 'pie' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setChartType('pie')}><PieChartIcon size={14} /></Button>
                      </div>
                    )}
                    <Button variant="outline" size="sm">
                       <Download className="mr-2 h-3 w-3" /> Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {viewMode === "chart" ? (
                  <div className="w-full h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'bar' ? (
                        <BarChart data={queryResults.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="district" axisLine={false} tickLine={false} className="text-xs" />
                          <YAxis axisLine={false} tickLine={false} className="text-xs" />
                          <RechartsTooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                          <Legend wrapperStyle={{fontSize: '12px'}}/>
                          <Bar dataKey="population" name="Population" fill="#0A1D56" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="integrityScore" name="Integrity Score" fill="#FFC107" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      ) : chartType === 'line' ? (
                        <AreaChart data={queryResults.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                           <defs>
                            <linearGradient id="colorPop" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0A1D56" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#0A1D56" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                          <XAxis dataKey="district" axisLine={false} tickLine={false} className="text-xs" />
                          <YAxis axisLine={false} tickLine={false} className="text-xs" />
                          <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                          <Legend wrapperStyle={{fontSize: '12px'}}/>
                          <Area type="monotone" dataKey="population" name="Population" stroke="#0A1D56" fillOpacity={1} fill="url(#colorPop)" strokeWidth={2} />
                        </AreaChart>
                      ) : (
                        <PieChart>
                          <Pie
                            data={queryResults.data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={140}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="population"
                            label={({district}) => district}
                          >
                            {queryResults.data.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          {queryState.dimensions.map(dim => (
                            <TableHead key={dim} className="capitalize font-bold text-gray-700">{dim}</TableHead>
                          ))}
                          {queryState.metrics.map(met => (
                            <TableHead key={met} className="capitalize font-bold text-gray-700">{met}</TableHead>
                          ))}
                          <TableHead className="font-bold text-gray-700">Audit Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {queryResults && queryResults.data.map((row: any, i: number) => (
                          <TableRow key={i}>
                            {queryState.dimensions.map(dim => (
                              <TableCell key={dim} className="font-medium">
                                {row[dim]}
                              </TableCell>
                            ))}
                            {queryState.metrics.map(met => (
                              <TableCell key={met} className="font-mono">
                                {row[met].toLocaleString()}
                              </TableCell>
                            ))}
                            <TableCell>
                              <Badge variant={row.verified === 'Yes' ? 'default' : 'secondary'} className={row.verified === 'Yes' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}>
                                {row.verified === 'Yes' ? 'Verified' : 'Pending'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
