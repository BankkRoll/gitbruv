import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { api, fetcher, type RepoPageData, type RepositoryWithOwner, type RepositoryWithStars, type FileEntry, type Commit } from "@/lib/api/client";

export function useRepoPageData(owner: string, name: string) {
  return useSWR<RepoPageData>(owner && name ? `/api/repositories/${owner}/${name}/page-data` : null, fetcher);
}

export function useRepositoryWithStars(owner: string, name: string) {
  return useSWR<RepositoryWithOwner>(owner && name ? `/api/repositories/${owner}/${name}/with-stars` : null, fetcher);
}

export function useUserRepositories(username: string) {
  return useSWR<{ repos: RepositoryWithStars[] }>(username ? `/api/repositories/user/${username}` : null, fetcher);
}

export function usePublicRepositories(sortBy: "stars" | "updated" | "created" = "updated", limit = 20, offset = 0) {
  return useSWR<{ repos: RepositoryWithStars[]; hasMore: boolean }>(
    `/api/repositories/public?sortBy=${sortBy}&limit=${limit}&offset=${offset}`,
    fetcher
  );
}

export function useRepoTree(owner: string, name: string, branch: string, path = "") {
  return useSWR<{ files: FileEntry[]; isEmpty: boolean }>(
    owner && name && branch ? `/api/repositories/${owner}/${name}/tree?branch=${branch}&path=${encodeURIComponent(path)}` : null,
    fetcher
  );
}

export function useRepoFile(owner: string, name: string, branch: string, path: string) {
  return useSWR<{ content: string; oid: string; path: string }>(
    owner && name && branch && path ? `/api/repositories/${owner}/${name}/file?branch=${branch}&path=${encodeURIComponent(path)}` : null,
    fetcher
  );
}

export function useRepoBranches(owner: string, name: string) {
  return useSWR<{ branches: string[] }>(owner && name ? `/api/repositories/${owner}/${name}/branches` : null, fetcher);
}

export function useRepoCommits(owner: string, name: string, branch: string, limit = 30, skip = 0) {
  return useSWR<{ commits: Commit[]; hasMore: boolean }>(
    owner && name && branch ? `/api/repositories/${owner}/${name}/commits?branch=${branch}&limit=${limit}&skip=${skip}` : null,
    fetcher
  );
}

export function useRepoCommitCount(owner: string, name: string, branch: string) {
  return useSWR<{ count: number }>(owner && name && branch ? `/api/repositories/${owner}/${name}/commits/count?branch=${branch}` : null, fetcher);
}

export function useRepoReadme(owner: string, name: string, oid: string | null) {
  return useSWR<{ content: string }>(owner && name && oid ? `/api/repositories/${owner}/${name}/readme?oid=${oid}` : null, fetcher);
}

export function useCreateRepository() {
  return useSWRMutation("/api/repositories", (_, { arg }: { arg: { name: string; description?: string; visibility: "public" | "private" } }) =>
    api.repositories.create(arg)
  );
}

export function useUpdateRepository(id: string) {
  return useSWRMutation(
    `/api/repositories/${id}`,
    (_: any, { arg }: { arg: { name?: string; description?: string; visibility?: "public" | "private" } }) => api.repositories.update(id, arg)
  );
}

export function useDeleteRepository(id: string) {
  return useSWRMutation(`/api/repositories/${id}`, () => api.repositories.delete(id));
}

export function useToggleStar(repoId: string) {
  return useSWRMutation(`/api/repositories/${repoId}/star`, () => api.repositories.toggleStar(repoId));
}
