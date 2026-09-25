export type ProjectStatus = "live" | "repo" | "pending";

export interface Screenshot {
  /** Path under /public. */
  src: string;
  caption: string;
}

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
  status: ProjectStatus; // "live" = has a working demo, "repo" = code only, "pending" = in progress
  /**
   * The code exists but is deliberately kept private. Leave repoUrl and
   * githubRepo unset for these: a link would 404 for visitors anyway, and
   * either field would put the private repo's name on a public page.
   */
  privateSource?: boolean;
  /**
   * Repo name under the GitHub account. When set, the card pulls its stack and
   * tagline live from GitHub, so pushing code updates the site on its own.
   */
  githubRepo?: string;
  /** Screenshots shown as a slider on the card. */
  screenshots?: Screenshot[];
}

// Add a new object to this array to feature a project. Nothing else needs to change —
// the homepage reads this list directly. Order here is display order.
export const projects: Project[] = [
  {
    slug: "the-forever-note",
    name: "The Forever Note",
    tagline:
      "A full e-commerce platform for personalized digital gift pages, paired with a physical NFC/QR card delivered by post",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase (Postgres)",
      "Vercel",
      "PayFast",
    ],
    problem:
      "Turning a personalized digital gift page into something physical — an NFC/QR card delivered by post — means owning the whole chain: building the page, taking payment, fulfilling the order, and producing print-ready card artwork.",
    approach:
      "Built end-to-end on Next.js (App Router) and TypeScript: a template-driven gift builder across 8+ occasion categories, tiered pricing with PayFast payment integration including signature-verified webhook confirmation, an admin dashboard for order fulfillment, buyer self-service editing, and a moderated reviews system.",
    outcome:
      "A print pipeline generates exact-spec CR80 bank-card artwork per order — SVG composition, embedded QR codes, and pre-shaped text outlines rasterized at 600 DPI — ready to hand straight to a printer. Deployed on Vercel with a protected preview environment and automated CI.",
    status: "pending",
    privateSource: true,
    // Ordered along the buying journey. Browser UI is cropped out of each.
    screenshots: [
      { src: "/screenshots/the-forever-note/home.png", caption: "Landing page" },
      { src: "/screenshots/the-forever-note/occasions.png", caption: "Eight occasion categories" },
      { src: "/screenshots/the-forever-note/love-templates.png", caption: "Template designs for each occasion" },
      { src: "/screenshots/the-forever-note/gift-builder.png", caption: "Gift builder with a live preview" },
      { src: "/screenshots/the-forever-note/cart.png", caption: "Cart with tiered pricing" },
    ],
  },
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
    screenshots: [
      { src: "/screenshots/spy-agency/home.png", caption: "Home terminal" },
      { src: "/screenshots/spy-agency/register.png", caption: "Registering an agent" },
      { src: "/screenshots/spy-agency/agent-roster.png", caption: "Classified agent roster" },
      { src: "/screenshots/spy-agency/agent-profile.png", caption: "Agent profile" },
      { src: "/screenshots/spy-agency/edit-credentials.png", caption: "Editing credentials" },
      { src: "/screenshots/spy-agency/mission-briefing.png", caption: "Mission briefing" },
    ],
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
    screenshots: [
      { src: "/screenshots/slip-management/main-page.png", caption: "Main dashboard with the daily summary" },
      { src: "/screenshots/slip-management/create-a-slip.png", caption: "Creating a slip" },
      { src: "/screenshots/slip-management/slip-history.png", caption: "Slip history" },
      { src: "/screenshots/slip-management/slip-tile-editor.png", caption: "Tile display editor" },
      { src: "/screenshots/slip-management/customize-slip-slip-design.png", caption: "Slip design customisation" },
      { src: "/screenshots/slip-management/customize-slip-field-setup.png", caption: "Configurable slip fields" },
      { src: "/screenshots/slip-management/lookup.png", caption: "Managing lookup lists" },
      { src: "/screenshots/slip-management/printer-settings.png", caption: "Named printer preferences" },
      { src: "/screenshots/slip-management/calibration-page.png", caption: "Print calibration" },
      { src: "/screenshots/slip-management/backup.png", caption: "Backups" },
      { src: "/screenshots/slip-management/backup-restore.png", caption: "Restoring from a backup" },
    ],
  },
  {
    slug: "koolstoof-delivery",
    name: "Koolstoof Delivery",
    // Tagline and stack are overridden live from GitHub — see githubRepo below.
    tagline:
      "A .NET Core MVC web app for a local restaurant's delivery service",
    stack: ["C#", ".NET 10", "ASP.NET Core MVC", "EF Core"],
    problem:
      "Koolstoof, a restaurant in Thabazimbi, needed online ordering built around how they actually work — their own menu and specials, their delivery suburbs, and somewhere for staff to run orders through without a second system.",
    approach:
      "An ASP.NET Core MVC application on .NET 10, with Entity Framework Core over SQL Server and ASP.NET Core Identity for staff accounts, containerised with Docker. Customers browse a categorised menu with live specials, build a cart, and check out by PayFast or cash on delivery; admin pages cover the menu, specials, settings and orders.",
    outcome:
      "Live and taking orders. Staff move each one across a four-stage board — Incoming, Received, Out for Delivery, Delivered — with payment state on every card, delivery split by suburb, and drinks that can be flagged sit-down only so they never reach a delivery cart.",
    demoUrl: "https://koolstoof.vercel.app",
    repoUrl: "https://github.com/JohnHerbst66/MVC-Koolstoof-Delivery-Web-App",
    githubRepo: "MVC-Koolstoof-Delivery-Web-App",
    status: "live",
    // Padded to a single ratio so the strip does not go ragged; the phone shot
    // is portrait and the cart shot is very wide.
    screenshots: [
      { src: "/screenshots/koolstoof/home.webp", caption: "Home page" },
      { src: "/screenshots/koolstoof/menu.webp", caption: "Menu with categories and live specials" },
      { src: "/screenshots/koolstoof/cart.webp", caption: "Cart" },
      { src: "/screenshots/koolstoof/admin-orders.webp", caption: "Admin order board" },
      { src: "/screenshots/koolstoof/mobile.webp", caption: "Mobile layout" },
    ],
  },
];
