import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, ShieldCheck, Lock, Globe, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ParticipantPortal() {
  const [truthId, setTruthId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!truthId) return;
    
    setIsSearching(true);
    // Simulate lookup
    setTimeout(() => {
      setResult({
        id: truthId,
        status: "Anonymized & Committed",
        timestamp: new Date().toLocaleString(),
        location: "Kampala Central",
        integrityScore: "99.2%",
        isPiiRemoved: true,
        ledgerHash: "0x7a...f2e4"
      });
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <ShieldCheck size={48} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary font-serif">Participant Truth Portal</h1>
          <p className="text-muted-foreground text-lg">
            Verify the sanctity and anonymity of your data within the Sovereign Engine.
          </p>
        </div>

        <Card className="border-2 border-primary/10 shadow-xl mb-8">
          <CardHeader>
            <CardTitle>Verify Your Data</CardTitle>
            <CardDescription>Enter the Truth ID provided to you at the end of your interview.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="e.g. TRUTH-12345-XYZ" 
                  className="pl-10 h-12"
                  value={truthId}
                  onChange={(e) => setTruthId(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-12 px-8 bg-primary hover:bg-primary/90" disabled={isSearching}>
                {isSearching ? "Verifying..." : "Search"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" /> Data Verified
                  </CardTitle>
                  <CardDescription>Your contribution is safe and anonymized.</CardDescription>
                </div>
                <Badge className="bg-green-600">SECURE</Badge>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-mono">Status</p>
                  <p className="font-bold text-primary">{result.status}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-mono">Committed At</p>
                  <p className="font-bold text-primary">{result.timestamp}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-mono">Integrity Score</p>
                  <p className="font-bold text-secondary">{result.integrityScore}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase font-mono">Ledger Hash</p>
                  <p className="font-mono text-xs truncate">{result.ledgerHash}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border bg-background flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Lock size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-mono">PII Status</p>
                  <p className="text-xs font-bold">STRIPPED</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border bg-background flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-mono">Storage</p>
                  <p className="text-xs font-bold">LOCAL (UG)</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border bg-background flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-mono">Usage</p>
                  <p className="text-xs font-bold">RESEARCH ONLY</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
