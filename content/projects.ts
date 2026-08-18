export type ProjectStatus = "live" | "repo" | "pending";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  stack: string[];
  problem: string;
  approach: string;
  outcome: string;
  demoUrl?: string;
  repoUrl?: string;
  status: ProjectStatus; // "live" = has a working demo, "repo" = code only, "pending" = not pushed yet
  /**
   * Repo name under the GitHub account. When set, the card pulls its stack and
   * tagline live from GitHub, so pushing code updates the site on its own.
   */
  githubRepo?: string;
}

// Add a new object to this array to feature a project. Nothing else needs to change —
// the homepage reads this list directly. Order here is display order.
export const projects: Project[] = [
  {
    slug: "spy-agency-app",
    name: "Spy Agency App",
    tagline: "A vault-style login and records system",
    stack: ["Python", "Flask", "SQLite"],
    problem:
      "Needed a small server-backed app with real authentication and persistent storage, not just a static front end.",
    approach:
      "Built a Flask backend with a SQLite data layer for records and a login flow, then deployed it as a live service.",
    outcome:
      "Live and running on Render — first project in the lineup with a real backend, database, and deployment pipeline.",
    demoUrl: "https://spy-agency-app.onrender.com",
    repoUrl: "https://github.com/JohnHerbst66/spy-agency-app",
    status: "live",
  },
  {
    slug: "slip-management",
    name: "Slip Management",
    tagline: "A tailored slip management system built for a company",
    stack: ["C#", ".NET", "WinForms"],
    problem:
      "A company needed slip creation and printing handled their way — truck registration tracking, specific printers, and their own branding — which off-the-shelf tools didn't support.",
    approach:
      "Built as a C# WinForms desktop app with customizable slip fields and branding, named printer preferences, full-screen forms, and a daily summary panel for tracking activity at a glance.",
    outcome:
      "An actively evolving system — recent updates added truck registration enforcement and refined the print workflow based on real usage.",
    repoUrl: "https://github.com/JohnHerbst66/SlipManagement2",
    status: "repo",
  },
  {
    slug: "koolstoof-delivery",
    name: "Koolstoof Delivery",
    // Tagline and stack are overridden live from GitHub — see githubRepo below.
    tagline:
      "A .NET Core MVC web app for a local restaurant's delivery service",
    stack: ["C#", ".NET 10", "ASP.NET Core MVC", "EF Core"],
    problem:
      "Koolstoof, a local restaurant, needs a delivery service built around how they actually operate rather than a generic ordering platform.",
    approach:
      "An ASP.NET Core MVC application on .NET 10, with Entity Framework Core over SQL Server for the data layer, ASP.NET Core Identity for accounts, and a Dockerfile so it runs the same everywhere.",
    outcome:
      "Early days — the project is scaffolded with Identity and the database context in place, and is being actively built out.",
    repoUrl: "https://github.com/JohnHerbst66/MVC-Koolstoof-Delivery-Web-App",
    githubRepo: "MVC-Koolstoof-Delivery-Web-App",
    status: "repo",
  },
];
