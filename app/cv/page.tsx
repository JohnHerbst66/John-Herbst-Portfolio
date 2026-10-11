import type { Metadata } from "next";
import Link from "next/link";
import {
  contact,
  profile,
  skills,
  work,
  ownSite,
  education,
  languages,
  type CvEntry,
} from "@/content/cv";

export const metadata: Metadata = {
  title: "John Herbst — CV",
  description:
    "Curriculum vitae: software engineer, C#/.NET, TypeScript and Python.",
};

/**
 * Print-first. Dark-on-white rather than the site's dark theme, because this
 * page exists to become a PDF and to go through a printer; the site's ink
 * background would come out as a solid black page.
 *
 * Rendering it as a page rather than hand-maintaining a PDF keeps one source
 * of truth — the document regenerates from the same data the site uses.
 *
 * public/John-Herbst-CV.pdf is printed from this page. To refresh it, run the
 * site and print the route headlessly:
 *
 *   chrome --headless=new --no-pdf-header-footer  *     --print-to-pdf=public/John-Herbst-CV.pdf http://localhost:3000/cv
 */

function Entry({ entry }: { entry: CvEntry }) {
  return (
    <article className="cv-entry">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h3 className="font-semibold text-[11.5pt]">{entry.name}</h3>
        <span className="text-[8.5pt] text-neutral-500">{entry.context}</span>
      </div>
      <p className="text-[8.5pt] text-neutral-600 italic mt-0.5">
        {entry.stack}
        {entry.url && <> · {entry.url.replace(/^https?:\/\//, "")}</>}
      </p>
      <ul className="mt-1.5 space-y-1 text-[9.5pt] leading-snug">
        {entry.bullets.map((b) => (
          <li key={b} className="pl-3.5 -indent-3.5">
            — {b}
          </li>
        ))}
      </ul>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cv-section">
      <h2 className="text-[9pt] font-semibold tracking-[0.14em] uppercase text-neutral-500 border-b border-neutral-300 pb-1 mb-2.5">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function CvPage() {
  return (
    <div className="cv-root bg-white text-neutral-900">
      {/* Screen-only bar: on paper the reader already has the document. */}
      <div className="cv-bar">
        <Link href="/" className="hover:underline">
          ← back to the site
        </Link>
        <a
          href="/John-Herbst-CV.pdf"
          download
          className="font-medium text-neutral-800 hover:underline"
        >
          Download PDF ↓
        </a>
      </div>

      <main className="cv-page font-body">
        <header className="mb-4">
          <h1 className="font-display text-[23pt] font-bold leading-none">
            {contact.name}
          </h1>
          <p className="text-[11pt] text-neutral-700 mt-1">{contact.title}</p>
          <p className="text-[9pt] text-neutral-600 mt-2 leading-relaxed">
            {contact.location} · {contact.availability}
            <br />
            {contact.email} · {contact.phone}
            <br />
            {contact.github} · {contact.linkedin} · {contact.site}
          </p>
        </header>

        <Section title="Profile">
          <p className="text-[9.5pt] leading-snug">{profile}</p>
        </Section>

        <Section title="Technical skills">
          <dl className="text-[9.5pt] leading-snug space-y-0.5">
            {skills.map((s) => (
              <div key={s.group} className="flex gap-2">
                <dt className="w-[108px] shrink-0 font-medium">{s.group}</dt>
                <dd className="flex-1">{s.items}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Selected work">
          <div className="space-y-3.5">
            {work.map((e) => (
              <Entry key={e.name} entry={e} />
            ))}
            <Entry entry={ownSite} />
          </div>
        </Section>

        <Section title="Education">
          <h3 className="font-semibold text-[11.5pt]">{education.title}</h3>
          <p className="text-[9pt] text-neutral-600">
            {education.detail} · {education.institution}
          </p>
          <p className="text-[9.5pt] mt-1 leading-snug">{education.note}</p>
          <p className="text-[8.5pt] text-neutral-600 mt-1 leading-snug">
            {education.modules}
          </p>
        </Section>

        <Section title="Additional">
          <p className="text-[9.5pt] leading-snug">
            Languages: {languages}
            <br />
            References available on request.
          </p>
        </Section>
      </main>
    </div>
  );
}
