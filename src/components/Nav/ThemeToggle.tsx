"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

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

  const toggle = () => {
    document.documentElement.classList.toggle("dark");
    try {
      window.localStorage.setItem("theme", dark ? "light" : "dark");
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
