"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Rocket, Share2, Users, Zap, MapPin, DollarSign, Building, Code2, Briefcase, Bookmark, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSavedStartups } from "@/hooks/use-saved-startups";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StartupDetailsContentProps {
  startup: any; // Type this properly if possible, reusing MOCK_STARTUPS type
}

export function StartupDetailsContent({ startup }: StartupDetailsContentProps) {
  const { isSaved, toggleSave } = useSavedStartups();
  const { toast } = useToast();
  const saved = isSaved(startup.id);
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    // Simulate network delay
    setTimeout(() => {
      setIsApplying(false);
      toast({
        title: "Application Sent!",
        description: `Your profile has been shared with ${startup.name}'s hiring team.`,
        variant: "success",
      });
    }, 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Startup profile link copied to clipboard.",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-growth";
    if (score >= 70) return "text-blue-400";
    return "text-muted-foreground";
  };

  return (
    <div className="flex flex-col font-sans min-h-screen">
      
      {/* Navbar is in layout.tsx */}

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors group">
              <div className="bg-secondary/50 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="font-medium text-sm">Back to Discovery</span>
            </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            
            {/* Left Column: Main Info */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Header Card */}
                <div className="bg-secondary/20 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-[80px] rounded-full pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start relative z-10">
                        <div className="flex gap-5">
                            <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-background border border-white/10 flex items-center justify-center shadow-2xl p-2 shrink-0">
                                {startup.logo ? (
                                    <img src={startup.logo} alt={startup.name} className="h-full w-full object-contain rounded-xl" /> 
                                ) : (
                                    <span className="text-3xl font-bold text-muted-foreground">{startup.name[0]}</span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
                                    {startup.name}
                                    {startup.batch && (
                                        <Badge variant="glass" className="text-xs h-6 px-2.5 font-mono text-primary border-primary/20 bg-primary/5">
                                            {startup.batch}
                                        </Badge>
                                    )}
                                </h1>
                                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                                    {startup.jobTitle || "Software Engineer"}
                                </p>
                                
                                <div className="flex flex-wrap gap-4 mt-5">
                                     {startup.websiteUrl && (
                                       <a href={startup.websiteUrl} target="_blank" rel="noreferrer">
                                         <Button variant="outline" size="sm" className="gap-2 h-9 border-white/10 hover:bg-white/5">
                                           <ExternalLink className="h-3.5 w-3.5" /> Website
                                         </Button>
                                       </a>
                                     )}
                                     <Button variant="ghost" size="sm" className="gap-2 h-9 text-muted-foreground hover:text-white" onClick={handleShare}>
                                       <Share2 className="h-3.5 w-3.5" /> Share
                                     </Button>
                                     <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className={cn("gap-2 h-9 text-muted-foreground hover:text-white", saved && "text-primary hover:text-primary")}
                                        onClick={() => toggleSave(startup.id, startup.name)}
                                     >
                                       <Bookmark className={cn("h-3.5 w-3.5", saved && "fill-current")} /> {saved ? "Saved" : "Save"}
                                     </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div>
                   <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">About {startup.name}</h2>
                   <div className="prose prose-invert prose-lg text-muted-foreground/90 leading-relaxed max-w-none">
                     <p className="whitespace-pre-line">{startup.fullDescription || startup.shortDescription}</p>
                     {(startup.industry || startup.teamSize || startup.funding) && (
                         <p>
                            {startup.industry && <>They are tackling significant challenges in the <span className="text-white font-medium">{startup.industry}</span> space. </>}
                            {startup.teamSize && <>The team is currently <span className="text-white font-medium">{startup.teamSize} employees</span> </>}
                            {startup.funding && <>and has raised <span className="text-white font-medium">{startup.funding}</span> from top-tier investors.</>}
                         </p>
                     )}
                   </div>
                </div>

                {/* Tech Stack */}
                {startup.techStack && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Code2 className="h-5 w-5 text-blue-400" /> Tech Stack
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {startup.techStack.map((tech: string) => (
                                <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm font-medium bg-secondary/40 border border-white/5 hover:bg-secondary/60 transition-colors">
                                    {tech}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Images Gallery (Mock) */}
                {startup.images && startup.images.length > 0 && (
                     <div className="grid grid-cols-2 gap-4">
                        {startup.images.map((img: string, i: number) => (
                            <div key={i} className="aspect-video rounded-xl bg-secondary/30 border border-white/5 overflow-hidden relative">
                                {/* Placeholder for actual image since we use mock paths */}
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 font-bold text-lg bg-gradient-to-br from-transparent to-black/20">
                                    Product Shot {i + 1}
                                </div>
                            </div>
                        ))}
                     </div>
                )}

            </div>

            {/* Right Column: Key Stats & CTAs */}
            <div className="space-y-6">
                
                {/* Scores Card */}
                <div className="bg-secondary/10 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Founder Radar Signals</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="bg-growth/10 p-2 rounded-lg">
                                    <Users className="h-5 w-5 text-growth" />
                                </div>
                                <span className="font-medium text-sm">Hiring Probability</span>
                            </div>
                            <span className={`text-xl font-bold ${getScoreColor(startup.hiringScore)}`}>{startup.hiringScore}%</span>
                        </div>
                         <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500/10 p-2 rounded-lg">
                                    <Rocket className="h-5 w-5 text-blue-400" />
                                </div>
                                <span className="font-medium text-sm">Remote Culture</span>
                            </div>
                            <span className={`text-xl font-bold ${getScoreColor(startup.remoteScore)}`}>{startup.remoteScore}%</span>
                        </div>
                         <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="bg-star/10 p-2 rounded-lg">
                                    <Zap className="h-5 w-5 text-star" />
                                </div>
                                <span className="font-medium text-sm">Growth Momentum</span>
                            </div>
                            <span className={`text-xl font-bold ${getScoreColor(startup.growthScore)}`}>{startup.growthScore}%</span>
                        </div>
                    </div>

                    {startup.aiSummary && (
                        <div className="mt-6 pt-6 border-t border-white/5">
                            <div className="flex gap-2 mb-2">
                                <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">Why it's interesting</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {startup.aiSummary}
                            </p>
                        </div>
                    )}
                </div>

                {/* Apply CTA */}
                <div className="bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 text-center sticky top-24">
                     <h3 className="font-bold text-lg text-white mb-2">Interested in {startup.name}?</h3>
                     <p className="text-sm text-muted-foreground mb-6">
                        They are actively looking for engineers. Use our outreach template to stand out.
                     </p>
                     
                     {startup.outreachAngle && (
                         <div className="bg-background/50 border border-white/10 rounded-lg p-3 text-left mb-4 text-xs text-muted-foreground italic relative group cursor-pointer hover:border-primary/30 transition-colors">
                            "{startup.outreachAngle}"
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] px-1.5 rounded">Copy</div>
                         </div>
                     )}

                     <Button 
                        className="w-full h-11 font-semibold text-base shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform disabled:opacity-70" 
                        size="lg"
                        onClick={handleApply}
                        disabled={isApplying}
                     >
                        {isApplying ? (
                            <>Sending...</>
                        ) : (
                            <>Apply Now <ExternalLink className="ml-2 h-4 w-4" /></>
                        )}
                     </Button>
                </div>

                {/* Founders */}
                {startup.founders && startup.founders.length > 0 && (
                     <div className="bg-secondary/10 border border-white/5 rounded-2xl p-6">
                        <h3 className="font-semibold text-white mb-4">Founders</h3>
                        <div className="space-y-4">
                            {startup.founders.map((founder: any, i: number) => (
                                <div key={i} className="flex items-center gap-3">
                                    <img src={founder.avatar} alt={founder.name} className="h-10 w-10 rounded-full bg-secondary" />
                                    <div>
                                        <div className="font-medium text-sm text-white">{founder.name}</div>
                                        <div className="text-xs text-muted-foreground">{founder.bio}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                )}
            </div>
        </div>
        
        {/* Open Roles */}
        {startup.openRoles && startup.openRoles.length > 0 && (
            <div className="mb-16">
                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-primary" /> Open Roles
                 </h2>
                 <div className="grid md:grid-cols-2 gap-4">
                    {startup.openRoles.map((role: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-5 rounded-xl bg-secondary/10 border border-white/5 hover:border-primary/20 hover:bg-secondary/20 transition-all cursor-pointer group">
                             <div>
                                 <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{role.title}</div>
                                 <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                                     <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {role.location}</span>
                                     <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {role.salary}</span>
                                 </div>
                             </div>
                             <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                View
                             </Button>
                        </div>
                    ))}
                 </div>
            </div>
        )}

      </main>
    </div>
  );
}
