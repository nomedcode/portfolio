import { profile, sections } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-raised py-12 text-sm text-muted">
      <div
        data-footer-row
        className="mx-auto grid max-w-6xl justify-items-center gap-6 px-6 text-center xl:grid-cols-[1fr_auto_1fr] xl:items-center xl:justify-items-start xl:text-left"
      >
        <p>
          Designed &amp; built by {profile.fullName}
          <span className="whitespace-nowrap"> · © {year}</span>
        </p>
        <nav
          aria-label="Footer"
          className="dot-separated dot-separated-nav flex flex-wrap justify-center gap-y-2 whitespace-nowrap max-sm:grid max-sm:grid-cols-2 xl:justify-self-center"
        >
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="press hit-area hover:text-fg">
              {s.label}
            </a>
          ))}
        </nav>
        <div data-footer-socials className="dot-separated flex flex-wrap justify-center gap-y-2 whitespace-nowrap xl:justify-self-end">
          {profile.socials.map((s) => (
            <a key={s.label} href={s.url} className="press hit-area hover:text-fg">
              {s.label}
            </a>
          ))}
          <a
            href="/CV-ATS.pdf"
            download
            className="press hit-area font-medium text-fg hover:text-accent dark:hover:text-accent-dark"
          >
            Download CV
          </a>
        </div>
      </div>
    </footer>
  );
}
