"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Shield, Smartphone, Play, Zap, CreditCard, Bell } from "lucide-react";
import { FadeIn } from "./ui/FadeIn";

function PhoneMockup() {
  const prefersReducedMotion = useReducedMotion();

  const floatingAnimation = prefersReducedMotion
    ? {}
    : {
        y: [0, -10, 0],
      };

  const floatingTransition = prefersReducedMotion
    ? {}
    : {
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  return (
    <motion.div
      className="relative mx-auto w-[260px] sm:w-[280px]"
      animate={floatingAnimation}
      transition={floatingTransition}
    >
      {/* Glow behind the phone */}
      <div className="absolute -inset-8 rounded-[60px] bg-accent/20 blur-3xl" />

      {/* Phone frame */}
      <div className="relative rounded-[40px] border border-white/10 bg-[#0a2e1e] p-3 shadow-2xl shadow-black/40">
        {/* Notch */}
        <div className="absolute top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-[#0a2e1e]" />

        {/* Screen area */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-[#0f3a26] to-[#0a2e1e]">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pt-8 pb-2">
            <span className="text-[10px] font-medium text-white/50">9:41</span>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-3 rounded-sm bg-white/40" />
              <div className="h-1.5 w-3 rounded-sm bg-white/40" />
              <div className="h-2 w-4 rounded-sm border border-white/40">
                <div className="h-full w-3/4 rounded-sm bg-white/50" />
              </div>
            </div>
          </div>

          {/* App header */}
          <div className="px-5 pt-3 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent">
                <Shield size={14} className="text-white" strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold text-white">Khaznety</span>
            </div>
          </div>

          {/* Balance card */}
          <div className="mx-4 rounded-2xl bg-accent/30 p-4">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
              Total balance
            </span>
            <p className="mt-1 text-2xl font-bold text-white">EGP 24,350</p>
            <span className="text-[10px] text-white/40">March 2026</span>
          </div>

          {/* Placeholder transaction rows */}
          <div className="mt-4 space-y-0 px-4 pb-6">
            <div className="flex items-center gap-3 border-b border-white/5 py-3">
              <div className="h-7 w-7 rounded-full bg-accent-light/20" />
              <div className="flex-1">
                <div className="h-2.5 w-20 rounded bg-white/20" />
                <div className="mt-1.5 h-2 w-14 rounded bg-white/10" />
              </div>
              <div className="h-2.5 w-16 rounded bg-white/15 text-right" />
            </div>
            <div className="flex items-center gap-3 border-b border-white/5 py-3">
              <div className="h-7 w-7 rounded-full bg-accent-light/20" />
              <div className="flex-1">
                <div className="h-2.5 w-24 rounded bg-white/20" />
                <div className="mt-1.5 h-2 w-10 rounded bg-white/10" />
              </div>
              <div className="h-2.5 w-12 rounded bg-white/15 text-right" />
            </div>
            <div className="flex items-center gap-3 py-3">
              <div className="h-7 w-7 rounded-full bg-accent-light/20" />
              <div className="flex-1">
                <div className="h-2.5 w-16 rounded bg-white/20" />
                <div className="mt-1.5 h-2 w-12 rounded bg-white/10" />
              </div>
              <div className="h-2.5 w-14 rounded bg-white/15 text-right" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-accent-dark via-[#0f4a32] to-accent">
      {/* Decorative dot pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Radial glow at top */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/15 blur-3xl" />

      {/* Content container */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-24 pb-20 text-center sm:pt-32 sm:pb-24">
        {/* Badge */}
        <FadeIn delay={0}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <Zap size={14} className="text-accent-light" strokeWidth={2} />
            <span className="text-xs font-medium text-white/70">
              Built for Egypt
            </span>
          </div>
        </FadeIn>

        {/* Headline */}
        <FadeIn delay={0.1}>
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl">
            Your money,
            <br />
            finally clear.
          </h1>
        </FadeIn>

        {/* Subtitle */}
        <FadeIn delay={0.2}>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/60">
            Automated expense tracking for Egypt. Apple Pay, bank SMS, budgets
            that roll over.
          </p>
        </FadeIn>

        {/* Feature pills */}
        <FadeIn delay={0.3}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/60">
              <CreditCard size={13} className="text-accent-border" strokeWidth={1.75} />
              Apple Pay tracking
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/60">
              <Bell size={13} className="text-accent-border" strokeWidth={1.75} />
              Bank SMS parsing
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/60">
              <Shield size={13} className="text-accent-border" strokeWidth={1.75} />
              Budgets that roll over
            </span>
          </div>
        </FadeIn>

        {/* Phone mockup */}
        <FadeIn delay={0.4} className="mt-12 sm:mt-16">
          <PhoneMockup />
        </FadeIn>

        {/* Store buttons */}
        <FadeIn delay={0.5} className="mt-10 sm:mt-14">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <a
              href="#"
              className="group inline-flex h-14 cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10"
              aria-label="Download on the App Store"
            >
              <Smartphone
                size={22}
                className="text-white/80 transition-colors duration-200 group-hover:text-white"
                strokeWidth={1.75}
              />
              <div className="flex flex-col items-start">
                <span className="text-[10px] leading-none text-white/50">
                  Download on the
                </span>
                <span className="text-sm font-semibold leading-tight text-white">
                  App Store
                </span>
              </div>
            </a>

            <a
              href="#"
              className="group inline-flex h-14 cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 backdrop-blur-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10"
              aria-label="Get it on Google Play"
            >
              <Play
                size={22}
                className="text-white/80 transition-colors duration-200 group-hover:text-white"
                strokeWidth={1.75}
              />
              <div className="flex flex-col items-start">
                <span className="text-[10px] leading-none text-white/50">
                  Get it on
                </span>
                <span className="text-sm font-semibold leading-tight text-white">
                  Google Play
                </span>
              </div>
            </a>
          </div>
        </FadeIn>
      </div>

      {/* Bottom gradient fade to page-bg */}
      <div className="absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-page-bg to-transparent" />
    </section>
  );
}
