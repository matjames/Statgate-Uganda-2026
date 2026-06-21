import { motion } from "motion/react";
import { Scale, Heart, Shield, Eye } from "lucide-react";

export default function Ethics() {
  const principles = [
    {
      icon: Heart,
      title: "Respect for Persons",
      content: "Treating all research participants as autonomous agents and protecting those with diminished autonomy. This includes obtaining informed consent and ensuring voluntary participation."
    },
    {
      icon: Scale,
      title: "Beneficence",
      content: "Maximizing possible benefits and minimizing potential harms. Research must be justified by its social and scientific value."
    },
    {
      icon: Shield,
      title: "Justice",
      content: "Ensuring that the benefits and burdens of research are distributed fairly. No group should be unfairly targeted or excluded."
    },
    {
      icon: Eye,
      title: "Transparency",
      content: "Maintaining open and honest communication with stakeholders, participants, and the public about research methods, funding, and findings."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-primary font-serif mb-4">Ethical Guidelines</h1>
          <p className="text-lg text-muted-foreground">
            Our commitment to ethical integrity is the foundation of every project at StatGate.
          </p>
        </motion.div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-primary mb-6 border-b pb-2">Core Principles</h2>
            <div className="grid grid-cols-1 gap-6">
              {principles.map((p, i) => (
                <div key={i} className="flex gap-4 p-6 rounded-xl bg-muted/30 border border-primary/5">
                  <div className="flex-shrink-0">
                    <p.icon className="h-8 w-8 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">{p.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{p.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-primary mb-6 border-b pb-2">The Architecture of Truth</h2>
            <p className="text-muted-foreground mb-4">
              StatGate is built on an <strong>Architecture of Truth</strong>. This means that every data point is verified through multiple layers of technical and human auditing. Our Sovereign Engine V2.0 enforces a <strong>Zero-Fabrication</strong> policy through:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
              <li><strong>GPS Verification:</strong> Every survey submission is timestamped and geofenced to ensure the agent was physically present at the research site.</li>
              <li><strong>Audio Auditing:</strong> Random audio samples are captured and analyzed to verify the authenticity of interviews.</li>
              <li><strong>Non-Mutable Ledger:</strong> Once a data point is verified, it is logged in an immutable audit trail that cannot be altered or deleted.</li>
            </ul>
          </section>

          <section className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-primary mb-6 border-b pb-2">The Privacy Oath</h2>
            <p className="text-muted-foreground mb-4">
              All fellows in the StatGate system must take the <strong>Privacy Oath</strong> before gaining access to the Sovereign Engine. This oath is a solemn commitment to protect the sanctity of African data and to uphold the highest standards of statistical rigor.
            </p>
          </section>

          <section className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-primary mb-6 border-b pb-2">Field Research Standards</h2>
            <p className="text-muted-foreground mb-4">
              All field agents deployed through StatGate must adhere to the following standards:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
              <li><strong>Informed Consent:</strong> Agents must clearly explain the purpose, risks, and benefits of the research to participants before any data is collected.</li>
              <li><strong>Cultural Sensitivity:</strong> Agents must respect local customs, languages, and social norms in the regions where they operate.</li>
              <li><strong>Data Accuracy:</strong> Intentional falsification of data is strictly prohibited and grounds for immediate termination and legal action.</li>
              <li><strong>Confidentiality:</strong> Participant identities must be protected at all times, with data anonymized at the point of collection whenever possible.</li>
            </ul>
          </section>

          <section className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
            <h2 className="text-xl font-bold text-primary mb-4">Reporting Violations</h2>
            <p className="text-muted-foreground mb-4">
              If you witness or suspect any ethical violations by a StatGate agent or partner, please report it immediately to our Ethics Committee.
            </p>
            <p className="font-bold text-primary">ethics@statgate.ug</p>
          </section>
        </div>
      </div>
    </div>
  );
}
