export default function Nav() {
  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-6 max-w-6xl mx-auto">
      <span className="font-display font-bold text-paper text-lg tracking-tight">
        JOHN HERBST
      </span>
      <nav className="flex gap-6 font-mono text-sm text-muted">
        <a href="#builds" className="hover:text-blueprint transition-colors">
          builds
        </a>
        <a href="#activity" className="hover:text-blueprint transition-colors">
          activity
        </a>
        <a href="#contact" className="hover:text-blueprint transition-colors">
          contact
        </a>
      </nav>
    </header>
  );
}
