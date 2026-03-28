"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Radar, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Discover", href: "/#discover" },
    { name: "How it Works", href: "/#how-it-works" },
    { name: "For Startups", href: "/#for-startups" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300">
            <Radar className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-primary transition-colors">
            Job Radar
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm" className="font-medium text-muted-foreground hover:text-white">
            Log In
          </Button>
          <Button size="sm" asChild className="rounded-full px-6 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all">
            <Link href="/#discover">
              Get Started
            </Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-muted-foreground hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-white/10 p-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-muted-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
           <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/5">
            <Button variant="ghost" className="w-full justify-start">Log In</Button>
             <Button className="w-full rounded-full" asChild>
               <Link href="/#discover" onClick={() => setMobileMenuOpen(false)}>
                Get Started
               </Link>
             </Button>
           </div>
        </div>
      )}
    </header>
  );
}
