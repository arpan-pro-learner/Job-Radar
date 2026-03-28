"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  async function handleRefresh() {
    try {
      setIsRefreshing(true);
      
      // Calls the backend endpoint to trigger ingestion
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';
      const res = await fetch(`${apiUrl}/ingestion/trigger`, {
        method: "POST",
      });
      
      if (!res.ok) {
        console.error("Failed to trigger data refresh");
        alert("Failed to refresh data. Ensure backend is running.");
      } else {
        alert("Scraping started! This process takes a few minutes as the AI analyzes each job. Check back soon!");
        router.refresh(); 
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      alert("Error refreshing data.");
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="gap-2 border-white/10 hover:bg-white/5"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} /> 
      {isRefreshing ? "Refreshing..." : "Refresh Data"}
    </Button>
  );
}
