import { buttonVariants } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight, ShieldCheck, Users, BarChart3, Database } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(#0A1D56_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>
      
      <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none">
        <Database size={600} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center rounded-full border border-[#FFC107]/50 bg-[#FFC107]/10 px-4 py-1.5 text-sm font-bold text-[#0A1D56] shadow-sm uppercase tracking-wide"
          >
            <ShieldCheck className="mr-2 h-4 w-4 text-[#FFC107]" />
            National Data Intelligence Operating System
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 text-5xl font-extrabold tracking-tighter text-[#0A1D56] sm:text-7xl uppercase max-w-4xl"
          >
            Sovereign Data. <br/><span className="text-[#FFC107]">Informed Decisions.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 max-w-2xl text-xl text-slate-600 font-medium"
          >
            StatGate Uganda transforms raw national data into actionable intelligence. 
            We secure field research, ensure ethical data collection, and provide real-time 
            analytics for strategic national development.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
          >
            <Link to="/explorer" className={`${buttonVariants({ size: "lg" })} bg-[#0A1D56] hover:bg-[#0A1D56]/90 text-white font-bold px-8 shadow-lg shadow-blue-900/20`}>
              Open Data Explorer <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link to="/dashboard" className={`${buttonVariants({ variant: "outline", size: "lg" })} border-[#0A1D56] text-[#0A1D56] font-bold hover:bg-[#0A1D56]/5 px-8`}>
              Command Center
            </Link>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="mt-24 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              icon: Database,
              title: "Sovereign Infrastructure",
              description: "Ensure national data remains secure, compliant, and governed under rigorous ethical frameworks.",
            },
            {
              icon: BarChart3,
              title: "Multidimensional Analytics",
              description: "Query, filter, and extract precise intelligence from massive datasets in real-time.",
            },
            {
              icon: Users,
              title: "Field Deployment",
              description: "Track recruitment, coordinate field operations, and monitor data enumerators nationwide.",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="rounded-2xl border-2 border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 group"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-[#0A1D56] group-hover:bg-[#FFC107] group-hover:text-[#0A1D56] transition-colors">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#0A1D56]">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
