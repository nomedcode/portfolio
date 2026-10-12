"use client";

import { m, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { skillCategories } from "@/lib/content";
import { getSkillIcon } from "@/lib/skillIcons";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BrandIcon } from "./BrandIcon";

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

  // Scale out of the Skills card instead of the screen centre, so the dialog reads as that card opening.
  // Scaling about the centre keeps the rect centre fixed, so measure from centres and offsetWidth/Height (not scaled).
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const opener = returnFocusRef.current;
    if (reduce || !dialog || !opener) return;
    const d = dialog.getBoundingClientRect();
    const o = opener.getBoundingClientRect();
    const w = dialog.offsetWidth || d.width;
    const h = dialog.offsetHeight || d.height;
    // A far-away card would fling the dialog; keep the origin within half a dialog of its box.
    const clamp = (v: number, size: number) =>
      Math.min(Math.max(v, -size / 2), size * 1.5);
    const x = o.left + o.width / 2 - (d.left + d.width / 2) + w / 2;
    const y = o.top + o.height / 2 - (d.top + d.height / 2) + h / 2;
    dialog.style.transformOrigin = `${clamp(x, w)}px ${clamp(y, h)}px`;
  }, [reduce, returnFocusRef]);
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
          "button, a[href], [tabindex='0']"
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
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
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        exit={
          reduce
            ? { opacity: 0, transition: { duration: 0.15 } }
            : {
                opacity: 0,
                scale: 0.85,
                transition: { duration: 0.2, ease: "easeIn" },
              }
        }
        transition={
          reduce
            ? { duration: 0.15 }
            : { type: "spring", bounce: 0, duration: 0.4 }
        }
      >
        <div className="flex items-center justify-between border-b border-line p-6">
          <h2
            id="techstack-heading"
            className="text-2xl font-semibold tracking-title text-fg"
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
        {/* ponytail: always a tab stop, even when the list fits; gate on an overflow check (ResizeObserver) if tall screens complain. */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Skills by category"
          className="overflow-y-auto overscroll-contain rounded-b-card p-6 focus-visible:-outline-offset-2"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {skillCategories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-card-sm border border-line bg-raised p-6"
              >
                <h3 className="mb-4 text-lg font-semibold leading-snug tracking-title text-fg">
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
                        {icon && <BrandIcon icon={icon} className="h-4 w-4" />}
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
