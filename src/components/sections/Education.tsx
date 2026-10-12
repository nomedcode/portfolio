import { GraduationCap } from "lucide-react";
import { education } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="scroll-mt-24 bg-page py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading id="education-heading" title="Education" />
        <Reveal>
          <dl className="divide-y divide-line rounded-card bg-raised">
            {education.map((e) => (
              <div
                key={e.id}
                className="grid gap-3 p-8 md:grid-cols-[200px_1fr] md:gap-12 md:p-12"
              >
                <dt className="text-sm font-semibold text-subtle">
                  {e.period}
                </dt>
                <dd className="flex flex-col gap-2">
                  <GraduationCap className="h-5 w-5 text-accent dark:text-accent-dark" aria-hidden />
                  <p className="text-lg font-semibold leading-snug tracking-title">
                    {e.degree}
                  </p>
                  <p className="text-muted">{e.school}</p>
                  {e.gpa && (
                    <p className="text-sm text-subtle">GPA {e.gpa}</p>
                  )}
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {e.coursework.map((c) => (
                      <li
                        key={c}
                        className="rounded-full bg-page px-3 py-1 text-xs text-muted"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
