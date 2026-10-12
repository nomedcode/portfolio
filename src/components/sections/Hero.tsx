"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ROLE_MS = 3000;
const ROLE_TRANSITION_MS = 450;

// First and last word, e.g. "Fa'iq Haidar Prasetya" -> "FP".
function initialsOf(fullName: string) {
  const words = fullName.trim().split(/\s+/);
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

export function Hero({ photo }: { photo?: string }) {
  const [index, setIndex] = useState(0);
  const [isRoleExiting, setIsRoleExiting] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionActiveRef = useRef(false);
  const count = profile.roles.length;
  const activeRole = profile.roles[reduce ? 0 : index];

  useEffect(() => {
    if (reduce || paused) return;

    const advanceRole = () => {
      if (document.hidden || transitionActiveRef.current) return;

      transitionActiveRef.current = true;
      setIsRoleExiting(true);
      transitionTimeoutRef.current = setTimeout(() => {
        setIndex((i) => (i + 1) % count);
        setIsRoleExiting(false);
        transitionActiveRef.current = false;
        transitionTimeoutRef.current = null;
      }, ROLE_TRANSITION_MS);
    };

    const t = setInterval(advanceRole, ROLE_MS);
    return () => {
      clearInterval(t);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
      transitionActiveRef.current = false;
      setIsRoleExiting(false);
    };
  }, [count, reduce, paused]);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <section
      ref={sectionRef}
      id="top"
      role="region"
      aria-label="Introduction"
      className="relative min-h-svh overflow-hidden bg-deep text-white [--c-ring:#2997ff]"
    >
      <m.div
        data-hero-inner
        className="relative min-h-svh"
        style={reduce ? undefined : { scale, opacity }}
      >
        <div
          className="absolute inset-0"
          style={{ background: profile.heroBackground }}
          aria-hidden
        />
        <div
          data-hero-content
          className="relative flex min-h-svh flex-col items-center justify-center gap-6 px-6 pb-32 pt-20 text-center"
        >
          <div className="relative flex w-full flex-col items-center gap-6">
            {/* ponytail: the frame is a build-time choice (page.tsx checks public/photo.png); a photo that 404s at runtime would show a broken image instead of the initials. */}
            <div
              data-hero-portrait
              className="hero-rise relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/20 shadow-[0_0_64px_-16px_rgba(41,151,255,0.55)] md:h-36 md:w-36"
            >
              {photo ? (
                <Image
                  src={photo}
                  alt={`Portrait of ${profile.fullName}`}
                  width={500}
                  height={500}
                  loading="eager"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-full w-full items-center justify-center text-3xl font-semibold tracking-title text-white/60 md:text-4xl"
                >
                  {initialsOf(profile.fullName)}
                </span>
              )}
            </div>
            <h1
              className="hero-rise w-full max-w-5xl text-5xl font-semibold leading-[1.05] tracking-display [animation-delay:100ms] md:text-7xl"
            >
              Hi, I&apos;m {profile.fullName}
            </h1>
            <div className="hero-rise relative grid w-full max-w-5xl [animation-delay:200ms]">
              <div aria-hidden="true" className="invisible col-start-1 row-start-1">
                {profile.roles.map((role) => (
                  <span key={role}>{role}</span>
                ))}
              </div>
              <p
                data-hero-role
                className="col-start-1 row-start-1 self-center text-lg font-medium text-white/70 md:text-xl"
              >
                <m.span
                  key={activeRole}
                  data-hero-role-text
                  className="inline-block"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={
                    isRoleExiting
                      ? { opacity: 0, y: -24 }
                      : { opacity: 1, y: 0 }
                  }
                  transition={{
                    duration: ROLE_TRANSITION_MS / 1000,
                    ease: "easeOut",
                  }}
                >
                  {activeRole}
                </m.span>
              </p>
            </div>
            <p className="hero-rise w-full max-w-2xl text-base text-white/60 [animation-delay:300ms] md:text-lg">
              {profile.about}
            </p>
          </div>
        </div>
      </m.div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        <p className="text-xs uppercase tracking-widest text-white/60">
          LEARN MORE
        </p>
        <button
          type="button"
          aria-label="Learn more"
          onClick={scrollToProjects}
          className="press hit-area rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <ArrowDown className="h-5 w-5" aria-hidden />
        </button>
      </div>
      {!reduce && (
        <button
          type="button"
          aria-label={paused ? "Play role rotation" : "Pause role rotation"}
          onClick={() => setPaused((p) => !p)}
          className="press hit-area absolute bottom-6 right-6 rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
        >
          {paused ? (
            <Play className="h-5 w-5" aria-hidden />
          ) : (
            <Pause className="h-5 w-5" aria-hidden />
          )}
        </button>
      )}
    </section>
  );
}
