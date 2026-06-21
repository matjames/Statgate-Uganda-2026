import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, GraduationCap, CheckCircle2, ArrowRight, Lock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const steps = [
  {
    title: "The Architecture of Truth",
    description: "Understand the technical foundation of the Sovereign Engine.",
    icon: Shield,
    content: "The StatGate Sovereign Engine V2.0 is built on three pillars: Local Data Sovereignty, Multi-Layer Verification, and the Immutable Ledger. As a fellow, you are the guardian of this architecture."
  },
  {
    title: "Ethical Data Collection",
    description: "Commit to the highest standards of field research.",
    icon: BookOpen,
    content: "Fabrication is the enemy of progress. You must ensure every survey is geofenced, every interview is authentic, and every participant is treated with dignity under the Uganda Data Protection Act."
  },
  {
    title: "The Privacy Oath",
    description: "Take the solemn commitment to African data sanctity.",
    icon: Lock,
    content: "I solemnly swear to protect the sanctity of African data, to enforce the Architecture of Truth, and to ensure that no fabrication enters the Sovereign Engine. I understand that my actions define the future of our continent's digital sovereignty."
  }
];

export default function InductionFlow({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success("Induction Complete. Welcome to the Fellowship.");
      onComplete();
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 space-y-2">
        <div className="flex justify-between items-center text-xs font-mono text-muted-foreground uppercase tracking-widest">
          <span>Induction Progress</span>
          <span>Step {currentStep + 1} of {steps.length}</span>
        </div>
        <Progress value={((currentStep + 1) / steps.length) * 100} className="h-1" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-primary/10 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10 text-primary">
                  <StepIcon size={40} />
                </div>
              </div>
              <CardTitle className="text-2xl font-serif text-primary">{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-6">
              <p className="text-muted-foreground leading-relaxed italic">
                "{steps[currentStep].content}"
              </p>
              
              {currentStep === 2 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <input 
                    type="checkbox" 
                    id="oath" 
                    checked={isAccepted} 
                    onChange={(e) => setIsAccepted(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="oath" className="text-sm font-bold text-primary cursor-pointer">
                    I accept the Privacy Oath and the terms of the Fellowship.
                  </label>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center pb-8">
              <Button 
                onClick={nextStep} 
                disabled={currentStep === 2 && !isAccepted}
                className="bg-primary hover:bg-primary/90 text-white px-12 h-12 font-bold"
              >
                {currentStep === steps.length - 1 ? "Finalize Induction" : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
