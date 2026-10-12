"use client";

import { m, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useRef, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/ui/Reveal";

const EDGE = 4;
const GAP = 16;
const FALLBACK_STEP = 356;

// Placeholder islands until real projects land; replace with entries in content.ts then.
const islands = [
  "linear-gradient(160deg, #1a1a2e 0%, #0f3460 100%)",
  "linear-gradient(160deg, #0f0f23 0%, #533483 100%)",
  "linear-gradient(160deg, #13232a 0%, #264653 100%)",
  "linear-gradient(160deg, #2b2b2b 0%, #414345 100%)",
  "linear-gradient(160deg, #0d1f1a 0%, #1b4332 100%)",
];

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function Projects() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const subscribe = useCallback((callback: () => void) => {
    const el = scrollerRef.current;
    if (!el) return () => {};
    el.addEventListener("scroll", callback, { passive: true });
    window.addEventListener("resize", callback);
    return () => {
      el.removeEventListener("scroll", callback);
      window.removeEventListener("resize", callback);
    };
  }, []);

  // "<canPrev><canNext>" as 0/1 so the section re-renders only when an edge flips, not on every scroll event.
  const edges = useSyncExternalStore(
    subscribe,
    () => {
      const el = scrollerRef.current;
      if (!el) return "00";
      const prev = el.scrollLeft > EDGE;
      const next = el.scrollWidth - el.clientWidth - el.scrollLeft > EDGE;
      return `${prev ? 1 : 0}${next ? 1 : 0}`;
    },
    () => "00"
  );
  const canPrev = edges[0] === "1";
  const canNext = edges[1] === "1";

  const scrollGallery = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("li");
    const step = (first?.offsetWidth || FALLBACK_STEP) + GAP;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="scroll-mt-24 bg-page py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2
            id="projects-heading"
            className="text-center text-4xl font-semibold tracking-tight text-fg md:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Projects
          </h2>
        </Reveal>
      </div>

      {/* The scroller is focusable so keyboard users can arrow through it; the inset ring is not clipped by the viewport edge. */}
      <div
        ref={scrollerRef}
        data-gallery
        role="region"
        aria-label="Projects gallery"
        tabIndex={0}
        className="gallery-scroll mt-16 snap-x snap-mandatory overflow-x-auto scroll-px-[max(1.5rem,calc((100%_-_72rem)/2_+_1.5rem))] focus-visible:-outline-offset-2"
      >
        <m.ul
          role="list"
          aria-label="Upcoming projects"
          variants={listVariants}
          initial={reduce ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-15%" }}
          className="flex w-max gap-4 px-[max(1.5rem,calc((100%_-_72rem)/2_+_1.5rem))]"
        >
          {islands.map((gradient, i) => (
            <m.li
              key={gradient}
              data-gallery-card
              data-reveal
              variants={cardVariants}
              className="relative h-[440px] w-[78vw] shrink-0 snap-start overflow-hidden rounded-card ring-1 ring-inset ring-white/10 sm:w-[340px] md:h-[480px]"
              style={{ background: gradient }}
            >
              <p
                className="p-6 text-2xl font-semibold leading-tight text-white md:text-[28px]"
                style={{ letterSpacing: "-0.01em" }}
              >
                <span className="sr-only">Project {i + 1}: </span>
                Coming soon
              </p>
            </m.li>
          ))}
        </m.ul>
      </div>

      <div className="mx-auto mt-6 flex max-w-6xl justify-end gap-3 px-6">
        <button
          type="button"
          aria-label="Scroll projects left"
          disabled={!canPrev}
          onClick={() => scrollGallery(-1)}
          className="press hit-area rounded-full border border-line p-2 text-fg hover:bg-line/60 disabled:cursor-default disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Scroll projects right"
          disabled={!canNext}
          onClick={() => scrollGallery(1)}
          className="press hit-area rounded-full border border-line p-2 text-fg hover:bg-line/60 disabled:cursor-default disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </section>
  );
}
