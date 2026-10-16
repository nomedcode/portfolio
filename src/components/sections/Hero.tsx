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
const ROLE_ENTER_S = 0.6;
const ROLE_FADE_S = 0.2;
// Roles roll vertically like a ticker: the old one leaves upward, the next one arrives from below.
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
      setIsRoleExiting(false);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [step, reduce]);

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
        <div
          data-hero-row
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12"
        >
          <div className="flex flex-col gap-6">
            <div className="hero-rise grid w-fit max-w-full [animation-delay:200ms]">
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
              <p
                data-hero-role
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
          {/* Decorative: the name already says who this is, so the card stays out of the accessibility tree. */}
          <div
            data-hero-portrait
            aria-hidden="true"
            className="hero-rise aspect-[4/5] w-44 shrink-0 overflow-hidden rounded-card ring-1 ring-line [animation-delay:500ms] sm:w-52 md:w-60 lg:w-72"
          >
            {photo ? (
              <Image
                src={photo}
                alt=""
                width={400}
                height={500}
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-page text-4xl font-semibold tracking-display text-subtle lg:text-6xl">
                {initialsOf(profile.fullName)}
              </span>
            )}
          </div>
        </div>
      </m.div>
    </section>
  );
}
