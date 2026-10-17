import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Download } from "lucide-react";
import type { CSSProperties } from "react";
import { iconFills } from "@/lib/iconColor";
import { profile } from "@/lib/content";
import { GmailLogo } from "@/components/ui/GmailLogo";
import { Reveal } from "@/components/ui/Reveal";

// Brand colours as simple-icons style hex. iconFills moves one only as far as 3:1 on the surface needs, so
// GitHub's near-black becomes the page text colour in dark and LinkedIn blue lightens a little there.
const socialLogos = {
  GitHub: { Logo: FaGithub, hex: "181717" },
  LinkedIn: { Logo: FaLinkedin, hex: "0a66c2" },
};

// The react-icons paint with currentColor, so the colour is set as text colour from two theme variables.
function brandVars(hex: string): CSSProperties {
  const fills = iconFills(hex);
  return { "--icon-l": fills.light, "--icon-d": fills.dark } as CSSProperties;
}

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 bg-raised py-28 text-center md:py-40"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-6">
        <Reveal>
          <h2
            id="contact-heading"
            className="text-4xl font-semibold leading-[1.05] tracking-display md:text-6xl"
          >
            Let&apos;s build something.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg text-muted">
            Available for internships, freelance work, and small projects.
          </p>
          <p className="mt-2 text-sm text-subtle">{profile.location}</p>
        </Reveal>
        <Reveal
          delay={0.2}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={`mailto:${profile.email}`}
            className="press inline-flex items-center gap-3 rounded-full bg-accent py-3 pl-3 pr-7 font-medium text-white"
          >
            {/* The mark is meant for a light ground: its red and blue parts fall to about 1.6:1 on the blue button and reach 3.5:1 on white. */}
            <span
              data-gmail-badge
              aria-hidden="true"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white"
            >
              <GmailLogo className="h-4 w-5" />
            </span>
            Email me
          </a>
          <a
            href="/CV-ATS.pdf"
            download
            className="press inline-flex items-center gap-2 rounded-full border border-accent px-6 py-4 font-medium text-accent hover:bg-accent/10 dark:border-accent-dark dark:text-accent-dark dark:hover:bg-accent-dark/10"
          >
            <Download className="h-5 w-5" aria-hidden /> Download CV
          </a>
          {profile.socials.map((s) => {
            const brand = socialLogos[s.label as keyof typeof socialLogos];
            return (
              <a
                key={s.label}
                href={s.url}
                className="press inline-flex items-center gap-2 rounded-full border border-subtle px-6 py-4 font-medium text-fg hover:bg-line/60"
              >
                {brand && (
                  <brand.Logo
                    className="h-5 w-5 text-(color:--icon-l) dark:text-(color:--icon-d)"
                    style={brandVars(brand.hex)}
                    aria-hidden
                  />
                )}
                {s.label}
              </a>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
