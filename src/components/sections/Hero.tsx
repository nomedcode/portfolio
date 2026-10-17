"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// The role line rotates forever. It stops while the pointer is over the hero, while keyboard focus is inside it, while
// the hero is scrolled out of view, and while the tab is hidden. WCAG 2.2.2 (Level A) is still open by owner choice:
// there is no explicit pause control, so a user who cannot hover or focus cannot stop it. Upgrade path: a visible
// pause/play button, or stop after one pass.
const ROLE_HOLD_MS = 2600;
const ROLE_EXIT_MS = 400;
const ROLE_ENTER_S = 0.6;
const ROLE_FADE_S = 0.2;
// Roles roll vertically like a ticker: the old one leaves upward, the next one arrives from below.
const ROLE_SLIDE_PX = 24;
const ROLE_EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const [step, setStep] = useState(0);
  const [isRoleExiting, setIsRoleExiting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const count = profile.roles.length;
  const activeRole = profile.roles[reduce ? 0 : step % count];
  const leaving = isRoleExiting && !reduce;

  // Stop rotating once the hero has scrolled away: that is the only pause a touch user ever gets.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting)
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || paused || !inView) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let phase: "hold" | "exit" = "hold";

    const arm = () => {
      timer = setTimeout(() => {
        phase = "exit";
        setIsRoleExiting(true);
        timer = setTimeout(() => {
          setStep((s) => s + 1);
          setIsRoleExiting(false);
        }, ROLE_EXIT_MS);
      }, ROLE_HOLD_MS);
    };

    // A hidden tab stops the countdown; coming back gives the role a full hold again.
    const onVisibility = () => {
      if (phase !== "hold") return;
      clearTimeout(timer);
      if (!document.hidden) arm();
    };

    if (!document.hidden) arm();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timer);
      setIsRoleExiting(false);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [step, reduce, paused, inView]);

  // The hero recedes as the next section arrives: the copy settles and fades.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Introduction"
      className="relative min-h-svh bg-raised text-fg"
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <m.div
        data-hero-content
        className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center gap-8 px-6 pb-16 pt-24"
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        {/* The name may wrap to two lines on a phone; from 640px up it must fit one line, so the size scales with the viewport. */}
        <h1 className="hero-rise text-balance text-display font-semibold leading-[1.05] tracking-display [animation-delay:100ms] sm:whitespace-nowrap sm:text-display-fluid">
          {profile.fullName}
        </h1>
        <div className="flex flex-col gap-6">
            {/* The pause target is the line that moves, not the whole hero: the hero fills the viewport, so a
                section-wide hover would keep the ticker stopped for as long as the pointer is in the window. */}
            <div
              className="hero-rise grid w-fit max-w-full [animation-delay:200ms]"
              onPointerEnter={() => setPaused(true)}
              onPointerLeave={() => setPaused(false)}
            >
              {/* All roles share one grid cell: the widest sets the width and one line sets the height, so the block never jumps as roles change. */}
              <div
                aria-hidden="true"
                className="invisible col-start-1 row-start-1 grid text-xl font-medium sm:text-2xl md:text-3xl lg:text-4xl"
              >
                {profile.roles.map((role) => (
                  <span key={role} className="col-start-1 row-start-1">
                    {role}
                  </span>
                ))}
              </div>
              {/* The visible line only ever holds one role, so the full set is given to assistive tech once. */}
              <p data-hero-roles-list className="sr-only">
                Roles: {profile.roles.join(", ")}
              </p>
              <p
                data-hero-role
                aria-hidden="true"
                className="col-start-1 row-start-1 self-center text-xl font-medium text-muted sm:text-2xl md:text-3xl lg:text-4xl"
              >
                <m.span
                  key={activeRole}
                  data-hero-role-text
                  className="inline-block"
                  // The first role is part of the static HTML, so it never waits for a script to fade it in.
                  initial={
                    step === 0 ? false : reduce ? { opacity: 0 } : { opacity: 0, y: ROLE_SLIDE_PX }
                  }
                  animate={
                    leaving
                      ? { opacity: 0, y: -ROLE_SLIDE_PX }
                      : { opacity: 1, y: 0 }
                  }
                  transition={{
                    duration: leaving ? ROLE_EXIT_MS / 1000 : reduce ? ROLE_FADE_S : ROLE_ENTER_S,
                    ease: ROLE_EASE,
                  }}
                >
                  {activeRole}
                </m.span>
              </p>
            </div>
            <p className="hero-rise max-w-[34rem] text-pretty text-base text-subtle [animation-delay:300ms] md:text-lg">
              {profile.about}
            </p>
            <div
              data-hero-actions
              className="hero-rise flex flex-wrap items-center gap-3 pt-2 [animation-delay:400ms]"
            >
              <a
                href="/CV-ATS.pdf"
                download
                className="press inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-white hover:brightness-110"
              >
                <Download className="h-5 w-5" aria-hidden />
                Download CV
              </a>
              <a
                href="#contact"
                className="press inline-flex items-center rounded-full border border-subtle px-6 py-3 font-medium text-fg hover:bg-line/60"
              >
                Contact
              </a>
            </div>
          </div>
      </m.div>
    </section>
  );
}
