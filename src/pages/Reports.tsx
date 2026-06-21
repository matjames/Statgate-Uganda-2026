import { useState, useEffect } from "react";
import { BookOpen, Download, FileText, Search, Plus, BarChart, Printer, Share2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/lib/auth";

export default function Reports() {
  const { token } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch("/api/v1/reports", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error("Failed to load reports:", err));
  }, [token]);

  const filteredReports = reports.filter(r => r.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        
        {/* Quote Banner */}
        <div className="bg-[#0A1D56] text-white rounded-xl p-6 mb-8 shadow-md flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <Badge className="bg-[#FFC107] text-[#0A1D56] mb-2 uppercase hover:bg-[#FFC107]">Phase 7 Active</Badge>
            <h2 className="text-2xl font-bold tracking-tight">Intelligence Summaries</h2>
            <p className="text-gray-300 font-medium mt-1">Raw data is noisy. Statistics makes sense out of it.</p>
          </div>
          <FileText className="hidden md:block absolute right-8 text-white/10" size={100} />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-[#0A1D56] font-serif uppercase tracking-tight">Reports & Publications</h1>
            </div>
            <p className="text-muted-foreground mt-1">Access, generate, and export official analytical reports.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-[#0A1D56] text-[#0A1D56] hover:bg-[#0A1D56]/5 font-bold">
              <BarChart className="mr-2 h-4 w-4" /> Custom Builder
            </Button>
            <Button className="bg-[#0A1D56] text-white hover:bg-[#0A1D56]/90 font-bold px-6">
              <Plus className="mr-2 h-4 w-4" /> New Report
            </Button>
          </div>
        </div>

        <Card className="border-0 shadow-sm overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b pb-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <CardTitle className="text-xl text-[#0A1D56]">Sovereign Register</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by keyword, author..." 
                  className="pl-9 w-full md:w-[350px] bg-white border-slate-200 rounded-xl focus-visible:ring-[#0A1D56]" 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50 border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-[#0A1D56] py-4 pl-6">Report Title</TableHead>
                  <TableHead className="font-bold text-[#0A1D56] py-4">Category</TableHead>
                  <TableHead className="font-bold text-[#0A1D56] py-4">Date Published</TableHead>
                  <TableHead className="font-bold text-[#0A1D56] py-4">Author</TableHead>
                  <TableHead className="font-bold text-[#0A1D56] py-4 text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        No official reports found matching your query.
                     </TableCell>
                   </TableRow>
                ) : filteredReports.map((report, idx) => (
                  <TableRow key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium pl-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#0A1D56]/5 rounded-lg shrink-0">
                          <FileText className="h-4 w-4 text-[#0A1D56]" />
                        </div>
                        <span className="text-[#0A1D56]">{report.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-100 border-slate-200 text-slate-700 font-medium">
                        {report.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">{report.date}</TableCell>
                    <TableCell className="text-slate-600 font-medium">{report.author}</TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-[#0A1D56]">
                          <Share2 className="h-4 w-4" />
                          <span className="sr-only">Share</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-[#0A1D56]">
                          <Printer className="h-4 w-4" />
                          <span className="sr-only">Print</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 gap-1 border-slate-200 ml-1 hover:bg-[#0A1D56]/5 text-[#0A1D56] font-medium">
                          <Download className="h-3.5 w-3.5" /> 
                          {report.format}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
