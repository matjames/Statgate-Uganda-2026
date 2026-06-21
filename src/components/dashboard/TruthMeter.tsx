import { ShieldCheck, Activity } from "lucide-react";

export default function TruthMeter({ score }: { score: number }) {
  return (
    <div className="p-6 rounded-2xl bg-primary text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <ShieldCheck size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-secondary h-5 w-5" />
          <span className="text-xs font-mono uppercase tracking-widest text-secondary">The Truth Meter</span>
        </div>
        
        <div className="flex items-end gap-3 mb-6">
          <span className="text-6xl font-bold font-serif">{score}%</span>
          <span className="text-sm font-mono text-secondary mb-2">INTEGRITY</span>
        </div>
        
        <div className="space-y-3">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary transition-all duration-1000" 
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-white/60">
            <span>GPS VERIFIED</span>
            <span>AUDIO AUDITED</span>
            <span>ZERO FABRICATION</span>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-xs text-white/80 leading-relaxed">
            Current aggregate integrity score across 146 districts. 
            Enforced by the Sovereign Engine V2.0 Audit Trail.
          </p>
        </div>
      </div>
    </div>
  );
}
