"use client";

import { m, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { skillCategories } from "@/lib/content";
import { getSkillIcon, isDarkBrandColor } from "@/lib/skillIcons";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.02 } },
};

const chipVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export function TechStackDialog({
  onClose,
  returnFocusRef,
}: {
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLElement | null>;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const opener = returnFocusRef.current;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button, a[href]"
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, [onClose, returnFocusRef]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
      <m.div
        className="absolute inset-0 bg-black/50"
        initial={reduce ? undefined : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        exit={reduce ? undefined : { opacity: 0 }}
        transition={{ duration: 0.2 }}
        aria-hidden
        onClick={onClose}
      />
      <m.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="techstack-heading"
        className="relative flex max-h-[85dvh] w-full max-w-3xl flex-col overflow-hidden rounded-card border border-line bg-page"
        initial={reduce ? undefined : { opacity: 0, scale: 0.95, y: 12 }}
        animate={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      >
        <div className="flex items-center justify-between border-b border-line p-6">
          <h2
            id="techstack-heading"
            className="text-2xl font-semibold tracking-tight text-fg"
            style={{ letterSpacing: "-0.02em" }}
          >
            Skills
          </h2>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="press hit-area rounded-full p-2 text-fg hover:bg-line/60"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {skillCategories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-card-sm border border-line bg-raised p-6"
              >
                <h3 className="mb-4 text-lg font-semibold tracking-tight text-fg">
                  {cat.name}
                </h3>
                <m.ul
                  variants={listVariants}
                  initial={reduce ? "show" : "hidden"}
                  animate="show"
                  aria-label={`${cat.name} skills`}
                  className="flex flex-wrap gap-2"
                >
                  {cat.skills.map((s) => {
                    const icon = getSkillIcon(s.icon);
                    return (
                      <m.li
                        key={s.name}
                        variants={chipVariants}
                        data-skill-chip
                        className="flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-sm"
                      >
                        {icon && (
                          <svg
                            viewBox="0 0 24 24"
                            aria-hidden
                            className={`h-4 w-4 ${
                              isDarkBrandColor(icon.hex) ? "dark:invert" : ""
                            }`}
                          >
                            <path d={icon.path} fill={`#${icon.hex}`} />
                          </svg>
                        )}
                        {s.name}
                      </m.li>
                    );
                  })}
                </m.ul>
              </div>
            ))}
          </div>
        </div>
      </m.div>
    </div>
  );
}
