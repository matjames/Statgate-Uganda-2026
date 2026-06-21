import { motion } from "motion/react";
import { BarChart3, Shield, Users, LineChart, Cpu, BookOpen, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SERVICES = [
  {
    icon: BarChart3,
    title: "National Data Intelligence",
    description: "Multi-dimensional demographic modeling, real-time national statistics, and socio-economic profiling at scale.",
    link: "/explorer",
    bg: "bg-blue-50/50",
    color: "text-blue-700"
  },
  {
    icon: Shield,
    title: "Governance & Sovereignty",
    description: "Enforcing strict internal data lineage, RBAC policies, and auditable pipelines to maintain institutional trust.",
    link: "/governance",
    bg: "bg-emerald-50/50",
    color: "text-emerald-700"
  },
  {
    icon: LineChart,
    title: "Sovereign Analytics",
    description: "Translating raw survey and census data into actionable, compliant impact reports for stakeholders.",
    link: "/reports",
    bg: "bg-purple-50/50",
    color: "text-purple-700"
  },
  {
    icon: Cpu,
    title: "AI Policy Simulation",
    description: "Using predictive intelligence and statistical models to simulate the outcomes of institutional policies.",
    link: "/ai",
    bg: "bg-rose-50/50",
    color: "text-rose-700"
  },
  {
    icon: Users,
    title: "Field Deployment Engine",
    description: "GPS-verified, offline-first enumerator onboarding, training, and logistical command centers.",
    link: "/recruitment",
    bg: "bg-amber-50/50",
    color: "text-amber-700"
  },
  {
    icon: BookOpen,
    title: "Ethics & Compliance",
    description: "Rigorous frameworks ensuring consent-driven data collection and participant confidentiality.",
    link: "/ethics",
    bg: "bg-slate-100",
    color: "text-slate-700"
  }
];

export default function Services() {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#FFC107] text-[#0A1D56] font-bold px-4 py-1.5 rounded-full text-sm tracking-wide shadow-sm uppercase">
                Core Offerings
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A1D56] mb-6 tracking-tight uppercase leading-none">
              StatGate Solutions
            </h2>
            <p className="text-xl text-slate-600 font-medium">
              We provide the critical data infrastructure and actionable intelligence 
              required to manage national transformation at scale.
            </p>
          </div>
          <p className="hidden md:block text-sm font-bold text-[#0A1D56] uppercase tracking-widest text-right mt-6">
            Data. Analytics. Insight. Impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`rounded-2xl p-8 border-2 border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group ${service.bg}`}
            >
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                <service.icon className={`h-8 w-8 ${service.color}`} />
              </div>
              <h3 className="text-xl font-bold text-[#0A1D56] mb-3">{service.title}</h3>
              <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                {service.description}
              </p>
              
              <Link 
                to={service.link}
                className="inline-flex items-center text-sm font-bold text-[#0A1D56] hover:text-[#FFC107] transition-colors mt-auto group/link absolute bottom-8"
              >
                Explore Capability <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-20 bg-[#0A1D56] rounded-2xl p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <AlertTriangle size={200} />
            </div>
            <div className="relative z-10 max-w-3xl">
                <span className="bg-[#FFC107] text-[#0A1D56] font-bold px-3 py-1 rounded-full text-xs tracking-wider mb-4 inline-block">POLICY INSIGHT</span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    Data doesn't make decisions. People do. Statistics ensures those decisions are informed.
                </h3>
            </div>
            <div className="relative z-10 shrink-0">
               <Link to="/explorer" className="inline-block bg-[#FFC107] text-[#0A1D56] font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:bg-[#FFC107]/90 transition-colors uppercase tracking-wide">
                   Access Intelligence Layer
               </Link>
            </div>
        </div>
      </div>
    </section>
  );
}
