"use client";

import { useState } from "react";
import { Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToggleStar } from "@/lib/hooks/use-repositories";
import { cn } from "@/lib/utils";
import { mutate } from "swr";

export function StarButton({
  repoId,
  initialStarred,
  initialCount,
  className,
}: {
  repoId: string;
  initialStarred: boolean;
  initialCount: number;
  className?: string;
}) {
  const [starred, setStarred] = useState(initialStarred);
  const [count, setCount] = useState(initialCount);
  const { trigger, isMutating } = useToggleStar(repoId);

  async function handleClick() {
    try {
      const result = await trigger();
      if (result) {
        setStarred(result.starred);
        setCount((c) => (result.starred ? c + 1 : c - 1));
        mutate((key) => typeof key === "string" && key.includes("/repositories"));
      }
    } catch {}
  }

  return (
    <div className="flex items-center">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleClick}
        disabled={isMutating}
        className={cn(
          "h-7 px-2.5 rounded-r-none border-r-0 text-xs font-medium bg-secondary hover:bg-secondary-foreground/10 transition-colors",
          starred && "text-accent",
          className
        )}
      >
        <Star className={cn("h-3.5 w-3.5 mr-1.5", starred && "fill-accent text-accent", !starred && "text-muted-foreground")} />
        {starred ? "Starred" : "Star"}
        <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-foreground/5 text-[10px] font-semibold text-foreground/70">
          {count}
        </span>
      </Button>
      <Button 
        variant="secondary" 
        size="sm" 
        className="h-7 px-1 rounded-l-none border-l border-border bg-secondary hover:bg-secondary-foreground/10"
      >
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </Button>
    </div>
  );
}
