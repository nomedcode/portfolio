"use client";

import { domAnimation, LazyMotion } from "motion/react";
import type { ReactNode } from "react";

// Import `m` from "motion/react-m", not "motion/react": that entry keeps the lazy-loaded runtime instead of
// pulling the full one into the bundle (+46 KB raw).
// strict: a stray `motion.*` use throws instead of silently re-bundling it.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
