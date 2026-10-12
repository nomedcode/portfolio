"use client";

import { domAnimation, LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

// Import from "framer-motion", not "motion/react": its wrapper keeps the full `motion` runtime in the bundle (+46 KB raw).
// strict: a stray `motion.*` use throws instead of silently re-bundling it.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
