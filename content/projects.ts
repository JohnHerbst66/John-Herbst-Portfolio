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
    slug: "login-test-app",
    name: "Login Test App",
    tagline: "A sandbox app for testing and debugging auth flows",
    stack: ["TBD"], // TODO: fill in real stack once pushed
    problem: "TODO",
    approach: "TODO",
    outcome: "TODO",
    status: "pending",
  },
  {
    slug: "mvc-apps",
    name: "MVC Apps",
    tagline: "Earlier MVC-pattern projects",
    stack: ["TBD"], // TODO: fill in real stack once pushed
    problem: "TODO",
    approach: "TODO",
    outcome: "TODO",
    status: "pending",
  },
];
