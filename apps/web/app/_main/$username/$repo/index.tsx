import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useRepoPageData, useRepoReadme, useRepoCommits, useRepoCommitCount } from "@/lib/hooks/use-repositories";
import { useUserAvatarByEmail } from "@/lib/hooks/use-users";
import { FileTree } from "@/components/file-tree";
import { CodeViewer } from "@/components/code-viewer";
import { CloneUrl } from "@/components/clone-url";
import { BranchSelector } from "@/components/branch-selector";
import { StarButton } from "@/components/star-button";
import {
  GitBranch,
  Loader2,
  Search,
  ChevronDown,
  History,
  BookOpen,
  Scale,
  Star,
  GitFork,
  Activity,
  Book,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_main/$username/$repo/")({
  component: RepoPage,
});

function ActionButton({
  icon: Icon,
  label,
  count,
  hasChevron,
  className,
}: {
  icon?: any;
  label: string;
  count?: string | number;
  hasChevron?: boolean;
  className?: string;
}) {
  return (
    <div className="flex items-center">
      <Button
        variant="secondary"
        size="sm"
        className={cn("h-7 px-3 text-xs font-medium border border-border flex items-center gap-1.5", className)}
      >
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        <span>{label}</span>
        {count !== undefined && <span className="px-1.5 py-0.5 bg-foreground/10 font-medium text-[10px]">{count}</span>}
        {hasChevron && <ChevronDown className="h-3 w-3 text-muted-foreground" />}
      </Button>
    </div>
  );
}

function SplitActionButton({ icon: Icon, label, count }: { icon: any; label: string; count?: string | number }) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className="h-7 px-2.5 text-xs font-medium border border-border flex items-center gap-1.5"
    >
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span>{label}</span>
      {count !== undefined && <span className="px-1.5 py-0.5 bg-foreground/10 font-medium text-[10px]">{count}</span>}
    </Button>
  );
}

function RepoPage() {
  const { username, repo: repoName } = Route.useParams();
  const { data, isLoading } = useRepoPageData(username, repoName);
  const { data: commitData } = useRepoCommits(username, repoName, data?.repo.defaultBranch || "main", 1);
  const { data: commitCountData } = useRepoCommitCount(username, repoName, data?.repo.defaultBranch || "main");

  if (isLoading || !data) {
    return null;
  }

  const { repo, files, isEmpty, branches, readmeOid } = data;
  const lastCommit = commitData?.commits?.[0];
  const commitCount = commitCountData?.count || 0;
  const { data: avatarData } = useUserAvatarByEmail(lastCommit?.author.email);

  return (
    <div className="container px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">{repo.name}</h1>
          <span className="px-2 py-0.5 border border-border text-muted-foreground text-[11px] font-medium">
            {repo.visibility === "private" ? "Private" : "Public"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <SplitActionButton icon={Eye} label="Watch" count={5} />
          <SplitActionButton icon={GitFork} label="Fork" count={0} />
          <StarButton repoId={repo.id} initialStarred={repo.starred} initialCount={repo.starCount} />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BranchSelector branches={branches} currentBranch={repo.defaultBranch} username={username} repoName={repo.name} />
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-sm px-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{branches.length}</span>
                <span className="text-muted-foreground">Branches</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Go to file"
                  className="h-8 w-[200px] pl-8 text-sm"
                />
              </div>
              <ActionButton label="Add file" hasChevron />
              <Button size="sm" className="h-8 px-3 text-xs font-medium gap-1.5">
                <span>{"</>"} Code</span>
                <ChevronDown className="h-3 w-3 opacity-70" />
              </Button>
            </div>
          </div>

          <div className="border border-border overflow-hidden bg-card">
            <div className="flex items-center justify-between px-4 py-2.5 bg-secondary/50 border-b border-border">
              <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                <Avatar className="h-5 w-5 shrink-0">
                  <AvatarImage src={avatarData?.avatarUrl || undefined} />
                  <AvatarFallback className="text-[10px] bg-muted">{lastCommit?.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium whitespace-nowrap">{lastCommit?.author.name}</span>
                <span className="text-sm text-muted-foreground truncate">{lastCommit?.message}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0 ml-4">
                <span className="font-mono text-xs">{lastCommit?.oid.substring(0, 7)}</span>
                <span className="whitespace-nowrap">{lastCommit ? formatDistanceToNow(lastCommit.timestamp) + " ago" : ""}</span>
                <Link
                  to="/$username/$repo/commits/$branch"
                  params={{ username, repo: repoName, branch: repo.defaultBranch }}
                  className="flex items-center gap-1.5 font-medium hover:text-primary"
                >
                  <History className="h-4 w-4" />
                  <span>{commitCount} Commits</span>
                </Link>
              </div>
            </div>

            {isEmpty ? (
              <div className="p-12 text-center">
                <GitBranch className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-base font-semibold mb-2">This repository is empty</h3>
                <p className="text-muted-foreground mb-6 text-sm">Get started by cloning or pushing to this repository.</p>
                <div className="max-w-md mx-auto p-4 bg-secondary/30 border border-border">
                  <CloneUrl username={username} repoName={repo.name} />
                </div>
              </div>
            ) : (
              <FileTree files={files} username={username} repoName={repo.name} branch={repo.defaultBranch} />
            )}
          </div>

          {readmeOid && (
            <div className="border border-border overflow-hidden mt-4 bg-card">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50 border-b border-border">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">README.md</span>
              </div>
              <div className="p-6 markdown-body">
                <ReadmeContent username={username} repoName={repoName} readmeOid={readmeOid} />
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-3 space-y-5">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold">About</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{repo.description || "No description provided."}</p>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer">
                <Book className="h-4 w-4 shrink-0" />
                <span>Readme</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer">
                <Scale className="h-4 w-4 shrink-0" />
                <span>Apache-2.0 license</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer">
                <Activity className="h-4 w-4 shrink-0" />
                <span>Activity</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer">
                <Star className="h-4 w-4 shrink-0" />
                <span><span className="font-medium text-foreground">{repo.starCount}</span> stars</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer">
                <GitFork className="h-4 w-4 shrink-0" />
                <span><span className="font-medium text-foreground">0</span> forks</span>
              </div>
            </div>
          </section>

          <section className="space-y-2 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold">Releases</h3>
            <p className="text-sm text-muted-foreground">No releases published</p>
            <button className="text-sm text-primary hover:underline">Create a new release</button>
          </section>

          <section className="space-y-2 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold">Packages</h3>
            <p className="text-sm text-muted-foreground">No packages published</p>
            <button className="text-sm text-primary hover:underline">Publish your first package</button>
          </section>

          <section className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Contributors</h3>
              <span className="px-1.5 py-0.5 bg-muted text-[10px] font-medium">5</span>
            </div>
            <div className="flex -space-x-1.5">
              {[...Array(5)].map((_, i) => (
                <Avatar key={i} className="h-7 w-7 border-2 border-background">
                  <AvatarFallback className="bg-muted text-[10px]">{i}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function ReadmeContent({ username, repoName, readmeOid }: { username: string; repoName: string; readmeOid: string }) {
  const { data, isLoading } = useRepoReadme(username, repoName, readmeOid);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data?.content) return null;

  return <CodeViewer content={data.content} language="markdown" />;
}
