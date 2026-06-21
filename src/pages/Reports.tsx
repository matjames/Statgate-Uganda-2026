import { useState, useEffect } from "react";
import { BookOpen, Download, FileText, Search, Plus } from "lucide-react";
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

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-primary font-serif">Reports & Publications</h1>
              <Badge variant="outline" className="font-mono bg-purple-500/10 text-purple-600 border-purple-500/20">
                OFFICIAL
              </Badge>
            </div>
            <p className="text-muted-foreground">Access, generate, and export official analytical reports.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> New Template
            </Button>
            <Button className="bg-primary">
              <Download className="mr-2 h-4 w-4" /> Generate Report
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Available Reports</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search reports..." className="pl-8 w-[250px]" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date Published</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.filter(r => r.title.toLowerCase().includes(query.toLowerCase())).map((report, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {report.title}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{report.category}</Badge></TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.author}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Download PDF</Button>
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
