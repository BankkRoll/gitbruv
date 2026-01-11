import { createFileRoute, Outlet, Link, useParams, useLocation } from "@tanstack/react-router";
import { useRepoPageData } from "@/lib/hooks/use-repositories";
import { Code, CircleDot, GitPullRequest, MessageSquare, PlayCircle, BarChart2, Settings, ChevronDown, Book } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_main/$username/$repo")({
  component: RepoLayout,
});

function RepoLayout() {
  const { username, repo: repoName } = useParams({ from: "/_main/$username/$repo" });
  const { data, isLoading } = useRepoPageData(username, repoName);
  const location = useLocation();

  if (isLoading || !data) return <Outlet />;

  const { isOwner } = data;

  const tabs = [
    { name: "Code", icon: Code, href: "/$username/$repo", exact: true },
    { name: "Issues", icon: CircleDot, count: 0 },
    { name: "Pull requests", icon: GitPullRequest, count: 0 },
    { name: "Discussions", icon: MessageSquare },
    { name: "Actions", icon: PlayCircle },
    { name: "Insights", icon: BarChart2 },
    ...(isOwner ? [{ name: "Settings", icon: Settings, href: "/$username/$repo/settings" }] : []),
  ];

  const isTabActive = (tab: (typeof tabs)[0]) => {
    if (tab.href) {
      const href = tab.href.replace("$username", username).replace("$repo", repoName);
      if (tab.exact) return location.pathname === href;
      return location.pathname.startsWith(href);
    }
    return false;
  };

  return (
    <div className="flex flex-col h-full shrink-0 bg-background">
      <div className="bg-secondary/50 border-b border-border">
        <div className="p-2">
          <nav className="flex items-center overflow-x-auto no-scrollbar h-9">
            {tabs.map((tab) => {
              const active = isTabActive(tab);
              const linkContent = (
                <>
                  <tab.icon className={cn("h-4 w-4 text-muted-foreground")} />
                  <span>{tab.name}</span>
                  {tab.count !== undefined && <span className="px-1.5 py-0.5 text-[10px] bg-foreground/10 font-medium">{tab.count}</span>}
                </>
              );

              if (tab.href) {
                return (
                  <Link
                    key={tab.name}
                    to={tab.href as any}
                    params={{ username, repo: repoName } as any}
                    className={cn(
                      "flex items-center gap-2 px-3 h-9 text-sm transition-colors",
                      active ? "bg-foreground text-background font-semibold" : "border-transparent text-foreground hover:bg-accent/10"
                    )}
                  >
                    {linkContent}
                  </Link>
                );
              }

              return (
                <div
                  key={tab.name}
                  className={cn(
                    "flex items-center gap-2 px-3 h-11 text-sm transition-colors border-b-2 cursor-not-allowed opacity-50",
                    "border-transparent text-foreground"
                  )}
                >
                  {linkContent}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
      <main className="flex-1 shrink-0 grow h-full">
        <Outlet />
      </main>
    </div>
  );
}
