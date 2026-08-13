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

export interface RepoDetails {
  description: string | null;
  /** Languages GitHub detects, largest first — grows on its own as the repo does. */
  languages: string[];
  url: string;
  homepage: string | null;
  pushedAt: string;
}

/**
 * Pulls live detail for a single repo so a project card reflects the repo as it
 * stands rather than hand-maintained copy. Same 1 hour cache as the feed above,
 * so a push shows up on the site within the hour without a redeploy.
 *
 * Fails soft: returns null on any error and the card falls back to its static
 * entry in content/projects.ts.
 */
export async function getRepoDetails(
  repo: string
): Promise<RepoDetails | null> {
  try {
    const base = `https://api.github.com/repos/${GITHUB_USERNAME}/${repo}`;
    const options = {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    };

    const [repoRes, langRes] = await Promise.all([
      fetch(base, options),
      fetch(`${base}/languages`, options),
    ]);

    if (!repoRes.ok) return null;
    const data = await repoRes.json();

    // Languages come back as { "C#": 22380, ... }; order by bytes, biggest first.
    let languages: string[] = [];
    if (langRes.ok) {
      const raw = await langRes.json();
      if (raw && typeof raw === "object") {
        languages = Object.entries(raw as Record<string, number>)
          .sort((a, b) => b[1] - a[1])
          .map(([name]) => name);
      }
    }

    return {
      description: data.description ?? null,
      languages,
      url: data.html_url,
      homepage: data.homepage || null,
      pushedAt: data.pushed_at,
    };
  } catch {
    return null;
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
