"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ROLE_MS = 3000;
const ROLE_TRANSITION_MS = 450;

export function Hero() {
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
            <h1
              className="hero-rise w-full max-w-5xl text-5xl font-semibold md:text-7xl"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
            >
              Hi, I&apos;m {profile.fullName}
            </h1>
            <div className="hero-rise relative grid w-full max-w-5xl [animation-delay:100ms]">
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
            <p className="hero-rise w-full max-w-2xl text-base text-white/60 [animation-delay:200ms] md:text-lg">
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
