import Link from "next/link";
import { Radar, Twitter, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
                <Radar className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                Job Radar
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed text-sm">
              Helping developers discover and connect with high-growth, remote-first startups before they hit mainstream job boards.
            </p>
            <div className="flex gap-4 pt-2">
                <SocialLink href="#" icon={<Twitter className="h-4 w-4" />} />
                <SocialLink href="#" icon={<Github className="h-4 w-4" />} />
                <SocialLink href="#" icon={<Linkedin className="h-4 w-4" />} />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/#discover" className="hover:text-primary transition-colors">Startups</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><a href="https://github.com/arpan-pro-learner" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">GitHub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Job Radar. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a 
            href={href} 
            className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all duration-300"
        >
            {icon}
        </a>
    )
}
