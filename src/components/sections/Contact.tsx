import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { Download } from "lucide-react";
import type { CSSProperties } from "react";
import { iconFills } from "@/lib/iconColor";
import { profile } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

// Brand colours as simple-icons style hex. iconFills moves one only as far as 3:1 on the surface needs, so
// GitHub's near-black becomes the page text colour in dark and LinkedIn blue lightens a little there.
const GMAIL_HEX = "ea4335";
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
            Open to internships, freelance, and project collaborations.
          </p>
        </Reveal>
        <Reveal
          delay={0.2}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={`mailto:${profile.email}`}
            className="press inline-flex items-center gap-2 rounded-full bg-accent py-4 pl-3.5 pr-8 font-medium text-white"
          >
            {/* Gmail red would sink into the blue, so the colour logo sits on a white badge (the -my-1 keeps the button as tall as its neighbours). */}
            <span className="-my-1 grid h-7 w-7 place-items-center rounded-full bg-white">
              <SiGmail
                className="h-4 w-4 text-(color:--icon-l)"
                style={brandVars(GMAIL_HEX)}
                aria-hidden
              />
            </span>
            Email me
          </a>
          <a
            href="/faiq-prasetya-cv.pdf"
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
