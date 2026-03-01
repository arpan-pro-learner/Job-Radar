"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useSavedStartups() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem("saved_startups");
    if (saved) {
      try {
        setSavedIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved startups", e);
      }
    }
  }, []);

  const toggleSave = (id: string, name: string) => {
    let newSavedIds;
    let isSaved = false;

    if (savedIds.includes(id)) {
      newSavedIds = savedIds.filter((sid) => sid !== id);
      toast({
        title: "Startup Removed",
        description: `${name} has been removed from your saved list.`,
      });
    } else {
      newSavedIds = [...savedIds, id];
      isSaved = true;
      toast({
        title: "Startup Saved",
        description: `${name} has been added to your saved list.`,
        variant: "success", // Ensure 'success' variant is handled or fallback to default
      });
    }

    setSavedIds(newSavedIds);
    localStorage.setItem("saved_startups", JSON.stringify(newSavedIds));
    return isSaved;
  };

  const isSaved = (id: string) => savedIds.includes(id);

  return { savedIds, toggleSave, isSaved };
}
