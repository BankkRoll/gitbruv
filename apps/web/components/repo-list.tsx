import { Link } from "@tanstack/react-router"
import { formatDistanceToNow } from "date-fns"
import { Lock, Globe, Star } from "lucide-react"

type Repository = {
  id: string
  name: string
  description: string | null
  visibility: "public" | "private"
  updatedAt: Date | string
  starCount?: number
  owner?: {
    username: string
    name: string | null
  }
}

export function RepoList({
  repos,
  username,
}: {
  repos: Repository[]
  username?: string
}) {
  return (
    <div className="divide-y divide-border border-t border-border">
      {repos.map((repo) => {
        const ownerUsername = repo.owner?.username || username || ""
        const showOwner = repo.owner && repo.owner.username !== username

        return (
          <div
            key={repo.id}
            className="py-6 first:pt-0"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    to="/$username/$repo"
                    params={{ username: ownerUsername, repo: repo.name }}
                    className="font-bold text-accent hover:underline text-lg md:text-xl inline-flex items-center"
                  >
                    {showOwner && (
                      <span className="font-normal mr-1">
                        {repo.owner?.username} /
                      </span>
                    )}
                    {repo.name}
                  </Link>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border border-border text-muted-foreground bg-transparent uppercase tracking-tight"
                  >
                    {repo.visibility === "private" ? "Private" : "Public"}
                  </span>
                </div>
                {repo.description && (
                  <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                    {repo.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>TypeScript</span>
                  </div>
                  {typeof repo.starCount === "number" && repo.starCount > 0 && (
                    <Link to="#" className="flex items-center gap-1 hover:text-accent transition-colors">
                      <Star className="h-3.5 w-3.5" />
                      <span>{repo.starCount}</span>
                    </Link>
                  )}
                  <p>
                    Updated {formatDistanceToNow(new Date(repo.updatedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className="shrink-0 pt-1">
                <button className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md border border-border bg-secondary hover:bg-secondary-foreground/10 transition-colors">
                  <Star className="h-3.5 w-3.5 text-muted-foreground" />
                  Star
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
