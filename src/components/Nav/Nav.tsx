"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { profile, sections } from "@/lib/content";
import { ThemeToggle } from "./ThemeToggle";

const sectionIds = sections.map((s) => s.id);

export function Nav() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sectionIds);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    // A press anywhere outside the header closes the menu; focus stays where the user put it.
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="glass-header fixed inset-x-0 top-0 z-50"
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6 md:grid md:grid-cols-[1fr_auto_1fr]"
      >
        <a
          href="#top"
          className="press hit-area text-sm font-semibold text-fg md:justify-self-start"
        >
          {profile.name}
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "location" : undefined}
              className="press hit-area rounded-full px-3 py-1.5 text-xs font-medium text-fg hover:bg-line/60"
            >
              {s.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-1 md:justify-self-end">
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className="press hit-area rounded-full p-2 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls={open ? "mobile-menu" : undefined}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? (
              <X className="h-5 w-5 text-fg" aria-hidden />
            ) : (
              <Menu className="h-5 w-5 text-fg" aria-hidden />
            )}
          </button>
        </div>
      </nav>
      {open && (
        <div
          id="mobile-menu"
          className="menu-in max-h-[calc(100dvh-3.25rem)] overflow-y-auto overscroll-contain border-t border-line bg-page px-6 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-3">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={active === s.id ? "location" : undefined}
                  className="press hit-area w-full justify-start text-sm font-medium text-fg"
                  onClick={() => setOpen(false)}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
