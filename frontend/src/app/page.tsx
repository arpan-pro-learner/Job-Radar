import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StartupCard } from "@/components/startup/startup-card";
import { GridBackground } from "@/components/ui/grid-background";
import { SlidersHorizontal, ArrowRight, TrendingUp, Globe, Zap, Sparkles } from "lucide-react";
import { MOCK_STARTUPS } from "@/lib/mock-data";
import { SearchBar } from "@/components/startup/search-bar";
import { Pagination } from "@/components/startup/pagination";
import { RefreshButton } from "@/components/startup/refresh-button";
import Link from "next/link";

async function getStartups(page: number = 1, search: string = "", source: string = "") {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: "12",
      ...(search && { search }),
      ...(source && { source }),
    });
    
    const res = await fetch(`http://localhost:3001/startups?${queryParams.toString()}`, { cache: 'no-store' });
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

  const { data: backendStartups, meta } = await getStartups(page, search, source);
  
  // Only use mock data if there's no search/filter and backend returned nothing
  const startups = backendStartups.length > 0 ? backendStartups : (search || source ? [] : MOCK_STARTUPS);

  return (
    <div className="flex flex-col font-sans selection:bg-primary/30">
      
      {/* --- Hero Section --- */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        <GridBackground />
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full opacity-30 pointer-events-none" />

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
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-5xl mx-auto leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Discover the next unicorn <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-500 animate-gradient-x">
              before the crowd.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            Stop applying to black holes. We use AI to identify early-stage teams with 
            <span className="text-growth font-semibold"> high hiring probability</span> and 
            <span className="text-blue-400 font-semibold"> remote-first</span> DNA.
          </p>
          
          {/* Search Bar - Floating */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <SearchBar />
          </div>

          {/* Trusted By / Social Proof */}
          <div className="mt-20 pt-8 border-t border-white/5 max-w-4xl mx-auto animate-in fade-in duration-1000 delay-500">
            <p className="text-sm font-medium text-muted-foreground/60 mb-6 uppercase tracking-widest text-[10px]">Data Sourced From</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-bold text-lg text-white">Reddit r/hiring</div>
              <div className="flex items-center gap-2 font-bold text-lg text-white"><span className="text-orange-600 bg-white rounded-full p-0.5 h-6 w-6 flex items-center justify-center">P</span> Product Hunt</div>
              <div className="flex items-center gap-2 font-bold text-lg text-white">Hacker News</div>
              <div className="flex items-center gap-2 font-bold text-lg text-white">Lets-Code</div>
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
      <section id="discover" className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-4">
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
              <p className="text-muted-foreground text-sm">
                {search || source ? (
                  <>
                    Found <span className="text-foreground font-semibold">{meta?.total || 0}</span> positions 
                    {search && <> matching <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 ml-1">"{search}"</Badge></>}
                    {source && <> from <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 ml-1">{source}</Badge></>}
                  </>
                ) : (
                  "Freshly indexed startups with active hiring signals."
                )}
              </p>
              {(search || source) && (
                <Link href="/">
                  <Button variant="link" size="sm" className="h-auto p-0 text-primary hover:text-primary/80 text-xs font-medium decoration-primary/30">
                    Clear all filters
                  </Button>
                </Link>
              )}
            </div>
          </div>
           <div className="flex gap-3">
             <RefreshButton />
             <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/5">
                Saved <div className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-sm">0</div>
             </Button>
             <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/5">
               <SlidersHorizontal className="h-4 w-4" /> Filters
             </Button>
           </div>
        </div>

        {startups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {startups.map((startup: any, index: number) => (
              <div key={startup.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${Math.min(index, 12) * 50}ms` }}>
                  <StartupCard startup={startup} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-xl font-medium text-white mb-2">No startups found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
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
