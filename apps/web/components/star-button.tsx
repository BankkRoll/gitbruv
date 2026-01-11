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
    <Button
      variant="secondary"
      size="sm"
      onClick={handleClick}
      disabled={isMutating}
      className={cn(
        "h-7 px-2.5 text-xs font-medium border border-border flex items-center gap-1.5",
        className
      )}
    >
      <Star className={cn("h-3.5 w-3.5", starred ? "fill-primary text-primary" : "text-muted-foreground")} />
      <span>{starred ? "Starred" : "Star"}</span>
      <span className="px-1.5 py-0.5 bg-foreground/10 font-medium text-[10px]">{count}</span>
    </Button>
  );
}
