import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Lock, ArrowRight, Activity, UserPlus, Mail, User, Phone, Building2, Briefcase, Globe, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Client Observer");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [organization, setOrganization] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [sector, setSector] = useState("NGO");
  const [expertise, setExpertise] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          role,
          fullName,
          phoneNumber,
          organization,
          jobTitle,
          sector,
          expertise,
          location,
          bio
        }),
      });

      if (response.ok) {
        toast.success("Sovereign Identity Created. You can now login.");
        navigate("/login");
      } else {
        const data = await response.json();
        toast.error(data.error || "Registration failed. Identity already exists or system rejected.");
      }
    } catch (error) {
      toast.error("Connection failed. Sovereign Engine unreachable.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/20 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl z-10"
      >
        <Card className="border-2 border-primary/10 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-1 rounded-2xl bg-primary/10">
                <img 
                  src="https://lh3.googleusercontent.com/a/ACg8ocJ0q-5HDm-Ydlk1tsbNDCvdsA4MW7_nhaeOx3xOyukRtTh2QfLlJw=s288-c-no" 
                  alt="StatGate Logo" 
                  className="h-16 w-16 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <CardTitle className="text-3xl font-serif text-primary">Identity Induction</CardTitle>
            <CardDescription className="font-mono text-[10px] uppercase tracking-widest">
              Create your StatGate Sovereign Identity
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="personal">1. Personal</TabsTrigger>
                  <TabsTrigger value="professional">2. Professional</TabsTrigger>
                  <TabsTrigger value="security">3. Security</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          placeholder="Dr. Jane Doe"
                          required={activeTab === "personal"}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="bg-muted/50 pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phoneNumber"
                          placeholder="+256 700 000000"
                          required={activeTab === "personal"}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="bg-muted/50 pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Primary Location (District/Region)</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        placeholder="Kampala, Uganda"
                        required={activeTab === "personal"}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-muted/50 pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="bio"
                        placeholder="Briefly describe your background in research or field operations..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="bg-muted/50 pl-10 min-h-[100px]"
                      />
                    </div>
                  </div>
                  <Button type="button" className="w-full" onClick={() => setActiveTab("professional")}>
                    Next: Professional Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </TabsContent>

                <TabsContent value="professional" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization / Institution</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="organization"
                          placeholder="UNICEF / UBOS / Makerere"
                          required={activeTab === "professional"}
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          className="bg-muted/50 pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="jobTitle"
                          placeholder="Lead Researcher / Director"
                          required={activeTab === "professional"}
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          className="bg-muted/50 pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sector">Primary Sector</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <select 
                        id="sector"
                        value={sector} 
                        onChange={(e) => setSector(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-muted/50 pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="NGO">Non-Governmental Organization (NGO)</option>
                        <option value="Government">Government Agency / Ministry</option>
                        <option value="Research">Research Institution / University</option>
                        <option value="Private">Private Sector / Consultant</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expertise">Expertise & Technical Skills</Label>
                    <div className="relative">
                      <Activity className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="expertise"
                        placeholder="e.g. R, Python, GIS, Field Survey Design"
                        value={expertise}
                        onChange={(e) => setExpertise(e.target.value)}
                        className="bg-muted/50 pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" className="w-full" onClick={() => setActiveTab("personal")}>
                      Back
                    </Button>
                    <Button type="button" className="w-full" onClick={() => setActiveTab("security")}>
                      Next: Security <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Sovereign ID (Email)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@statgate.ug"
                        required={activeTab === "security"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-muted/50 pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Access Key (Password)</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        required={activeTab === "security"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-muted/50 pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Requested System Role</Label>
                    <select 
                      id="role"
                      value={role} 
                      onChange={(e) => setRole(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="Client Observer">Client Observer (Standard Access)</option>
                      <option value="Lead Analyst">Lead Analyst (Requires Verification)</option>
                      <option value="District Field Engineer">District Field Engineer</option>
                    </select>
                  </div>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setActiveTab("professional")}>
                    Back
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="flex items-center space-x-2 pt-2">
                <Shield className="h-3 w-3 text-primary animate-pulse" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">
                  Identity will be persisted to Sovereign Ledger • NGO/Gov Verification Active
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12"
                disabled={isLoading}
              >
                {isLoading ? "Inducting..." : "Initialize Induction"}
                {!isLoading && <UserPlus className="ml-2 h-4 w-4" />}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Already have an identity?{" "}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Login here
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
