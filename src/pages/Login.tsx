import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Lock, ArrowRight, Activity, Github, Phone, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch("/api/v1/health")
      .then(res => res.json())
      .then(data => setDbStatus(data.database))
      .catch(() => setDbStatus("Disconnected"));

    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_SUCCESS') {
        const { token, user } = event.data;
        localStorage.setItem("statgate_user", JSON.stringify(user));
        localStorage.setItem("statgate_token", token);
        toast.success(`Welcome back, ${user.role}`);
        navigate(from, { replace: true });
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("statgate_user", JSON.stringify(data.user));
        localStorage.setItem("statgate_token", data.token);
        toast.success(`Welcome back, ${data.user.role}`);
        navigate(from, { replace: true });
      } else {
        const data = await response.json();
        toast.error(data.error || "Invalid credentials. Access denied by Sovereign Engine.");
      }
    } catch (error) {
      toast.error("Connection failed. Check your network.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    try {
      const response = await fetch(`/api/v1/auth/${provider}/url`);
      const { url } = await response.json();
      window.open(url, 'oauth_popup', 'width=600,height=700');
    } catch (error) {
      toast.error(`${provider} login failed`);
    }
  };

  const handlePhoneRequest = async () => {
    if (!phone) return toast.error("Enter phone number");
    setIsLoading(true);
    try {
      await fetch("/api/v1/auth/phone/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      setShowOtp(true);
      toast.success("OTP Sent to your device");
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerify = async () => {
    if (!otp) return toast.error("Enter OTP");
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/auth/phone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("statgate_user", JSON.stringify(data.user));
        localStorage.setItem("statgate_token", data.token);
        toast.success(`Welcome back, ${data.user.role}`);
        navigate(from, { replace: true });
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/20 p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
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
            <CardTitle className="text-3xl font-serif text-primary">Sovereign Access</CardTitle>
            <CardDescription className="font-mono text-[10px] uppercase tracking-widest">
              StatGate Engine V2.0 Authentication
            </CardDescription>
            {dbStatus && !dbStatus.includes("Connected") && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-[10px] text-red-600 font-mono">
                ⚠️ DATABASE OFFLINE: Localhost Postgres unreachable from cloud. 
                Please configure DB Secrets or use Register to create a new identity if DB is connected.
              </div>
            )}
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>
                
                <TabsContent value="email" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Sovereign ID (Email)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@statgate.ug"
                      required={!showOtp}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Access Key</Label>
                      <button type="button" className="text-xs text-secondary hover:underline">
                        Forgot Key?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required={!showOtp}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12"
                    disabled={isLoading}
                  >
                    {isLoading ? "Authenticating..." : "Enter Command Center"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </TabsContent>

                <TabsContent value="phone" className="space-y-4">
                  {!showOtp ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+256 700 000000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="bg-muted/50 pl-10"
                          />
                        </div>
                      </div>
                      <Button 
                        type="button"
                        onClick={handlePhoneRequest}
                        className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-12"
                        disabled={isLoading}
                      >
                        Send Access Code
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp">Verification Code</Label>
                        <Input
                          id="otp"
                          placeholder="123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="bg-muted/50 text-center text-2xl tracking-[1em]"
                        />
                      </div>
                      <Button 
                        type="button"
                        onClick={handlePhoneVerify}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12"
                        disabled={isLoading}
                      >
                        Verify & Enter
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setShowOtp(false)}
                      >
                        Back to Phone
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleOAuthLogin('google')}
                  className="border-primary/20 hover:bg-primary/5"
                >
                  <img src="https://www.google.com/favicon.ico" className="mr-2 h-4 w-4" alt="Google" />
                  Google
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => handleOAuthLogin('github')}
                  className="border-primary/20 hover:bg-primary/5"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Activity className="h-3 w-3 text-green-500 animate-pulse" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">
                  Encrypted via AES-256 • Multi-Factor Active
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <p className="text-center text-xs text-muted-foreground">
                By entering, you reaffirm your <span className="text-primary font-bold">Privacy Oath</span>.
              </p>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            New to the Fellowship?{" "}
            <button 
              onClick={() => navigate("/register")}
              className="text-secondary font-bold hover:underline"
            >
              Apply for Induction
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
