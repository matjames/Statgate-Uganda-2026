import Hero from "@/components/home/Hero";
import StatgateUgandaValues from "@/components/home/StatgateUgandaValues";
import { motion } from "motion/react";
import { Shield, Globe, Lock, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <StatgateUgandaValues />
      
      {/* Trust Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary font-serif mb-4">Why Organizations Choose StatGate</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We bridge the gap between high-level research objectives and ground-level execution with a focus on integrity and transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Data Sovereignty",
                description: "African data processed on African-owned logic, hosted locally in Kampala.",
              },
              {
                icon: Globe,
                title: "Architecture of Truth",
                description: "Multi-layer verification via GPS, audio audits, and immutable ledgers.",
              },
              {
                icon: Lock,
                title: "Sovereign Engine",
                description: "V2.0 high-performance API gateway with RBAC and real-time sync.",
              },
              {
                icon: CheckCircle2,
                title: "Fellowship Pipeline",
                description: "Automated induction and technical benchmarking for 500+ verified agents.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="mb-4 text-secondary">
                  <item.icon className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
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
