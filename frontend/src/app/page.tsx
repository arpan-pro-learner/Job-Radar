import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StartupCard } from "@/components/startup/startup-card";
import { GridBackground } from "@/components/ui/grid-background";
import { SlidersHorizontal, ArrowRight, TrendingUp, Globe, Zap, Sparkles } from "lucide-react";
import { SearchBar } from "@/components/startup/search-bar";
import { Pagination } from "@/components/startup/pagination";
import { RefreshButton } from "@/components/startup/refresh-button";
import Link from "next/link";

async function getStartups(page: number = 1, search: string = "", source: string = "", locationFilter: string = "") {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: "12",
      ...(search && { search }),
      ...(source && { source }),
      ...(locationFilter && { locationFilter }),
    });
    
    const res = await fetch(`${apiUrl}/startups?${queryParams.toString()}`, { cache: 'no-store' });
    if (!res.ok) {
       return { data: [], meta: { total: 0, page: 1, lastPage: 0 } };
    }
    return res.json();
  } catch (e) {
    return { data: [], meta: { total: 0, page: 1, lastPage: 0 } };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : "";
  const source = typeof resolvedParams.source === "string" ? resolvedParams.source : "";
  const locationFilter = typeof resolvedParams.locationFilter === "string" ? resolvedParams.locationFilter : "";

  const { data: backendStartups, meta } = await getStartups(page, search, source, locationFilter);
  
  const startups = backendStartups || [];

  return (
    <div className="flex flex-col font-sans selection:bg-primary/30">
      
      {/* --- Hero Section --- */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        <GridBackground />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 mb-8 hover:bg-primary/15 transition-colors cursor-default backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge variant="glass" className="h-5 px-2 text-[10px] uppercase font-bold tracking-wider text-primary">
              Beta
            </Badge>
            <span className="text-sm font-medium text-muted-foreground">
              Tracking <span className="text-foreground font-semibold">1,200+</span> active startups
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-1" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-5xl mx-auto leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 px-2 lg:px-0">
            Discover the next unicorn <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-500 animate-gradient-x">
              before the crowd.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Stop applying to outdated listings. We use AI to identify early-stage teams with 
            <span className="text-growth font-semibold"> high hiring probability</span> and 
            <span className="text-blue-400 font-semibold"> remote-first</span> DNA.
          </p>
          
          {/* Search Bar - Floating */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <SearchBar />
          </div>

          {/* Trusted By / Social Proof */}
          <div className="mt-20 pt-8 border-t border-white/5 max-w-4xl mx-auto animate-in fade-in duration-1000 delay-500 px-4">
            <p className="text-sm font-medium text-muted-foreground/60 mb-6 uppercase tracking-widest text-[10px]">Data Sourced From</p>
            <div className="grid grid-cols-2 lg:flex lg:justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 text-left lg:text-center items-center">
              <div className="flex items-center gap-2 font-bold text-sm md:text-lg text-white">Reddit r/hiring</div>
              <div className="flex items-center gap-2 font-bold text-sm md:text-lg text-white">
                <span className="text-orange-600 bg-white rounded-full p-0.5 h-5 w-5 md:h-6 md:w-6 flex items-center justify-center text-[10px] md:text-xs">P</span> Product Hunt
              </div>
              <div className="flex items-center gap-2 font-bold text-sm md:text-lg text-white">Hacker News</div>
              <div className="flex items-center gap-2 font-bold text-sm md:text-lg text-white">Lets-Code</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section id="features" className="py-24 bg-secondary/10 border-y border-white/5 relative">
         <div className="container mx-auto px-4">
           <div className="text-center max-w-2xl mx-auto mb-16">
             <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold tracking-wide uppercase text-sm">Why It Works</span>
             </div>
             <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Stop guessing. Start knowing.</h2>
             <p className="text-muted-foreground text-lg">Most job boards are lagging indicators. We track leading indicators to help you find opportunities first.</p>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
             {[
               {
                 icon: TrendingUp,
                 title: "Growth Signal",
                 desc: "We analyze team size growth, funding announcements, and product velocity to predict hiring needs before they are posted.",
                 color: "text-growth",
                 bg: "bg-growth/10",
                 border: "border-growth/20"
               },
               {
                 icon: Globe,
                 title: "Remote First",
                 desc: "Filter specifically for companies that are remote-friendly or async-first by default. No more \"fake remote\" listings.",
                 color: "text-blue-400",
                 bg: "bg-blue-500/10",
                 border: "border-blue-500/20"
               },
               {
                 icon: Zap,
                 title: "Direct Outreach",
                 desc: "Get AI-generated warm intro angles based on the founder's recent activity, tweets, and blog posts.",
                 color: "text-star",
                 bg: "bg-star/10",
                 border: "border-star/20"
               }
             ].map((feature, i) => (
               <div key={i} className={`bg-background/50 backdrop-blur-sm border ${feature.border} p-8 rounded-2xl hover:bg-background/80 transition-all duration-300 shadow-sm group`}>
                 <div className={`h-12 w-12 ${feature.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                   <feature.icon className={`h-6 w-6 ${feature.color}`} />
                 </div>
                 <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                 <p className="text-muted-foreground leading-relaxed">
                   {feature.desc}
                 </p>
               </div>
             ))}
           </div>
         </div>
      </section>

      {/* --- Dashboard Preview (Live Data) --- */}
      <section id="discover" className="py-24 container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-white flex items-center gap-3">
              {search || source ? (
                <>
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                  Search Results
                </>
              ) : (
                "Live Opportunities"
              )}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-muted-foreground text-sm">
                {search || source ? (
                  <>
                    Found <span className="text-foreground font-semibold">{meta?.total || 0}</span> positions 
                    {search && <> matching <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 ml-1">"{search}"</Badge></>}
                    {source && <> from <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 ml-1">{source}</Badge></>}
                  </>
                ) : (
                  "Freshly indexed startups with active hiring signals."
                )}
              </div>
              {(search || source) && (
                <Button variant="link" size="sm" asChild className="h-auto p-0 text-primary hover:text-primary/80 text-xs font-medium decoration-primary/30">
                  <Link href="/">
                    Clear all filters
                  </Link>
                </Button>
              )}
            </div>
          </div>
           <div className="flex flex-wrap gap-2 w-full md:w-auto h-auto min-h-0">
             <RefreshButton />
             <Button 
               variant={locationFilter === 'global_india' ? 'default' : 'outline'} 
               asChild
               className={`gap-2 h-9 text-xs md:text-sm whitespace-nowrap ${locationFilter === 'global_india' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'border-white/10 hover:bg-white/5'}`}
             >
               <Link href={locationFilter === 'global_india' ? '/' : '/?locationFilter=global_india'}>
                 <Globe className="h-4 w-4" /> {locationFilter === 'global_india' ? 'Global/India' : 'Worldwide / India'}
               </Link>
             </Button>
             <Button variant="outline" className="gap-2 h-9 text-xs border-white/10 hover:bg-white/5 opacity-50 cursor-not-allowed" title="Account system coming in v2">
                Saved <div className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-sm">0</div>
             </Button>
            <Button variant="outline" className="gap-2 h-9 text-xs border-white/10 hover:bg-white/5 opacity-50 cursor-not-allowed" title="Advanced filters coming soon">
               <SlidersHorizontal className="h-4 w-4" /> Filters
             </Button>
           </div>
        </div>

        {/* Source Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-sm text-muted-foreground mr-2 font-medium">Platform:</span>
          {[
            { label: 'All', value: '' },
            { label: 'HN Hiring', value: 'HN Hiring' },
            { label: 'Lets-Code', value: 'Lets-Code' },
            { label: 'Reddit', value: 'Reddit' }
          ].map((s) => {
            const isActive = source === s.value;
            const href = `/?${new URLSearchParams({
              ...(search && { search }),
              ...(s.value && { source: s.value }),
              ...(locationFilter && { locationFilter }),
            }).toString()}`;
            
            return (
              <Link key={s.label} href={href} className={isActive ? 'pointer-events-none' : ''}>
                <Badge
                  variant={isActive ? "default" : "outline"}
                  className={`px-3 py-1.5 text-xs font-medium cursor-pointer transition-all ${
                    isActive 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20" 
                      : "border-white/10 text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
                >
                  {s.label}
                </Badge>
              </Link>
            );
          })}
        </div>

        {startups.length > 0 ? (
          <div className="flex flex-col gap-4">
            {startups.map((startup: any) => (
              <div key={startup.id} className="w-full">
                  <StartupCard startup={startup} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-white/5 bg-secondary/10 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-xl font-medium text-white mb-3">No live opportunities found</h3>
            <p className="text-muted-foreground mb-6">
              There are currently zero active jobs matching your criteria in the database.
              If this is a fresh install, click the refresh button to trigger the scrapers and source real-time opportunities.
            </p>
            <RefreshButton />
          </div>
        )}
        
        <Pagination currentPage={meta?.page || 1} lastPage={meta?.lastPage || 1} />
      </section>
      
      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8 max-w-3xl mx-auto">
                Ready to find your next mission?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join 5,000+ engineers who use Job Radar to discover the most exciting early-stage startups.
            </p>
            <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300">
                Start Discovering Free
            </Button>
        </div>
      </section>
    </div>
  );
}
