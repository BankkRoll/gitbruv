import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { GitBranch, Check, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function BranchSelector({
  branches,
  currentBranch,
  username,
  repoName,
  basePath = "",
}: {
  branches: string[]
  currentBranch: string
  username: string
  repoName: string
  basePath?: string
}) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleSelect(branch: string) {
    setOpen(false)
    if (branch === currentBranch) return

    const splat = basePath ? `${branch}/${basePath}` : branch
    navigate({
      to: "/$username/$repo/tree/$",
      params: { username, repo: repoName, _splat: splat },
    })
  }

  if (branches.length === 0) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <GitBranch className="h-4 w-4" />
        {currentBranch}
      </Button>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="h-8 gap-2 px-3 text-sm font-semibold bg-secondary hover:bg-muted border border-border shadow-sm">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <span className="max-w-[120px] truncate text-foreground">{currentBranch}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[300px] p-0 overflow-hidden shadow-lg border-border">
        <div className="px-3 py-2.5 text-xs font-semibold border-b border-border bg-secondary">
          Switch branches/tags
        </div>
        <div className="p-2">
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Filter branches/tags" 
              className="w-full h-8 pl-8 pr-3 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {branches.map((branch) => (
              <DropdownMenuItem
                key={branch}
                onClick={() => handleSelect(branch)}
                className={cn(
                  "cursor-pointer px-3 py-2 text-sm rounded-md border-b border-border/30 last:border-0",
                  branch === currentBranch && "bg-secondary"
                )}
              >
                <Check
                  className={cn(
                    "h-3.5 w-3.5 mr-2",
                    branch === currentBranch ? "opacity-100 text-primary" : "opacity-0"
                  )}
                />
                <span className={cn("truncate text-foreground", branch === currentBranch ? "font-semibold" : "font-normal")}>
                  {branch}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
