"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { applyThemeColor } from "@/lib/themeChrome";

const FADE_MS = 250;

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.classList.contains("dark"),
    () => false
  );
  const reduce = useReducedMotion();
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      document.documentElement.classList.remove("theme-fade");
    },
    []
  );

  const toggle = () => {
    const root = document.documentElement;
    if (!reduce) {
      // The class turns on a short colour transition for everything; restarting the timer keeps a quick double
      // press from leaving it behind.
      root.classList.add("theme-fade");
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      fadeTimer.current = setTimeout(() => root.classList.remove("theme-fade"), FADE_MS);
    }
    root.classList.toggle("dark");
    // The browser bar follows the page, not the OS: without this a manual switch leaves it on the old surface.
    applyThemeColor(root);
    try {
      // Read the class back: the observer has not re-rendered yet, so `dark` is the pre-toggle value and a
      // quick double press would persist the opposite theme.
      window.localStorage.setItem(
        "theme",
        root.classList.contains("dark") ? "dark" : "light"
      );
    } catch {}
  };

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      aria-pressed={dark}
      onClick={toggle}
      className="press hit-area rounded-full p-2 text-fg hover:bg-line/60"
    >
      {dark ? (
        <Sun className="h-5 w-5" aria-hidden />
      ) : (
        <Moon className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
