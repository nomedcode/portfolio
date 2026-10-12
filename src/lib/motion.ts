import type { Transition } from "framer-motion";

const REDUCED_FADE_S = 0.2;

// Reduced motion keeps every start and end value identical to normal motion and changes only the transition.
// The first paint comes from server HTML rendered with reduce=false and `initial` is not re-read after mount,
// so swapping initial/target per preference would strand hydrated users at an offset. Opacity fades quickly,
// everything else lands at once, and entrance delays are dropped so a page settles inside one fade.
export function motionTransition(reduce: boolean, full: Transition): Transition {
  if (!reduce) return full;
  return {
    default: { duration: 0 },
    opacity: { duration: REDUCED_FADE_S, ease: "easeOut" },
  };
}
