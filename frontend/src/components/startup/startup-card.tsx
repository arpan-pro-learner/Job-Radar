"use client";
import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const [isRecent, setIsRecent] = useState(false);

  useEffect(() => {
    if (startup.updatedAt) {
      const diff = new Date().getTime() - new Date(startup.updatedAt).getTime();
      setIsRecent(diff < 24 * 60 * 60 * 1000);
    }
  }, [startup.updatedAt]);

  const applyUrl = startup.careersUrl || startup.websiteUrl;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-4 md:p-5 bg-card/40 backdrop-blur-md border border-white/5 rounded-xl hover:bg-card/60 hover:border-white/10 transition-all duration-300 group overflow-hidden max-w-full">
      
      {/* Logo container */}
      <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl bg-background/50 border border-white/5 flex items-center justify-center shrink-0 overflow-hidden relative">
        {startup.logo ? (
          <img src={startup.logo} alt={startup.name} className="h-10 w-10 md:h-12 md:w-12 object-contain opacity-90" />
        ) : (
          <span className="text-xl md:text-2xl font-bold text-muted-foreground">{startup.name[0]}</span>
        )}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-start md:items-center gap-2 mb-1.5 min-w-0 w-full">
          <Link href={`/startups/${startup.id}`} className="hover:underline decoration-white/30 shrink min-w-0 block">
            <h3 className="text-sm md:text-base font-bold text-white tracking-tight line-clamp-2 break-words leading-snug">
              {startup.jobTitle || "Remote Opportunity"}
            </h3>
          </Link>
          {isRecent && (
            <Badge className="bg-growth/20 text-growth hover:bg-growth/30 text-[10px] h-5 px-2 border-transparent shrink-0 mt-0.5 md:mt-0">
              New
            </Badge>
          )}
        </div>
        
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground mb-2 min-w-0">
          <span className="font-semibold text-white/80 truncate max-w-full">{startup.name}</span>
          {startup.location && (
            <>
              <span className="text-white/20 shrink-0">·</span>
              <span className="truncate max-w-[150px] md:max-w-xs">{startup.location}</span>
            </>
          )}
          {startup.batch && (
            <>
              <span className="text-white/20">·</span>
              <span className="font-mono text-xs text-white/60">{startup.batch}</span>
            </>
          )}
          {startup.source && (
            <>
              <span className="text-white/20">·</span>
              <span className="text-xs">via {startup.source}</span>
            </>
          )}
        </div>

        {/* AI summary snippet */}
        {startup.aiSummary ? (
            <p className="text-xs text-muted-foreground/80 line-clamp-1 group-hover:text-muted-foreground transition-colors">
              {startup.aiSummary}
            </p>
        ) : (
           <p className="text-xs text-muted-foreground/60 line-clamp-1 italic">
             {startup.shortDescription || "No additional details provided."}
           </p>
        )}
      </div>

      {/* Right side: Scores & Actions */}
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center gap-4 shrink-0 w-full md:w-auto mt-3 md:mt-0 pt-3 md:pt-0 border-t border-white/5 md:border-0">
        
        {/* Scores */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/5 bg-background/50 text-xs text-muted-foreground whitespace-nowrap" title="Hiring Urgency Score">
            <Users className="h-3 w-3 text-growth" /> 
            <span className="font-medium text-white/90">{startup.hiringScore > 0 ? `${startup.hiringScore}` : "N/A"}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/5 bg-background/50 text-xs text-muted-foreground whitespace-nowrap" title="Remote Fit Score">
            <Rocket className="h-3 w-3 text-blue-400" />
            <span className="font-medium text-white/90">{startup.remoteScore > 0 ? `${startup.remoteScore}` : "N/A"}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/5 bg-background/50 text-xs text-muted-foreground whitespace-nowrap" title="Growth Momentum Score">
            <Zap className="h-3 w-3 text-star" />
            <span className="font-medium text-white/90">{startup.growthScore > 0 ? `${startup.growthScore}` : "N/A"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-9 w-9 text-muted-foreground transition-all shrink-0 border border-white/5 md:border-transparent",
              saved ? "text-primary fill-primary hover:bg-primary/10 hover:text-primary" : "hover:text-white hover:bg-white/5"
            )}
            onClick={(e) => {
              e.preventDefault();
              toggleSave(startup.id, startup.name);
            }}
          >
            <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
          </Button>

          <Button variant="secondary" asChild className="h-9 px-3 text-xs md:text-sm shrink-0 transition-colors">
            <Link href={`/startups/${startup.id}`}>
              Details
            </Link>
          </Button>

          {applyUrl && (
            <a href={applyUrl} target="_blank" rel="noreferrer" className="shrink-0">
              <Button className="h-9 px-3 text-xs md:text-sm shrink-0 transition-colors">
                Apply <ExternalLink className="ml-1.5 h-3.5 w-3.5 hidden sm:flex" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
