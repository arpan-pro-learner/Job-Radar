"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
}

export function Pagination({ currentPage, lastPage }: PaginationProps) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  if (lastPage <= 1) return null;

  return (
    <div className="mt-16 flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="border-white/10 hover:bg-white/5"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-white">Page {currentPage}</span>
        <span className="text-sm text-muted-foreground">of {lastPage}</span>
      </div>

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= lastPage}
        onClick={() => handlePageChange(currentPage + 1)}
        className="border-white/10 hover:bg-white/5"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
