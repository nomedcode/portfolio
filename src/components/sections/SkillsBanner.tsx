"use client";

import { AnimatePresence, m, type Variants } from "framer-motion";
import dynamic from "next/dynamic";
import { FaAws } from "react-icons/fa6";
import { VscAzure } from "react-icons/vsc";
import { useMemo, useRef, useState } from "react";
import { cloudSkills, skillCategories } from "@/lib/content";
import { getSkillIcon, isDarkBrandColor } from "@/lib/skillIcons";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Reveal } from "@/components/ui/Reveal";
const TechStackDialog = dynamic(() =>
  import("@/components/ui/TechStackDialog").then((m) => m.TechStackDialog)
);

const cloudVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.02 } },
};

const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", bounce: 0, duration: 0.4 },
  },
};

function TileIcon({ id, className }: { id: string; className?: string }) {
  if (id === "aws") {
    return <FaAws className={className} aria-hidden />;
  }
  if (id === "azure") {
    return <VscAzure className={className} aria-hidden />;
  }
  const icon = getSkillIcon(id);
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`${className} ${
        isDarkBrandColor(icon.hex) ? "dark:invert" : ""
      }`}
    >
      <path d={icon.path} fill={`#${icon.hex}`} />
    </svg>
  );
}

export function SkillsBanner() {
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const reduce = useReducedMotion();

  const previewIcons = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const c of cloudSkills) {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        list.push(c.id);
      }
    }
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
            className="press relative rounded-card border border-line bg-page p-8 transition-transform duration-200 motion-safe:hover:-translate-y-1 md:p-12"
          >
            <div className="pointer-events-none flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-16">
              <div className="shrink-0">
                <h2
                  id="skills-heading"
                  className="text-4xl font-semibold tracking-tight text-fg md:text-5xl"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Skills
                </h2>
                <p className="mt-3 text-sm text-muted">
                  Click to see all
                </p>
              </div>
              <m.ul
                variants={cloudVariants}
                initial={reduce ? "show" : "hidden"}
                whileInView="show"
                viewport={{ once: true, margin: "-15%" }}
                aria-hidden="true"
                data-preview-list
                className="flex flex-1 flex-wrap content-center items-center justify-start gap-3 md:justify-end"
              >
                {previewIcons.map((id) => (
                  <m.li
                    key={id}
                    variants={logoVariants}
                    data-preview-logo
                    className="flex h-7 w-7 items-center justify-center"
                  >
                    <TileIcon id={id} className="h-7 w-7" />
                  </m.li>
                ))}
              </m.ul>
            </div>
            <button
              type="button"
              aria-label="View all skills"
              aria-haspopup="dialog"
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setOpen(true);
              }}
              className="absolute inset-0 rounded-card focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent"
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
