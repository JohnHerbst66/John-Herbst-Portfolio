# John Herbst — Portfolio

A Next.js portfolio with two moving parts:

1. **Featured Builds** — curated, manually written project write-ups (`content/projects.ts`)
2. **Live Activity** — auto-updating feed pulled straight from the GitHub API, refreshes hourly, no manual work required

## Before you deploy — fill in these TODOs

- `content/projects.ts` — replace every `"TODO"` string with real problem/approach/outcome copy, and confirm the stack tags for **Login Test App** and **MVC Apps** once those repos are public
- `content/projects.ts` — replace `REPLACE-WITH-YOUR-RENDER-URL` with your actual live Render URL for the Spy Agency App
- `components/Footer.tsx` — replace the placeholder email and LinkedIn URL

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Add a new featured project (any time)

Open `content/projects.ts` and add a new object to the `projects` array:

```ts
{
  slug: "your-project-slug",
  name: "Project Name",
  tagline: "One line describing it",
  stack: ["Language", "Framework"],
  problem: "What problem it solves.",
  approach: "What you built and how.",
  outcome: "What happened / what you learned.",
  demoUrl: "https://your-live-link.com", // optional
  repoUrl: "https://github.com/JohnHerbst66/your-repo", // optional
  status: "live", // "live" | "repo" | "pending"
},
```

Push it — that's the only file you need to touch to add a project card.

## The Live Activity feed

`lib/github.ts` calls the public GitHub API for `JohnHerbst66` and lists your
most recently updated repos. It's a server-side fetch cached for 1 hour
(`next: { revalidate: 3600 }`), so:

- You never have to touch this section manually
- It has no rate-limit issues (server-side, not client-side)
- If GitHub is briefly unreachable, it fails soft and just shows an empty-state message instead of crashing

If you want it to refresh faster or slower, change the `3600` (seconds) in `lib/github.ts`.

## Deploying (Vercel, free)

1. Push this project to a new GitHub repo
2. Go to https://vercel.com, "New Project", import that repo
3. Leave the defaults (Vercel auto-detects Next.js) and click Deploy
4. Every future push to `main` auto-redeploys

## Design notes

Dark charcoal-navy base with a blueprint-blue structural accent and an amber
"signal" accent used sparingly for live/status indicators — a technical
build-log/schematic feel rather than a generic landing page. Panels use
corner-bracket framing (like a spec sheet) instead of drop shadows. Fonts:
Space Grotesk (display), Inter (body), IBM Plex Mono (labels, stack tags,
the terminal-style status line in the hero).
