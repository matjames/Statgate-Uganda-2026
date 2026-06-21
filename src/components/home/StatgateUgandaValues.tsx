import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Database, LineChart, Search, TrendingUp, CheckCircle2 } from "lucide-react";

const STATISTICAL_TIPS = [
  {
    quote: "Raw data is noisy. Statistics makes sense out of it.",
    author: "StatGate Uganda",
    label: "DATA ANALYSIS TIP",
    description: "Data gives us clarity, reduces guesswork, and helps us make decisions that create real impact.",
    heading: "Good decisions start with good data."
  },
  {
    quote: "IN GOD WE TRUST, ALL OTHERS MUST BRING DATA.",
    author: "W. Edwards Deming",
    label: "STATISTICAL QUOTE OF THE DAY",
    description: "What gets measured, gets managed. What gets analyzed, gets improved.",
    heading: "Measure to Manage."
  },
  {
    quote: "Correlation doesn't mean causation. Look deeper. Think smarter. Decide better.",
    author: "StatGate Data Science",
    label: "STATISTICS TIP OF THE DAY",
    description: "Are two events related, or just coincidentally happening together? Always verify.",
    heading: "Verify before concluding."
  },
  {
    quote: "Numbers tell you what happened. Statistics tell you why it matters.",
    author: "StatGate Analytics",
    label: "ANALYTICS INSIGHT",
    description: "Don't just collect data. Understand it. Use it. Impact lives.",
    heading: "Move from 'What' to 'Why'."
  },
  {
    quote: "Good data + Good methods = Powerful decisions.",
    author: "StatGate Architecture",
    label: "CORE EQUATION",
    description: "In every equation, ensure the inputs are verified and the methods are sound.",
    heading: "Quality In, Quality Out."
  },
  {
    quote: "Data doesn't make decisions. People do. Statistics ensures those decisions are informed.",
    author: "StatGate Policy Team",
    label: "POLICY INSIGHT",
    description: "Behind every number is a life, a community, or a sector waiting to be optimized.",
    heading: "Empower the decision makers."
  },
  {
    quote: "Behind every powerful insight are 5 statistical principles.",
    author: "StatGate Uganda",
    label: "CORE PILLARS",
    description: "Relevance. Accuracy. Analysis. Interpretation. Application.",
    heading: "The Five Pillars of Truth."
  },
  {
    quote: "In every equation, a father is the most important constant.",
    author: "StatGate Leadership",
    label: "FATHER'S DAY SPECIAL",
    description: "Celebrating the demographic constants that hold society together.",
    heading: "Happy Father's Day."
  },
  {
    quote: "Weekends are for recharging. Mondays are for transforming.",
    author: "StatGate Leadership",
    label: "LEADERSHIP NOTE",
    description: "Accelerating the momentum to build a structurally robust data ecosystem.",
    heading: "Transformative Mondays."
  }
];

export default function StatgateUgandaValues() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % STATISTICAL_TIPS.length);
    }, 8000); // Rotate every 8 seconds
    return () => clearInterval(timer);
  }, []);

  const activeTip = STATISTICAL_TIPS[currentTipIndex];

  return (
    <section className="bg-white py-16 border-t border-b border-gray-100">
      <div className="container mx-auto px-4">
        
        {/* Statistics Tip Banner */}
        <div className="bg-[#0A1D56] text-white rounded-2xl p-8 md:p-12 mb-16 shadow-xl relative overflow-hidden h-[450px] md:h-[400px]">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <TrendingUp size={240} />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentTipIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 max-w-3xl h-full flex flex-col justify-center"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#FFC107] text-[#0A1D56] font-bold px-4 py-1.5 rounded-full text-sm tracking-wide shadow-sm">
                  {activeTip.label}
                </span>
                <span className="text-white/60 text-sm font-medium border border-white/20 px-3 py-1 rounded-full">
                  Tip {currentTipIndex + 1} of {STATISTICAL_TIPS.length}
                </span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6 italic leading-tight">
                <span className="text-[#FFC107] text-6xl leading-none absolute -ml-10 -mt-4 font-serif">"</span>
                {activeTip.quote.toUpperCase().replace('DATA', '<span class="text-[#FFC107]">DATA</span>')}
              </h2>
              <p className="text-xl text-gray-300 font-medium mb-8">
                — {activeTip.author}
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-5 rounded-xl inline-flex items-start gap-4 shadow-inner">
                <div className="bg-[#FFC107] p-2 rounded-lg text-[#0A1D56] mt-1 shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1 hidden md:block text-white">{activeTip.heading}</h4>
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed">{activeTip.description}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Progress Indicators */}
          <div className="absolute bottom-6 left-8 md:left-12 flex gap-2 z-20">
            {STATISTICAL_TIPS.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentTipIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentTipIndex ? 'w-8 bg-[#FFC107]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                aria-label={`Go to tip ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* The Core Mantra */}
        <div className="bg-[#0A1D56] rounded-xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1D56] to-blue-900/80 z-0"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-full border-4 border-[#FFC107] flex items-center justify-center bg-blue-900/50 shadow-[0_0_15px_rgba(255,193,7,0.3)]">
              <div className="w-8 h-8 rounded-full bg-[#FFC107] flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#0A1D56]"></div>
              </div>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white tracking-wider uppercase mb-1">
                We Collect. We Analyze. We Inform.
              </h3>
              <div className="text-2xl md:text-3xl font-extrabold text-[#FFC107] uppercase tracking-widest drop-shadow-md">
                YOU TRANSFORM.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-white relative z-10">
            <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-300 delay-0">
              <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                <Database size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">DATA</span>
            </div>
            
            <div className="hidden lg:block w-8 h-px bg-white/30 truncate"></div>
            
            <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-300 delay-100">
              <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                <LineChart size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">ANALYTICS</span>
            </div>

            <div className="hidden lg:block w-8 h-px bg-white/30"></div>

            <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-300 delay-200">
              <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center bg-white/5 backdrop-blur-sm">
                <Search size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">INSIGHT</span>
            </div>

            <div className="hidden lg:block w-8 h-px bg-white/30"></div>

            <div className="flex flex-col items-center gap-2 group-hover:scale-110 transition-transform duration-300 delay-300">
              <div className="w-14 h-14 rounded-full border-2 border-[#FFC107] flex items-center justify-center bg-[#FFC107]/10 text-[#FFC107] shadow-[0_0_15px_rgba(255,193,7,0.2)]">
                <TrendingUp size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFC107]">IMPACT</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
