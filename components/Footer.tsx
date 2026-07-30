export default function Footer() {
  return (
    <footer
      id="contact"
      className="px-6 md:px-12 py-16 max-w-6xl mx-auto border-t border-panelline"
    >
      <h2 className="font-mono text-sm tracking-wider text-blueprint mb-4">
        // CONTACT
      </h2>
      <p className="font-body text-muted max-w-md mb-6">
        Open to full-stack roles and collaborations. Reach out directly.
      </p>
      <div className="flex flex-wrap gap-6 font-mono text-sm">
        <a
          href="mailto:Herbstjohn5@gmail.com"
          className="text-paper hover:text-blueprint transition-colors"
        >
          email →
        </a>
        <a
          href="https://github.com/JohnHerbst66"
          target="_blank"
          rel="noopener noreferrer"
          className="text-paper hover:text-blueprint transition-colors"
        >
          github →
        </a>
        <a
          href="https://wa.me/27604944665"
          target="_blank"
          rel="noopener noreferrer"
          className="text-paper hover:text-blueprint transition-colors"
        >
          whatsapp →
        </a>
        <a
          href="https://www.linkedin.com/in/john-herbst-66471b2bb"
          target="_blank"
          rel="noopener noreferrer"
          className="text-paper hover:text-blueprint transition-colors"
        >
          linkedin →
        </a>
        <a
          href="/admin"
          className="text-paper hover:text-blueprint transition-colors"
        >
          portfolio →
        </a>
      </div>
      <p className="font-mono text-xs text-muted mt-12">
        built with next.js · updated automatically from github
      </p>
    </footer>
  );
}
