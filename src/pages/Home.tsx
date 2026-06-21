import Hero from "@/components/home/Hero";
import StatgateUgandaValues from "@/components/home/StatgateUgandaValues";
import Services from "@/components/home/Services";
import { motion } from "motion/react";
import { Shield, Globe, Lock, CheckCircle2 } from "lucide-react";

import Image1 from "@/assets/images/data_analysts_1782042947759.jpg";
import Image2 from "@/assets/images/data_dashboard_screen_1782042962774.jpg";
import Image3 from "@/assets/images/field_data_collection_1782042976182.jpg";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <StatgateUgandaValues />
      <Services />

      {/* Visual Showcase */}
      <section className="bg-white py-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A1D56] font-serif uppercase tracking-tight">Our Operations in Action</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="overflow-hidden rounded-2xl shadow-sm border border-slate-100 group">
              <img src={Image3} alt="Field Data Collection" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-4 bg-white border-t border-slate-100">
                 <h3 className="font-bold text-[#0A1D56]">Field Data Collection</h3>
                 <p className="text-sm text-slate-500 mt-1">Deploying ethical data frameworks nationwide.</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-sm border border-slate-100 group">
              <img src={Image1} alt="Data Analysts Meeting" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-4 bg-white border-t border-slate-100">
                 <h3 className="font-bold text-[#0A1D56]">Strategic Analysis</h3>
                 <p className="text-sm text-slate-500 mt-1">Cross-referencing demographics for policy intelligence.</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-sm border border-slate-100 group">
              <img src={Image2} alt="Modern Dashboard" className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-4 bg-white border-t border-slate-100">
                 <h3 className="font-bold text-[#0A1D56]">Sovereign Control</h3>
                 <p className="text-sm text-slate-500 mt-1">High-tech digital command center for national statistics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0A1D56] font-serif mb-4 uppercase tracking-tight">Why Organizations Choose StatGate</h2>
            <p className="text-slate-600 max-w-2xl mx-auto font-medium text-lg">
              We bridge the gap between high-level research objectives and ground-level execution with a focus on integrity and transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Data Sovereignty",
                description: "African data processed on African-owned logic, hosted locally securely.",
              },
              {
                icon: Globe,
                title: "Architecture of Truth",
                description: "Multi-layer verification via GPS, audio audits, and immutable ledgers.",
              },
              {
                icon: Lock,
                title: "Sovereign Engine",
                description: "V2.0 high-performance API gateway with strict RBAC access controls.",
              },
              {
                icon: CheckCircle2,
                title: "Fellowship Pipeline",
                description: "Automated induction and technical benchmarking for verified field agents.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100"
              >
                <div className="mb-6 h-16 w-16 bg-blue-50 text-[#0A1D56] rounded-full flex items-center justify-center">
                  <item.icon className="h-8 w-8 text-[#0A1D56]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A1D56] mb-3">{item.title}</h3>
                <p className="font-medium text-slate-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6">Ready to secure your field research?</h2>
          <p className="text-primary-foreground/80 mb-10 max-w-xl mx-auto">
            Join the network of organizations and agents committed to ethical data collection and transparent reporting.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 bg-secondary text-primary font-bold rounded-lg hover:bg-secondary/90 transition-colors">
              Get Started
            </button>
            <button className="px-8 py-3 border border-white/30 hover:bg-white/10 rounded-lg transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
