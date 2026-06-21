import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { UserPlus, FileText, MapPin, Briefcase, GraduationCap, CheckCircle2 } from "lucide-react";
import InductionFlow from "@/components/fellowship/InductionFlow";

export default function Recruitment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isInducted, setIsInducted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      const response = await fetch("/api/recruitment/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: (document.getElementById("firstName") as HTMLInputElement).value,
          lastName: (document.getElementById("lastName") as HTMLInputElement).value,
          email: (document.getElementById("email") as HTMLInputElement).value,
          phone: (document.getElementById("phone") as HTMLInputElement).value,
          location: (document.getElementById("location") as HTMLInputElement).value,
          experience: (document.getElementById("experience") as HTMLTextAreaElement).value,
        }),
      });
      
      if (response.ok) {
        setIsApplied(true);
        toast.success("Application received. Proceeding to Induction.");
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      toast.error("Submission failed", {
        description: "Please try again later or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInducted) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto space-y-6"
        >
          <div className="flex justify-center">
            <div className="p-6 rounded-full bg-green-100 text-green-600">
              <CheckCircle2 size={64} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary font-serif">Fellowship Confirmed</h1>
          <p className="text-muted-foreground">
            Your application and Privacy Oath have been logged in the Sovereign Ledger. 
            Our regional lead will contact you for field deployment instructions.
          </p>
          <a href="/" className={`${buttonVariants({ variant: "default" })} bg-primary hover:bg-primary/90 text-white`}>
            Return to Home
          </a>
        </motion.div>
      </div>
    );
  }

  if (isApplied) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-serif mb-4">Fellowship Induction</h1>
          <p className="text-muted-foreground text-lg">
            Finalize your application by completing the Sovereign Engine Induction.
          </p>
        </div>
        <InductionFlow onComplete={() => setIsInducted(true)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary font-serif mb-4">Join Our Field Agent Network</h1>
          <p className="text-muted-foreground text-lg">
            StatGate is looking for dedicated, ethical, and detail-oriented individuals to join our 
            field research teams across Uganda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { icon: MapPin, title: "Local Impact", text: "Work in your community and contribute to vital research." },
            { icon: Briefcase, title: "Professional Growth", text: "Receive training in data collection and ethical standards." },
            { icon: FileText, title: "Fair Compensation", text: "Transparent payment through our secure ledger system." },
          ].map((benefit, i) => (
            <Card key={i} className="border-none bg-muted/50">
              <CardHeader className="pb-2">
                <benefit.icon className="h-8 w-8 text-secondary mb-2" />
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{benefit.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-2 border-primary/10">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl font-serif text-primary">Agent Application Form</CardTitle>
            </div>
            <CardDescription>Please provide accurate information. All fields are required.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+256 700 000000" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Primary Location (District/Region)</Label>
                <Input id="location" placeholder="Kampala, Central Region" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Relevant Experience</Label>
                <textarea 
                  id="experience" 
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell us about any previous research or data collection work..."
                  required
                ></textarea>
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <Checkbox id="ethics-agree" required className="mt-1" />
                <Label htmlFor="ethics-agree" className="text-sm font-normal leading-relaxed text-muted-foreground">
                  I agree to adhere to StatGate's Ethical Guidelines and understand that my work 
                  will be subject to quality audits and compliance checks.
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
