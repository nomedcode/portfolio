import { useEffect, useState } from "react";

// A thin band just above the middle of the viewport. A section is "current" while it crosses this reading line,
// so a tall section does not stay current after its content has scrolled away, and a neighbour that merely peeks
// in at an edge does not steal it.
const READING_LINE = "-45% 0px -50% 0px";

/**
 * The id of the section under the reading line, or null (hero, gaps, before the first observer callback).
 * `ids` must be a stable reference (module constant or memoized): a new array re-creates the observer.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  // null on the server and on the first client render, so hydration markup never differs.
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const crossing = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) crossing.add(entry.target.id);
          else crossing.delete(entry.target.id);
        }
        // At a boundary two sections can touch the band at once; the one further down the page wins.
        setActive([...ids].reverse().find((id) => crossing.has(id)) ?? null);
      },
      { rootMargin: READING_LINE }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
