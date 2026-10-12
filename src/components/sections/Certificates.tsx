import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { credlyBadge } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Certificates() {
  return (
    <section
      id="certificates"
      aria-labelledby="certificates-heading"
      className="scroll-mt-24 bg-page py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading id="certificates-heading" title="Certificates" />
        <Reveal className="flex justify-center">
          <a
            href={credlyBadge.url}
            target="_blank"
            rel="noreferrer"
            className="press group flex w-full max-w-3xl flex-col items-center gap-8 rounded-card-sm border border-line bg-raised p-8 text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:flex-row sm:text-left md:p-10"
          >
            <Image
              src={credlyBadge.image}
              alt={credlyBadge.name}
              width={320}
              height={320}
              className="h-32 w-32 shrink-0 sm:h-40 sm:w-40"
            />
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <h3 className="text-xl font-semibold tracking-title text-fg md:text-2xl">
                {credlyBadge.name}
              </h3>
              <ul className="mt-1 flex flex-wrap justify-center gap-2 sm:justify-start">
                {credlyBadge.skills.map((s) => (
                  <li
                    key={s}
                    className="rounded-full bg-page px-3 py-1 text-xs text-muted"
                  >
                    {s}
                  </li>
                ))}
              </ul>
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:underline dark:text-accent-dark">
                View Credential
                <ExternalLink className="h-4 w-4" aria-hidden />
                <span className="sr-only">(opens in new tab)</span>
              </span>
            </div>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
