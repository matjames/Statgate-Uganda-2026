import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Calculator, 
  TrendingUp, 
  Database, 
  FileJson, 
  Download, 
  RefreshCw,
  BrainCircuit,
  Zap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DataLab() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const mockData = [
    { name: 'Kampala', value: 400, integrity: 98 },
    { name: 'Gulu', value: 300, integrity: 95 },
    { name: 'Mbarara', value: 200, integrity: 97 },
    { name: 'Jinja', value: 278, integrity: 96 },
    { name: 'Arua', value: 189, integrity: 94 },
  ];

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem("statgate_token");
      const response = await fetch("/api/v1/analysis/compute", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          data: mockData, 
          metrics: ["mean", "variance", "confidence"] 
        }),
      });
      const data = await response.json();
      setAnalysisResults(data.results);
      toast.success("Statistical Computation Complete");
    } catch (error) {
      toast.error("Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-primary">Statistician Data Lab</h2>
          <p className="text-muted-foreground">Advanced analytical tools for Sovereign Engine data.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button 
            onClick={runAnalysis} 
            disabled={isAnalyzing}
            className="bg-secondary hover:bg-secondary/90"
          >
            {isAnalyzing ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Calculator className="mr-2 h-4 w-4" />
            )}
            Compute Statistics
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Regional Distribution</CardTitle>
            <CardDescription>Volume of data points collected per district.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="value" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Integrity Audit</CardTitle>
            <CardDescription>Data quality score by region.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="integrity"
                >
                  {mockData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {analysisResults ? (
          analysisResults.map((res: any, i: number) => (
            <Card key={i} className="bg-primary/5 border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  {res.metric}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{res.value}</div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-4 p-8 text-center border-2 border-dashed rounded-xl text-muted-foreground">
            Run statistical computation to see results.
          </div>
        )}
      </div>

      <Card className="border-secondary/20 bg-secondary/5">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="p-2 rounded-lg bg-secondary text-white">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg font-serif text-secondary">Gemini Insights</CardTitle>
            <CardDescription className="text-secondary/70">AI-powered interpretation of current trends.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white border border-secondary/10 text-sm italic text-muted-foreground">
              "Based on the current regional distribution, Kampala shows the highest data density with a 98% integrity score. Recommendation: Shift field resources to Arua to balance geospatial coverage while maintaining the Sovereign Engine's quality standards."
            </div>
            <Button variant="outline" size="sm" className="w-full border-secondary text-secondary hover:bg-secondary/5">
              <Zap className="mr-2 h-3 w-3" /> Generate Detailed Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
