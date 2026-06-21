import { motion } from "motion/react";

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-primary font-serif mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">
            Please read these terms carefully before using the StatGate platform.
          </p>
        </motion.div>

        <div className="prose prose-slate max-w-none text-muted-foreground space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-primary border-b pb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the StatGate platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary border-b pb-2">2. Use License</h2>
            <p>
              Permission is granted to temporarily access the materials on StatGate's platform for personal, non-commercial transitory viewing only. 
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials.</li>
              <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
              <li>Attempt to decompile or reverse engineer any software contained on StatGate's platform.</li>
              <li>Remove any copyright or other proprietary notations from the materials.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary border-b pb-2">3. User Obligations</h2>
            <p>
              Users of the platform, including field agents and vendors, agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and truthful information at all times.</li>
              <li>Maintain the confidentiality of their account credentials.</li>
              <li>Comply with all Ethical Guidelines and Privacy Policies of the platform.</li>
              <li>Report any security breaches or unauthorized access immediately.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary border-b pb-2">4. Disclaimer</h2>
            <p>
              The materials on StatGate's platform are provided on an 'as is' basis. StatGate makes no warranties, expressed or implied, 
              and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of 
              merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary border-b pb-2">5. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the Republic of Uganda 
              and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </section>
        </div>

        <div className="mt-16 p-8 border rounded-2xl bg-muted/30 text-center">
          <p className="text-sm text-muted-foreground">
            If you have any questions about these Terms, please contact us at <span className="font-bold text-primary">legal@statgate.ug</span>
          </p>
        </div>
      </div>
    </div>
  );
}
