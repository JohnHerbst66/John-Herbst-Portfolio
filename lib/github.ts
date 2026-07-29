export const GITHUB_USERNAME = "JohnHerbst66";

export interface RepoActivity {
  name: string;
  description: string | null;
  language: string | null;
  url: string;
  updatedAt: string;
}

/**
 * Pulls the most recently updated public repos directly from the GitHub API.
 * Runs server-side (build/ISR), so it never hits client-side rate limits
 * and needs no API key for public data.
 *
 * Cached for 1 hour (`revalidate: 3600`) — adjust if you want it fresher.
 * Fails soft: returns [] on any error so the page still renders.
 */
export async function getRecentRepos(limit = 6): Promise<RepoActivity[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=${limit}`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      url: repo.html_url,
      updatedAt: repo.updated_at,
    }));
  } catch {
    return [];
  }
}

/** Formats an ISO date as "3h ago" / "2d ago" / "5mo ago" for the terminal-style feed. */
export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return `${months}mo ago`;
}
