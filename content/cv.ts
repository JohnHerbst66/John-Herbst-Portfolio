import { projects, type Project } from "./projects";

/**
 * The CV's own content.
 *
 * Anything a project already states — its name, stack, live URL, whether it
 * was client work — is read from projects.ts rather than retyped, so renaming
 * a project or moving its URL cannot leave the CV quietly wrong. Only the
 * bullets live here, because a CV says different things about a build than a
 * portfolio card does.
 */

export const contact = {
  name: "John Herbst",
  title: "Software Engineer",
  location: "Thabazimbi, Limpopo",
  availability: "Remote or relocating · One month's notice",
  email: "herbstjohn5@gmail.com",
  phone: "060 494 4665",
  github: "github.com/JohnHerbst66",
  linkedin: "linkedin.com/in/john-herbst-66471b2bb",
  site: "portfolio-john-1cbd.vercel.app",
};

export const profile =
  "Software engineer working across C#/.NET, TypeScript and Python. While qualifying " +
  "through the QCTO Occupational Certificate: Software Engineer, I built and shipped " +
  "software for three local businesses — an ordering site now live for a takeaway, a " +
  "delivery platform for a restaurant, and a slip system a company runs every day. " +
  "Comfortable owning a build end to end: schema, backend, interface and deployment.";

export const skills: { group: string; items: string }[] = [
  { group: "Languages", items: "C#, TypeScript, Python, SQL, JavaScript" },
  {
    group: "Frameworks",
    items:
      "ASP.NET Core MVC, .NET, WinForms, Next.js (App Router), React, Flask",
  },
  {
    group: "Data",
    items: "SQL Server, PostgreSQL (Supabase), SQLite, Entity Framework Core",
  },
  {
    group: "Platforms & tools",
    items: "Git, GitHub, Docker, Vercel, Render, Vercel Blob",
  },
  {
    group: "Also",
    items:
      "REST APIs, JWT authentication, payment integration (PayFast), responsive UI, Tailwind CSS",
  },
];

/** CV bullets, keyed by the slug in projects.ts. */
const bullets: Record<string, string[]> = {
  "die-bestemming": [
    "Built with no database: all content is a single versioned JSON document in blob storage, which keeps running costs near zero for a small business.",
    "Customers build a basket on their phone that becomes a pre-filled WhatsApp order with itemised prices and a total — no accounts, no payment gateway.",
    "A phone-first Afrikaans admin lets the owners change the day's menu, car wash prices and opening hours themselves in under a minute; photos are resized in the browser before upload.",
    "Ordering opens and closes on its own against South African time.",
  ],
  "koolstoof-delivery": [
    "Categorised menu with live specials, a cart, and checkout by PayFast or cash on delivery.",
    "Staff move each order across a four-stage board — Incoming, Received, Out for Delivery, Delivered — with payment state on every card and delivery split by suburb.",
    "ASP.NET Core Identity for staff accounts, Entity Framework Core over SQL Server, containerised with Docker.",
  ],
  "slip-management": [
    "Configurable slip fields, company branding and named printer preferences, for a workflow no off-the-shelf tool matched.",
    "Added truck registration enforcement and reworked the print flow in response to real daily use.",
    "Covers print calibration, lookup list management, and backup and restore.",
  ],
  "the-forever-note": [
    "Template-driven gift builder across eight occasion categories with tiered pricing.",
    "PayFast integration with signature-verified webhook confirmation, an admin dashboard for fulfilment, buyer self-service editing and a moderated reviews system.",
    "A print pipeline generates exact-spec CR80 card artwork per order — SVG composition, embedded QR codes and pre-shaped text outlines rasterised at 600 DPI, ready to hand to a printer.",
  ],
  "spy-agency-app": [
    "Flask backend with a SQLite data layer and a login flow; my first project with a real backend, database and deployment pipeline.",
  ],
};

export interface CvEntry {
  name: string;
  context: string;
  stack: string;
  bullets: string[];
  url?: string;
}

const contextFor = (p: Project) => {
  const who = p.clientWork ? "Client project" : "Personal project";
  const state = {
    live: "live",
    "daily-use": "in daily use",
    deployed: "deployed",
    building: "in development",
  }[p.status];
  return `${who} · ${state}`;
};

/** Strongest first — paid, in-service work ahead of personal projects. */
const order = [
  "die-bestemming",
  "koolstoof-delivery",
  "slip-management",
  "the-forever-note",
  "spy-agency-app",
];

export const work: CvEntry[] = order.map((slug) => {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`cv.ts refers to a project that no longer exists: ${slug}`);
  return {
    name: p.name,
    context: contextFor(p),
    stack: p.stack.join(", "),
    bullets: bullets[slug] ?? [],
    url: p.demoUrl,
  };
});

/** This site. Not in projects.ts, because a portfolio does not feature itself. */
export const ownSite: CvEntry = {
  name: "Portfolio & document library",
  context: "Personal project · live",
  stack: "Next.js, TypeScript, Tailwind CSS, Vercel Blob",
  bullets: [
    "Hand-rolled HS256 JWT session auth and scrypt password hashing on node crypto, with timing-safe comparison and no authentication dependency.",
    "Authenticated admin over Vercel Blob: upload, rename, delete, named folders and manual ordering.",
    "Project cards read their description and language breakdown live from the GitHub API, so pushing code updates the site.",
  ],
  url: contact.site,
};

export const education = {
  title: "Occupational Certificate: Software Engineer",
  detail: "NQF 6 · 240 credits · SAQA ID 119458",
  institution: "Academic Institute of Excellence (AIE)",
  // Accurate as of the interim Statement of Results: still in progress, with
  // every module assessed so far returned Competent. No marks are reproduced
  // here — the statement records two figures per module and nothing on it says
  // which is the one that counts.
  note: "In progress — all nine knowledge and practical modules assessed Competent to date.",
  modules:
    "Software Engineering · Programming · Database Design and Information Systems · " +
    "Project Management · Digital and Business Mathematics · Document System Design · " +
    "Design and Manipulate Databases · Program and Deploy Applications · Test and Debug Source Code",
};

export const languages = "Afrikaans and English";
