"use client";

import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// One import() site feeds both the dynamic component and the warm-up. Two separate import() calls become two
// separate chunks, so the warm-up would fetch a copy the click never uses.
const loadDialog = () =>
  import("@/components/ui/TechStackDialog").then((m) => m.TechStackDialog);
const TechStackDialog = dynamic(loadDialog);

// Fetch the dialog chunk before the click: on hover, focus, press and once the card scrolls into view.
function warmDialog() {
  void loadDialog();
}

export function SkillsDialogTrigger() {
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  // The button covers the card, so its viewport entry is the card's.
  useEffect(() => {
    const el = openerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          warmDialog();
          observer.disconnect();
        }
      },
      { rootMargin: "-15% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <button
        ref={openerRef}
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
      <AnimatePresence>
        {open && (
          <TechStackDialog
            onClose={() => setOpen(false)}
            returnFocusRef={openerRef}
          />
        )}
      </AnimatePresence>
    </>
  );
}
