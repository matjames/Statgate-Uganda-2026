import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldAlert } from "lucide-react";

export default function ConsentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem("statgate_consent");
    if (!hasConsented) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (agreed) {
      localStorage.setItem("statgate_consent", "true");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <DialogTitle className="text-2xl font-serif text-primary">Ethical & Privacy Consent</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground pt-2">
            StatGate is committed to the highest standards of ethical research and data privacy. 
            By using this platform, you agree to comply with our Ethical Guidelines and the 
            Uganda Data Protection and Privacy Act, 2019.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="consent" 
              checked={agreed} 
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1 border-primary data-[state=checked]:bg-primary"
            />
            <label
              htmlFor="consent"
              className="text-sm leading-relaxed text-foreground/80 cursor-pointer"
            >
              I have read and agree to the Ethical Guidelines, Privacy Policy, and Terms of Service. 
              I understand that my actions on this platform are audited for compliance.
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleAccept} 
            disabled={!agreed}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Accept and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
