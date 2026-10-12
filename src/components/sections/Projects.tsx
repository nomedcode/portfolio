import { Rocket } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="scroll-mt-24 bg-page py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="projects-heading"
          className="text-center text-4xl font-semibold tracking-tight text-fg md:text-5xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          Projects
        </h2>
        <Reveal className="mt-10 flex justify-center">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-card border border-line bg-raised px-8 py-16 text-center md:py-20">
            <div
              className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
              aria-hidden
            />
            <div className="relative flex flex-col items-center gap-4">
              <span className="rounded-full border border-line bg-page px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted">
                Work In Progress
              </span>
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white">
                <Rocket className="h-6 w-6" aria-hidden />
              </span>
              <h3
                className="text-3xl font-semibold tracking-tight text-fg md:text-4xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                Coming soon
              </h3>
              <p className="max-w-md text-sm text-muted md:text-base">
                I&apos;m building a few things in the cloud. I&apos;ll write
                them up here as they&apos;re ready.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
