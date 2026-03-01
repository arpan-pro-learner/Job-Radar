"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Rocket, Users, Zap, Bookmark } from "lucide-react";
import Link from "next/link";
import { useSavedStartups } from "@/hooks/use-saved-startups";
import { cn } from "@/lib/utils";

interface StartupCardProps {
  startup: {
    id: string;
    name: string;
    websiteUrl?: string;
    shortDescription?: string;
    industry?: string;
    batch?: string;
    jobTitle?: string;
    location?: string;
    hiringScore: number;
    remoteScore: number;
    growthScore: number;
    aiSummary?: string;
    outreachAngle?: string;
    careersUrl?: string;
    source?: string;
    logo?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export function StartupCard({ startup }: StartupCardProps) {
  const { isSaved, toggleSave } = useSavedStartups();
  const saved = isSaved(startup.id);

  const isRecent = startup.updatedAt 
    ? (new Date().getTime() - new Date(startup.updatedAt).getTime()) < 24 * 60 * 60 * 1000 
    : false;

  const applyUrl = startup.careersUrl || startup.websiteUrl;

  return (
    <Card className="flex flex-col h-full bg-card/50 backdrop-blur-sm border-white/5 hover:border-primary/20 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 group relative overflow-hidden">
      
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <CardHeader className="relative z-10 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-lg bg-background/80 border border-white/10 flex items-center justify-center shadow-lg shrink-0">
               {startup.logo ? (
                 <img src={startup.logo} alt={startup.name} className="h-8 w-8 object-contain opacity-90" />
               ) : (
                 <span className="text-xl font-bold text-muted-foreground">{startup.name[0]}</span>
               )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <CardTitle className="text-lg font-bold tracking-tight text-white group-hover:text-primary transition-colors line-clamp-1">{startup.name}</CardTitle>
                {isRecent && (
                  <Badge className="bg-growth text-growth-foreground text-[10px] h-5 px-1.5 animate-pulse">New</Badge>
                )}
                {startup.batch && (
                   <Badge variant="glass" className="text-[10px] h-5 px-1.5 font-mono text-muted-foreground shrink-0">{startup.batch}</Badge>
                )}
                {startup.location && (
                   <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-white/10 text-muted-foreground shrink-0">{startup.location}</Badge>
                )}
              </div>
              <p className="text-growth font-bold text-sm mb-1 line-clamp-1 flex items-center gap-2">
                {startup.jobTitle || "Remote Opportunity"}
                {startup.source && (
                   <Badge variant="outline" className="text-[9px] h-4 px-1 border-primary/20 text-primary/60 font-normal">
                    via {startup.source}
                  </Badge>
                )}
              </p>
              <CardDescription className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                {startup.shortDescription || "No description available."}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 -mt-1 -mr-1 transition-all",
                saved && "text-primary fill-primary bg-primary/10"
              )}
              onClick={(e) => {
                e.preventDefault();
                toggleSave(startup.id, startup.name);
              }}
            >
              <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4 relative z-10">
        {/* Scores Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-growth/20 transition-colors">
            <span className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Hiring</span>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-growth" />
              <span className="font-bold text-growth">{startup.hiringScore}%</span>
            </div>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-blue-500/20 transition-colors">
            <span className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Remote</span>
            <div className="flex items-center gap-1.5">
               <Rocket className="h-3.5 w-3.5 text-blue-400" />
              <span className="font-bold text-blue-100">{startup.remoteScore}%</span>
            </div>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-star/20 transition-colors">
            <span className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Growth</span>
             <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-star" />
              <span className="font-bold text-star">{startup.growthScore}%</span>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        {(startup.aiSummary || startup.outreachAngle) && (
          <div className="space-y-3">
            {startup.aiSummary && (
              <div className="bg-gradient-to-r from-primary/5 to-transparent p-3 rounded-lg text-xs text-muted-foreground border-l-2 border-primary/40">
                <span className="font-semibold text-primary/80 block mb-1 flex items-center gap-1 text-[10px]"><Zap className="h-3 w-3" /> Radar Insight</span>
                {startup.aiSummary}
              </div>
            )}
            {startup.outreachAngle && (
              <div className="bg-gradient-to-r from-purple-500/5 to-transparent p-3 rounded-lg text-xs text-muted-foreground border-l-2 border-purple-500/40">
                <span className="font-semibold text-purple-400 block mb-1 flex items-center gap-1 text-[10px]"><Rocket className="h-3 w-3" /> Outreach Angle</span>
                {startup.outreachAngle}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 relative z-10 flex gap-2">
        <Link href={`/startups/${startup.id}`} className="flex-1">
          <Button variant="outline" className="w-full bg-secondary/20 hover:bg-secondary/40 text-secondary-foreground font-medium border-white/5 transition-all duration-300">
            Analysis
          </Button>
        </Link>
        {applyUrl && (
          <a href={applyUrl} target="_blank" rel="noreferrer" className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all duration-300">
              Apply Now <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
