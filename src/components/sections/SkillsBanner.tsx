"use client";

import { AnimatePresence, m, type Variants } from "framer-motion";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import { featuredSkillIcons, skillCategories } from "@/lib/content";
import { motionTransition } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SkillMark } from "@/components/ui/SkillMark";
import { Reveal } from "@/components/ui/Reveal";

// One import() site feeds both the dynamic component and the warm-up. Two separate import() calls become two
// separate chunks, so the warm-up would fetch a copy the click never uses.
const loadDialog = () =>
  import("@/components/ui/TechStackDialog").then((m) => m.TechStackDialog);
const TechStackDialog = dynamic(loadDialog);

// Fetch the dialog chunk before the click: on hover, focus, press and once the icon cloud scrolls into view.
function warmDialog() {
  void loadDialog();
}

const cloudVariants = (reduce: boolean): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: reduce ? 0 : 0.035 } },
});

const logoVariants = (reduce: boolean): Variants => ({
  hidden: { opacity: 0, scale: 0 },
  show: {
    opacity: 1,
    scale: 1,
    transition: motionTransition(reduce, {
      type: "spring",
      bounce: 0,
      duration: 0.4,
    }),
  },
});

export function SkillsBanner() {
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const reduce = useReducedMotion();
  const cloud = useMemo(() => cloudVariants(reduce), [reduce]);
  const logo = useMemo(() => logoVariants(reduce), [reduce]);
  // A fixed order, the same on the server and after hydration: the three main cloud skills first, then every other
  // skill once, in content order. Nothing reshuffles between loads or opens.
  const order = useMemo(() => {
    const seen = new Set<string>(featuredSkillIcons);
    const list: string[] = [...featuredSkillIcons];
    for (const cat of skillCategories) {
      for (const s of cat.skills) {
        if (!seen.has(s.icon)) {
          seen.add(s.icon);
          list.push(s.icon);
        }
      }
    }
    return list;
  }, []);

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
              <m.ul
                variants={cloud}
                initial="hidden"
                whileInView="show"
                onViewportEnter={warmDialog}
                viewport={{ once: true, margin: "-15%" }}
                aria-hidden="true"
                data-preview-list
                className="flex flex-1 flex-wrap content-center items-center justify-start gap-3 md:justify-end"
              >
                {order.map((id) => (
                  <m.li
                    key={id}
                    variants={logo}
                    data-preview-logo
                    data-skill={id}
                    className="flex h-7 w-7 items-center justify-center"
                  >
                    <SkillMark id={id} className="h-7 w-7" />
                  </m.li>
                ))}
              </m.ul>
            </div>
            <button
              type="button"
              aria-label="View all skills"
              aria-haspopup="dialog"
              onPointerEnter={warmDialog}
              onFocus={warmDialog}
              onPointerDown={warmDialog}
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setOpen(true);
              }}
              className="absolute inset-0 rounded-card focus-visible:outline-2 focus-visible:-outline-offset-4"
            />
          </div>
        </Reveal>
      </div>
      <AnimatePresence>
        {open && (
          <TechStackDialog
            onClose={() => setOpen(false)}
            returnFocusRef={openerRef}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
