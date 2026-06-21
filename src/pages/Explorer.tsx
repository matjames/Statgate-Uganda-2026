import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Database, Filter, Search, Download, BarChart2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

export default function Explorer() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const { token } = useAuth();
  const [datasets, setDatasets] = useState<any[]>([]);
  const [activeDataset, setActiveDataset] = useState<string>("DS-001");
  const [records, setRecords] = useState<any[]>([]);

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

  useEffect(() => {
    if (!activeDataset || !token) return;
    fetch(`/api/v1/datasets/${activeDataset}/records`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setRecords(data))
      .catch(err => console.error("Failed to load records for dataset:", err));
  }, [activeDataset, token]);

  const [queryState, setQueryState] = useState<{dimensions: string[], metrics: string[]}>({
    dimensions: ["district", "status"],
    metrics: ["population", "integrityScore"]
  });

  const [queryResults, setQueryResults] = useState<any>(null);
  const [isRunningQuery, setIsRunningQuery] = useState(false);

  const runMultidimensionalQuery = async () => {
    if (!token) return;
    setIsRunningQuery(true);
    try {
      const res = await fetch("/api/v1/analytics/query", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dimensions: queryState.dimensions,
          metrics: queryState.metrics,
          filters: {}
        })
      });
      const data = await res.json();
      setQueryResults(data);
    } catch (err) {
      console.error("Query failed", err);
    } finally {
      setIsRunningQuery(false);
    }
  };

  useEffect(() => {
    runMultidimensionalQuery();
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

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-primary font-serif">Data Explorer</h1>
              <Badge variant="outline" className="font-mono bg-green-500/10 text-green-600 border-green-500/20">
                LIVE
              </Badge>
            </div>
            <p className="text-muted-foreground">Query, filter, and extract intelligence from national datasets.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <BarChart2 className="mr-2 h-4 w-4" /> Visualize
            </Button>
            <Button className="bg-primary">
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Datasets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {datasets.map((dataset) => (
                  <Button 
                    key={dataset.id}
                    variant="ghost" 
                    className={`w-full justify-start ${activeDataset === dataset.id ? 'bg-primary/5 text-primary' : ''}`}
                    onClick={() => setActiveDataset(dataset.id)}
                  >
                    <Database className="mr-2 h-4 w-4" /> {dataset.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Query Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dimensions</label>
                  <div className="flex flex-wrap gap-2">
                    {["district", "region", "year", "status"].map(dim => (
                       <Badge 
                         key={dim}
                         variant={queryState.dimensions.includes(dim) ? "default" : "outline"}
                         className="cursor-pointer"
                         onClick={() => toggleDimension(dim)}
                       >
                         {dim}
                       </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Metrics</label>
                  <div className="flex flex-wrap gap-2">
                    {["population", "growthRate", "integrityScore"].map(met => (
                       <Badge 
                         key={met}
                         variant={queryState.metrics.includes(met) ? "default" : "outline"}
                         className="cursor-pointer"
                         onClick={() => toggleMetric(met)}
                       >
                         {met}
                       </Badge>
                    ))}
                  </div>
                </div>
                <Button className="w-full bg-secondary" onClick={runMultidimensionalQuery} disabled={isRunningQuery}>
                  <Filter className="mr-2 h-4 w-4" /> {isRunningQuery ? "Running Query..." : "Execute Query"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <Card className="h-full min-h-[500px]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">{activeDatasetName}: Multidimensional Query</CardTitle>
                    {queryResults && (
                      <CardDescription>
                        Execution Time: {queryResults.executionTimeMs}ms • Rows: {queryResults.rowCount}
                      </CardDescription>
                    )}
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search results..." className="pl-8 w-[250px]" value={query} onChange={(e) => setQuery(e.target.value)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {queryState.dimensions.map(dim => (
                          <TableHead key={dim} className="capitalize">{dim}</TableHead>
                        ))}
                        {queryState.metrics.map(met => (
                          <TableHead key={met} className="capitalize">{met}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {queryResults ? queryResults.data.map((row: any, i: number) => (
                        <TableRow key={i}>
                          {queryState.dimensions.map(dim => (
                            <TableCell key={dim} className="font-medium">
                              {dim === "status" ? (
                                <Badge variant={row[dim] === 'Verified' ? 'default' : 'secondary'}>
                                  {row[dim]}
                                </Badge>
                              ) : row[dim]}
                            </TableCell>
                          ))}
                          {queryState.metrics.map(met => (
                            <TableCell key={met}>{row[met]}</TableCell>
                          ))}
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={queryState.dimensions.length + queryState.metrics.length} className="text-center py-10">
                            No data available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
