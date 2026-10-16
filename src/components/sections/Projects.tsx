"use client";

import { m, type Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motionTransition } from "@/lib/motion";
import { Reveal } from "@/components/ui/Reveal";

const EDGE = 4;
const GAP = 16;
const FALLBACK_STEP = 356;

// Placeholder islands until real projects land; replace with entries in content.ts then.
const islands = ["bg-island-1", "bg-island-2", "bg-island-3", "bg-island-4", "bg-island-5"];

const listVariants = (reduce: boolean): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: reduce ? 0 : 0.15 } },
});

// The rise stays inside 32px of scroller padding (pb-8/-mb-8 below), so the card never crosses the clip edge.
// Apple's entrance recipe: the rise (0.7s) lands before the fade (0.9s) completes, so cards settle as they appear.
const cardVariants = (reduce: boolean): Variants => ({
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: motionTransition(reduce, {
      y: { duration: 0.7, ease: "easeOut" },
      opacity: { duration: 0.9, ease: "easeOut" },
    }),
  },
});

export function Projects() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const list = useMemo(() => listVariants(reduce), [reduce]);
  const card = useMemo(() => cardVariants(reduce), [reduce]);

  const subscribe = useCallback((callback: () => void) => {
    const el = scrollerRef.current;
    if (!el) return () => {};
    el.addEventListener("scroll", callback, { passive: true });
    window.addEventListener("resize", callback);
    // Measure once on mount: the snapshot is "00" until an event fires, so without this the right arrow reads
    // disabled on first paint even when the gallery overflows.
    callback();
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
            className="text-center text-4xl font-semibold tracking-heading text-fg md:text-5xl"
          >
            Projects
          </h2>
        </Reveal>
      </div>

      {/* The scroller is focusable so keyboard users can arrow through it; the inset ring is not clipped by the viewport edge. */}
      {/* overflow-y-hidden matters: overflow-x:auto alone computes overflow-y to auto, and the card reveal's 24px
          translate overflows the box, so the gallery would briefly scroll vertically and swallow the page wheel. */}
      <div
        ref={scrollerRef}
        data-gallery
        role="region"
        aria-label="Projects gallery"
        tabIndex={0}
        className="gallery-scroll -mb-8 mt-16 snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-px-[max(1.5rem,calc((100%_-_72rem)/2_+_1.5rem))] pb-8 focus-visible:-outline-offset-2"
      >
        <m.ul
          role="list"
          aria-label="Upcoming projects"
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-15%" }}
          className="flex w-max gap-4 px-[max(1.5rem,calc((100%_-_72rem)/2_+_1.5rem))]"
        >
          {islands.map((island, i) => (
            // The li owns the snap geometry and never moves; the entrance transform runs on the inner card, so
            // scroll-snap has a stable target and never re-fires mid-animation (which also flickered the arrows).
            <li
              key={island}
              data-gallery-card
              data-reveal
              className="h-[440px] w-[78vw] shrink-0 snap-start sm:w-[340px] md:h-[480px]"
            >
              <m.div
                variants={card}
                className={`relative h-full w-full overflow-hidden rounded-card ring-1 ring-inset ring-white/10 ${island}`}
              >
                <p className="p-6 text-2xl font-semibold leading-tight tracking-title text-white md:text-title-lg">
                  <span className="sr-only">Project {i + 1}: </span>
                  Coming soon
                </p>
              </m.div>
            </li>
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
