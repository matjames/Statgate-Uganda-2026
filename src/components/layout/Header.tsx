import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { Shield, Menu, X, Activity, Languages, ChevronDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState("Initializing...");
  const [user, setUser] = useState<any>(null);
  const [currentLang, setCurrentLang] = useState("English");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("statgate_token");
    const headers = token ? { "Authorization": `Bearer ${token}` } : {};

    fetch("/api/v1/health", { headers })
      .then(res => res.json())
      .then(data => setSystemStatus(data.status))
      .catch(() => setSystemStatus("Offline"));

    const storedUser = localStorage.getItem("statgate_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("statgate_user");
    localStorage.removeItem("statgate_token");
    setUser(null);
    navigate("/");
  };

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.recruitment"), href: "/recruitment" },
    { name: t("nav.ethics"), href: "/ethics" },
    { name: t("nav.privacy"), href: "/privacy" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="https://lh3.googleusercontent.com/a/ACg8ocJ0q-5HDm-Ydlk1tsbNDCvdsA4MW7_nhaeOx3xOyukRtTh2QfLlJw=s288-c-no" 
            alt="StatGate Logo" 
            className="h-10 w-10 rounded-lg object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col ml-1">
            <span className="text-2xl font-bold tracking-tighter text-[#0A1D56] leading-none uppercase">
              Statgate
            </span>
            <span className="text-sm font-semibold tracking-widest text-muted-foreground leading-none">
              UGANDA
            </span>
            <div className="flex items-center gap-1 mt-1">
              <div className={cn(
                "h-1.5 w-1.5 rounded-full animate-pulse",
                systemStatus.includes("Active") ? "bg-green-500" : "bg-red-500"
              )} />
              <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest">
                {systemStatus}
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 px-3 gap-1 text-muted-foreground hover:text-primary">
              <Languages className="h-4 w-4" />
              <span>{currentLang}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {["English", "Luganda", "Acholi", "Runyankole", "Lusoga"].map((lang) => (
                <DropdownMenuItem 
                  key={lang} 
                  onClick={() => {
                    setCurrentLang(lang);
                    i18n.changeLanguage(lang);
                    if (lang !== "English") toast.info(`Switching to ${lang}`);
                  }}
                  className={cn(currentLang === lang && "bg-primary/10 text-primary font-bold")}
                >
                  {lang}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "transition-colors hover:text-secondary",
                location.pathname === link.href ? "text-primary font-bold" : "text-foreground/80"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          {user && (
            <>
              <Link to="/explorer" className="text-foreground/80 hover:text-primary transition-colors">Explorer</Link>
              <Link to="/reports" className="text-foreground/80 hover:text-primary transition-colors">Reports</Link>
              <Link to="/ai" className="text-foreground/80 hover:text-primary transition-colors">AI</Link>
              {user?.role === "Sovereign Admin" && (
                <>
                  <Link to="/governance" className="text-foreground/80 hover:text-primary transition-colors">Governance</Link>
                  <Link to="/advanced" className="text-foreground/80 hover:text-primary transition-colors">Advanced</Link>
                </>
              )}
            </>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-primary">{user.email}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">{user.role}</span>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5">
                {t("nav.logout")}
              </Button>
              <Link to="/dashboard" className={`${buttonVariants({ variant: "default" })} bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20`}>
                {t("nav.dashboard")}
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/register" className={`${buttonVariants({ variant: "ghost", size: "sm" })} text-primary hover:bg-primary/5`}>
                Register
              </Link>
              <Link to="/login" className={`${buttonVariants({ variant: "default" })} bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20`}>
                {t("nav.login")}
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b bg-background"
          >
            <nav className="flex flex-col space-y-4 p-4 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "transition-colors hover:text-secondary",
                    location.pathname === link.href ? "text-primary font-bold" : "text-foreground/80"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              {user && (
                <>
                  <Link to="/explorer" onClick={() => setIsMenuOpen(false)} className="text-foreground/80 hover:text-primary transition-colors">Explorer</Link>
                  <Link to="/reports" onClick={() => setIsMenuOpen(false)} className="text-foreground/80 hover:text-primary transition-colors">Reports</Link>
                  <Link to="/ai" onClick={() => setIsMenuOpen(false)} className="text-foreground/80 hover:text-primary transition-colors">AI</Link>
                  {user?.role === "Sovereign Admin" && (
                    <>
                      <Link to="/governance" onClick={() => setIsMenuOpen(false)} className="text-foreground/80 hover:text-primary transition-colors">Governance</Link>
                      <Link to="/advanced" onClick={() => setIsMenuOpen(false)} className="text-foreground/80 hover:text-primary transition-colors">Advanced</Link>
                    </>
                  )}
                </>
              )}
              
              {user ? (
                <>
                  <div className="pt-4 border-t">
                    <p className="text-xs font-bold text-primary">{user.email}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{user.role}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className={`${buttonVariants({ variant: "default" })} w-full bg-primary hover:bg-primary/90 text-center`}>
                    Command Center
                  </Link>
                  <Button onClick={handleLogout} variant="outline" className="w-full">
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className={`${buttonVariants({ variant: "default" })} w-full bg-primary hover:bg-primary/90 text-center`}>
                  Login
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
