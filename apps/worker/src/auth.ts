import { type AuthenticatedUser, type Credentials, verifyCredentials, getRepoWithOwner, getUserById } from "@gitbruv/auth";
import { type Database, repositories, sessions } from "@gitbruv/db";
import { eq, gt } from "drizzle-orm";

export type { AuthenticatedUser };

export function parseBasicAuth(request: Request): Credentials | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) {
    return null;
  }
  const credentials = atob(authHeader.slice(6));
  const colonIndex = credentials.indexOf(":");
  if (colonIndex === -1) {
    return null;
  }
  return {
    email: credentials.slice(0, colonIndex),
    password: credentials.slice(colonIndex + 1),
  };
}

export async function authenticateRequest(request: Request, db: Database): Promise<AuthenticatedUser | null> {
  const authHeader = request.headers.get("authorization");
  
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.token, token),
    });
    
    if (session && session.expiresAt > new Date()) {
      const user = await getUserById(db, session.userId);
      if (user) {
        return { id: user.id, username: user.username };
      }
    }
    return null;
  }
  
  const creds = parseBasicAuth(request);
  if (!creds) {
    return null;
  }

  const result = await verifyCredentials(db, creds);
  return result.user;
}

export async function getRepoOwnerAndRepo(
  db: Database,
  username: string,
  repoName: string
): Promise<{ owner: { id: string; username: string }; repo: typeof repositories.$inferSelect } | null> {
  return getRepoWithOwner(db, username, repoName);
}
