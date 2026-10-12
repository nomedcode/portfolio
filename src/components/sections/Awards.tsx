import { Trophy } from "lucide-react";
import { awards } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Awards() {
  return (
    <section
      id="awards"
      aria-labelledby="awards-heading"
      className="scroll-mt-24 bg-raised py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading id="awards-heading" title="Awards" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-6">
          {awards.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.05} className="h-full">
              <article className="flex h-full flex-col gap-3 rounded-card-sm bg-page p-8 md:p-10">
                <Trophy className="h-6 w-6 text-accent dark:text-accent-dark" aria-hidden />
                <h3 className="text-lg font-semibold leading-snug tracking-title">
                  {a.title}
                </h3>
                <p className="text-sm text-subtle">
                  <span>{a.issuer}</span> · <span>{a.year}</span>
                </p>
                <p className="text-sm text-muted">{a.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
