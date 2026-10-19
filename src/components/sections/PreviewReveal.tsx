"use client";

import { useEffect, useRef, useState } from "react";

// Adds the in-view class that starts the CSS stagger. The logos themselves are rendered on the server, so the
// 47 icon paths stay out of the client bundle; this wrapper only owns the trigger.
export function PreviewReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-15% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <ul
      ref={listRef}
      aria-hidden="true"
      data-preview-list
      className={`${shown ? "preview-in " : ""}flex flex-1 flex-wrap content-center items-center justify-start gap-3 md:justify-end`}
    >
      {children}
    </ul>
  );
}
