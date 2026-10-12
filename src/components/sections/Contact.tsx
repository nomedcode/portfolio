import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { Download } from "lucide-react";
import { profile } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

const socialLogos = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
};

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
            className="text-4xl font-semibold tracking-tight md:text-6xl"
            style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
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
            className="press inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-medium text-white"
          >
            <SiGmail className="h-5 w-5" aria-hidden /> Email me
          </a>
          <a
            href="/faiq-prasetya-cv.pdf"
            download
            className="press inline-flex items-center gap-2 rounded-full border border-accent px-6 py-4 font-medium text-accent hover:bg-accent/10 dark:border-accent-dark dark:text-accent-dark dark:hover:bg-accent-dark/10"
          >
            <Download className="h-5 w-5" aria-hidden /> Download CV
          </a>
          {profile.socials.map((s) => {
            const Logo = socialLogos[s.label as keyof typeof socialLogos];
            return (
              <a
                key={s.label}
                href={s.url}
                className="press inline-flex items-center gap-2 rounded-full border border-line px-6 py-4 font-medium text-fg hover:bg-line/60"
              >
                {Logo && <Logo className="h-5 w-5" aria-hidden />}
                {s.label}
              </a>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
