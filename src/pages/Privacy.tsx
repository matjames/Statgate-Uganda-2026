import { motion } from "motion/react";
import { Lock, ShieldCheck, Database, FileCheck } from "lucide-react";

export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-primary font-serif mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            Compliance with the Uganda Data Protection and Privacy Act, 2019.
          </p>
        </motion.div>

        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: Lock, title: "Data Security", text: "We use industry-standard encryption to protect your personal and research data." },
              { icon: ShieldCheck, title: "Compliance", text: "Fully aligned with Ugandan and international data protection regulations." },
              { icon: Database, title: "Data Minimization", text: "We only collect the data necessary for the specified research purposes." },
              { icon: FileCheck, title: "User Rights", text: "You have the right to access, correct, or delete your personal information." },
            ].map((item, i) => (
              <div key={i} className="p-6 border rounded-xl bg-card">
                <item.icon className="h-8 w-8 text-secondary mb-4" />
                <h3 className="font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <section className="prose prose-slate max-w-none text-muted-foreground space-y-6">
            <h2 className="text-2xl font-bold text-primary border-b pb-2">1. Data Sovereignty</h2>
            <p>
              StatGate operates on the principle of <strong>African Data Sovereignty</strong>. All research and personal data processed through the Sovereign Engine V2.0 is stored on local infrastructure within the East African Community (EAC), specifically our primary node in Kampala. This ensures that sensitive data never leaves the continent and remains under local jurisdiction.
            </p>

            <h2 className="text-2xl font-bold text-primary border-b pb-2">2. The Anonymization Service</h2>
            <p>
              To protect the privacy of research participants, our backend implements an automated <strong>Anonymization Service</strong>. This script strips Personally Identifiable Information (PII) from field data before it is accessible to the "Analyst" tier, ensuring that individual identities are protected while maintaining statistical rigor.
            </p>

            <h2 className="text-2xl font-bold text-primary border-b pb-2">3. Information We Collect</h2>
            <p>We collect information in several ways:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>User Account Information:</strong> Name, email, phone number, and professional credentials.</li>
              <li><strong>Field Data:</strong> Research data collected by agents, which is strictly governed by project-specific consent forms.</li>
              <li><strong>Technical Data:</strong> IP addresses, device information, and usage logs for security and auditing purposes.</li>
            </ul>

            <h2 className="text-2xl font-bold text-primary border-b pb-2">3. How We Use Your Information</h2>
            <p>
              Data collected through StatGate is used solely for the purposes of:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Managing recruitment and deployment of field agents.</li>
              <li>Ensuring the integrity and ethical compliance of research projects.</li>
              <li>Processing payments and maintaining a transparent financial ledger.</li>
              <li>Improving platform security and performance.</li>
            </ul>

            <h2 className="text-2xl font-bold text-primary border-b pb-2">4. Data Storage and Retention</h2>
            <p>
              All data is stored on secure servers with restricted access. We retain personal data only for as long as necessary 
              to fulfill the purposes for which it was collected, or as required by law.
            </p>

            <h2 className="text-2xl font-bold text-primary border-b pb-2">5. Your Rights</h2>
            <p>
              Under the Data Protection and Privacy Act, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request access to your personal data.</li>
              <li>Request rectification of inaccurate data.</li>
              <li>Object to the processing of your data.</li>
              <li>Request the erasure of your data (where applicable).</li>
            </ul>
          </section>

          <div className="bg-muted p-8 rounded-2xl text-center">
            <p className="text-sm text-muted-foreground mb-2">Last Updated: April 10, 2026</p>
            <p className="text-sm text-muted-foreground">For privacy inquiries, contact: <span className="font-bold text-primary">privacy@statgate.ug</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
