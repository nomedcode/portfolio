"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { Download } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ponytail: the role line rotates forever and has no pause control, at the owner's request. That leaves WCAG 2.2.2
// (Level A) open for anything that moves by itself for more than five seconds. Ceiling: reduced motion is the only
// way to stop it. Upgrade path: pause while the hero is hovered or focused, or stop after one pass.
const ROLE_HOLD_MS = 2600;
const ROLE_EXIT_MS = 400;
const ROLE_ENTER_S = 0.45;
// Roles travel sideways: the old one leaves to the left, the next one arrives from the right.
const ROLE_SLIDE_PX = 24;
const ROLE_EASE = [0.16, 1, 0.3, 1] as const;

// First and last word, e.g. "Fa'iq Haidar Prasetya" -> "FP".
function initialsOf(fullName: string) {
  const words = fullName.trim().split(/\s+/);
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

export function Hero({ photo }: { photo?: string }) {
  const [step, setStep] = useState(0);
  const [isRoleExiting, setIsRoleExiting] = useState(false);
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const count = profile.roles.length;
  const activeRole = profile.roles[reduce ? 0 : step % count];
  const leaving = isRoleExiting && !reduce;

  useEffect(() => {
    if (reduce) return;

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
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [step, reduce]);

  // The hero recedes as the next section arrives: the copy settles and fades, the portrait lags behind a little.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 96]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Introduction"
      className="relative min-h-svh overflow-hidden bg-deep text-white [--c-ring:#2997ff]"
    >
      <div
        className="absolute inset-0"
        style={{ background: profile.heroBackground }}
        aria-hidden
      />
      <div
        data-hero-content
        className="relative mx-auto grid min-h-svh max-w-6xl content-center items-center gap-10 px-6 pb-16 pt-24 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-12 lg:gap-16"
      >
        <m.div
          data-hero-copy
          className="flex flex-col items-center gap-6 text-center md:items-start md:text-left"
          style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
        >
          <h1 className="hero-rise w-full text-balance text-[2.75rem] font-semibold leading-[1.05] tracking-display [animation-delay:100ms] min-[400px]:text-5xl sm:text-6xl lg:text-7xl xl:text-[5rem]">
            {profile.fullName}
          </h1>
          <div className="hero-rise grid w-fit max-w-full [animation-delay:200ms]">
            {/* All roles share one grid cell: the widest sets the width and one line sets the height, so the block never jumps as roles change. */}
            <div
              aria-hidden="true"
              className="invisible col-start-1 row-start-1 grid text-xl font-medium md:text-2xl"
            >
              {profile.roles.map((role) => (
                <span key={role} className="col-start-1 row-start-1">
                  {role}
                </span>
              ))}
            </div>
            <p
              data-hero-role
              className="col-start-1 row-start-1 self-center text-xl font-medium text-white/80 md:text-2xl"
            >
              <m.span
                key={activeRole}
                data-hero-role-text
                className="inline-block"
                // The first role is part of the static HTML, so it never waits for a script to fade it in.
                initial={step === 0 ? false : { opacity: 0, x: ROLE_SLIDE_PX }}
                animate={
                  leaving
                    ? { opacity: 0, x: -ROLE_SLIDE_PX }
                    : { opacity: 1, x: 0 }
                }
                transition={{
                  duration: leaving ? ROLE_EXIT_MS / 1000 : ROLE_ENTER_S,
                  ease: ROLE_EASE,
                }}
              >
                {activeRole}
              </m.span>
            </p>
          </div>
          <p className="hero-rise max-w-[34rem] text-pretty text-base text-white/65 [animation-delay:300ms] md:text-lg">
            {profile.about}
          </p>
          <div
            data-hero-actions
            className="hero-rise flex flex-wrap items-center justify-center gap-3 pt-2 [animation-delay:400ms] md:justify-start"
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
              className="press inline-flex items-center rounded-full border border-white/40 px-6 py-3 font-medium text-white hover:bg-white/10"
            >
              Contact
            </a>
          </div>
        </m.div>

        <m.div
          data-hero-portrait-wrap
          className="relative flex items-center justify-center max-md:order-first md:justify-self-end"
          style={reduce ? undefined : { y: portraitY, scale: portraitScale }}
        >
          <div
            data-hero-glow
            aria-hidden="true"
            className="hero-rise pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(41,151,255,0.32),transparent)] md:-inset-16 lg:-inset-24"
          />
          {/* ponytail: the frame is a build-time choice (page.tsx checks public/photo.png); a photo that 404s at runtime would show a broken image instead of the initials. */}
          <div
            data-hero-portrait
            className="hero-rise relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/20 sm:h-40 sm:w-40 md:h-56 md:w-56 lg:h-72 lg:w-72"
          >
            {photo ? (
              <Image
                src={photo}
                alt={`Portrait of ${profile.fullName}`}
                width={400}
                height={400}
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-full w-full items-center justify-center text-4xl font-semibold tracking-display text-white/60 lg:text-6xl"
              >
                {initialsOf(profile.fullName)}
              </span>
            )}
          </div>
        </m.div>
      </div>
    </section>
  );
}
