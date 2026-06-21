import { motion } from "motion/react";
import { Database, LineChart, Search, TrendingUp, CheckCircle2 } from "lucide-react";

export default function StatgateUgandaValues() {
  return (
    <section className="bg-white py-16 border-t border-b border-gray-100">
      <div className="container mx-auto px-4">
        
        {/* Statistics Tip Banner */}
        <div className="bg-[#0A1D56] text-white rounded-2xl p-8 md:p-12 mb-16 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <TrendingUp size={240} />
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#FFC107] text-[#0A1D56] font-bold px-4 py-1.5 rounded-full text-sm tracking-wide">
                STATISTICAL QUOTE OF THE DAY
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 italic leading-tight">
              <span className="text-[#FFC107] text-6xl leading-none absolute -ml-10 -mt-4 font-serif">"</span>
              IN GOD WE TRUST, ALL OTHERS MUST BRING <span className="text-[#FFC107]">DATA.</span>
            </h2>
            <p className="text-xl text-gray-300 font-medium mb-8">
              — W. Edwards Deming
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl inline-flex items-start gap-4">
              <div className="bg-[#FFC107] p-2 rounded-lg text-[#0A1D56] mt-1">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 hidden md:block">Good decisions start with good data.</h4>
                <p className="text-gray-200">Data gives us clarity, reduces guesswork, and helps us make decisions that create real impact.</p>
              </div>
            </div>
          </div>
        </div>

        {/* The Core Mantra */}
        <div className="bg-[#0A1D56] rounded-xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-lg">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full border-4 border-[#FFC107] flex items-center justify-center bg-blue-900/50">
              <div className="w-8 h-8 rounded-full bg-[#FFC107] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#0A1D56]"></div>
              </div>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-wider uppercase mb-1">
                We Collect. We Analyze. We Inform.
              </h3>
              <div className="text-2xl md:text-3xl font-extrabold text-[#FFC107] uppercase tracking-widest">
                YOU TRANSFORM.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-white">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center bg-white/5">
                <Database size={24} />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">DATA</span>
            </div>
            
            <div className="hidden lg:block w-8 h-px bg-white/30"></div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center bg-white/5">
                <LineChart size={24} />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">ANALYTICS</span>
            </div>

            <div className="hidden lg:block w-8 h-px bg-white/30"></div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center bg-white/5">
                <Search size={24} />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">INSIGHT</span>
            </div>

            <div className="hidden lg:block w-8 h-px bg-white/30"></div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center bg-white/5 text-[#FFC107] border-[#FFC107]">
                <TrendingUp size={24} />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider text-[#FFC107]">IMPACT</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
