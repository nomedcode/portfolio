import { Reveal } from "@/components/ui/Reveal";
import { SkillsDialogTrigger } from "./SkillsDialogTrigger";
import { SkillsPreview } from "./SkillsPreview";

// Server component: the section shell, heading and the 47 marks are all static. Only the dialog trigger is client.
export function SkillsBanner() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="scroll-mt-24 bg-raised py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div
            data-banner-card
            className="press press-lift relative rounded-card border border-line bg-page p-8 motion-safe:hover:-translate-y-1 md:p-12"
          >
            <div className="pointer-events-none flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-16">
              <div className="shrink-0">
                <h2
                  id="skills-heading"
                  className="text-4xl font-semibold tracking-heading text-fg md:text-5xl"
                >
                  Skills
                </h2>
                <p className="mt-3 text-sm text-muted">
                  View all skills
                </p>
              </div>
              <SkillsPreview />
            </div>
            <SkillsDialogTrigger />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
