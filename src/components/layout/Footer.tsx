import { Link } from "react-router-dom";
import { Shield, Github, Twitter, Linkedin } from "lucide-react";
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
              <span className="text-xl font-bold tracking-tight text-primary font-serif">
                Stat<span className="text-secondary">Gate</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Securing data, ensuring ethics, and empowering field research across Uganda and beyond.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">Sovereign Engine</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/recruitment" className="text-muted-foreground hover:text-secondary">Fellowship Induction</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-secondary">Geospatial Command</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-secondary">Truth Meter Audit</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:text-secondary">Sovereign Ledger</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">Architecture</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ethics" className="text-muted-foreground hover:text-secondary">Ethical Blueprint</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-secondary">Data Sovereignty</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-secondary">Sovereign Terms</Link></li>
              <li><Link to="/ethics" className="text-muted-foreground hover:text-secondary">Zero-Fabrication Oath</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">HQ: Kampala</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">Wandegeya, Kampala</li>
              <li className="text-muted-foreground">sovereign@statgate.ug</li>
              <li className="text-muted-foreground font-mono">+256 700 123456</li>
              <li className="pt-2">
                <Badge variant="outline" className="text-[10px] border-secondary text-secondary">
                  LOCAL STORAGE: ACTIVE
                </Badge>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} StatGate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
