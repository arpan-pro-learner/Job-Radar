"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";

export function SearchBar() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [source, setSource] = useState(searchParams.get("source") || "");

  const SOURCES = [
    { label: "All Sources", value: "" },
    { label: "HN Hiring", value: "HN Hiring" },
    { label: "Reddit", value: "Reddit" },
    { label: "Lets-Code", value: "Lets-Code" },
  ];

  // Sync state with URL parameters (for pagination or clear filters)
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setSource(searchParams.get("source") || "");
  }, [searchParams]);

  function handleSearch() {
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }

    if (source) {
      params.set("source", source);
    } else {
      params.delete("source");
    }
    
    params.set("page", "1"); // Reset to page 1 on new search

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="max-w-xl mx-auto relative group px-4 w-full">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-blue-500/30 to-indigo-500/30 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-500 mx-4"></div>
      <div className="relative bg-background/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center p-2 gap-2 w-full">
        <div className="flex items-center flex-1 min-w-0">
          <Search className="h-5 w-5 text-muted-foreground ml-3 shrink-0" />
          <Input 
            placeholder="Search tech stack..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-10 md:h-12 text-sm md:text-base placeholder:text-muted-foreground/50 text-foreground w-full"
          />
        </div>
        
        <div className="flex items-center gap-2 md:gap-0 w-full md:w-auto">
          <select 
            value={source}
            onChange={(e) => {
              const val = e.target.value;
              setSource(val);
              const params = new URLSearchParams(searchParams.toString());
              if (val) params.set("source", val);
              else params.delete("source");
              params.set("page", "1");
              startTransition(() => {
                replace(`${pathname}?${params.toString()}`);
              });
            }}
            className="bg-zinc-900 md:bg-transparent text-sm text-muted-foreground focus:outline-none cursor-pointer px-3 h-10 md:h-12 border border-white/10 md:border-0 rounded-xl md:rounded-none flex-1 md:min-w-0"
          >
            {SOURCES.map(s => (
              <option key={s.value} value={s.value} className="bg-zinc-900 text-foreground">
                {s.label}
              </option>
            ))}
          </select>

          <Button 
            onClick={handleSearch}
            disabled={isPending}
            size="lg" 
            className="rounded-xl h-10 md:h-12 px-6 font-semibold shadow-lg shadow-primary/25 md:ml-2 flex-1 md:flex-none"
          >
            {isPending ? "..." : "Search"}
          </Button>
        </div>
      </div>
    </div>
  );
}
