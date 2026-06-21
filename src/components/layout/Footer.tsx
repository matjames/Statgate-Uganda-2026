import { Link } from "react-router-dom";
import { Shield, Github, Twitter, Linkedin, Facebook, Globe, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="https://lh3.googleusercontent.com/a/ACg8ocJ0q-5HDm-Ydlk1tsbNDCvdsA4MW7_nhaeOx3xOyukRtTh2QfLlJw=s288-c-no" 
                alt="StatGate Logo" 
                className="h-8 w-8 rounded-md object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col ml-1">
                <span className="text-xl font-bold tracking-tighter text-[#0A1D56] leading-none uppercase">
                  Statgate
                </span>
                <span className="text-xs font-semibold tracking-widest text-muted-foreground leading-none">
                  UGANDA
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Securing data, ensuring ethics, and empowering field research across Uganda and beyond. We Collect. We Analyze. We Inform. You Transform.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="flex items-center text-muted-foreground hover:text-[#0A1D56]">
                <Facebook className="h-5 w-5 mr-1 text-[#0A1D56]" />
              </a>
              <a href="#" className="flex items-center text-muted-foreground hover:text-[#0A1D56]">
                <Linkedin className="h-5 w-5 mr-1 text-[#0A1D56]" />
              </a>
              <a href="#" className="flex items-center text-muted-foreground hover:text-[#0A1D56]">
                <Twitter className="h-5 w-5 mr-1 text-[#0A1D56]" />
                <span className="text-sm font-semibold">StatGate Uganda</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#0A1D56]">Sovereign Engine</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/recruitment" className="text-muted-foreground hover:text-secondary">Fellowship Induction</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-secondary">Geospatial Command</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-secondary">Truth Meter Audit</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-secondary">Sovereign Ledger</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#0A1D56]">Architecture</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ethics" className="text-muted-foreground hover:text-secondary">Ethical Blueprint</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-secondary">Data Sovereignty</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-secondary">Sovereign Terms</Link></li>
              <li><Link to="/ethics" className="text-muted-foreground hover:text-secondary">Zero-Fabrication Oath</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#0A1D56]">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center text-muted-foreground">
                <Globe className="h-4 w-4 mr-2 text-[#0A1D56]" />
                www.statgate.ug
              </li>
              <li className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2 text-[#0A1D56]" />
                info@statgate.ug
              </li>
              <li className="flex items-center text-muted-foreground font-semibold">
                <Phone className="h-4 w-4 mr-2 text-[#0A1D56]" />
                +256 752 714 374
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} StatGate Uganda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
