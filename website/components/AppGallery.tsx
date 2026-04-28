"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FadeIn } from "@/components/ui/FadeIn";

const screenshots = [
  { file: "Onboarding.PNG",    label: "Welcome",       alt: "Hesabaty welcome screen — brand identity and sign-in" },
  { file: "Home.PNG",          label: "Dashboard",     alt: "Hesabaty home dashboard — balance, accounts, quick actions" },
  { file: "Budgets.PNG",       label: "Budget",        alt: "Hesabaty budget screen — category ring, rollovers" },
  { file: "Trends.PNG",        label: "Trends",        alt: "Hesabaty analytics screen — monthly spending charts" },
  { file: "Subscriptions.PNG", label: "Subscriptions", alt: "Hesabaty subscriptions screen — renewal tracking" },
  { file: "Home2.PNG",         label: "Home",          alt: "Hesabaty home screen — recent transactions and checklist" },
];

// iPhone 16 Pro aspect ratio: 1206 × 2622 ≈ 9:19.5
const PHONE_W = 200;
const PHONE_H = 433;
const FRAME_PAD = 10;
const NOTCH_W = 90;
const NOTCH_H = 20;
const RADIUS_OUTER = 36;
const RADIUS_INNER = 28;

function PhoneFrame({ file, label, alt }: { file: string; label: string; alt: string }) {
  return (
    <div className="flex flex-col items-center gap-3 shrink-0">
      {/* Phone shell */}
      <div
        className="relative bg-[#5E7D63] shadow-2xl shadow-[#5E7D63]/30"
        style={{
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: RADIUS_OUTER,
        }}
        aria-hidden="true"
      >
        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 z-20 -translate-x-1/2 bg-[#5E7D63]"
          style={{ width: NOTCH_W, height: NOTCH_H, borderBottomLeftRadius: 14, borderBottomRightRadius: 14 }}
        />

        {/* Screen inset */}
        <div
          className="absolute overflow-hidden bg-[#F0EEE9]"
          style={{
            inset: FRAME_PAD,
            borderRadius: RADIUS_INNER,
          }}
        >
          <Image
            src={`/screenshots/${file}`}
            alt={alt}
            fill
            sizes={`${PHONE_W}px`}
            className="object-cover object-top"
            quality={90}
          />
        </div>
      </div>

      <span className="text-[13px] font-medium text-[#5C5850]">{label}</span>
    </div>
  );
}

export function AppGallery() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-[#FAFAF8] py-20 border-y border-[#E4DDD2] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <FadeIn className="text-center mb-14">
          <SectionLabel>APP SCREENSHOTS</SectionLabel>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mt-4">
            Every screen, crafted for Egypt
          </h2>
          <p className="text-[#5C5850] mt-3 max-w-lg mx-auto">
            Arabic-first, RTL-ready, and designed to feel native on iOS and Android.
          </p>
        </FadeIn>

        {/* Scroll container with fade masks */}
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-8 w-20 z-10 bg-gradient-to-r from-[#FAFAF8] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-8 w-20 z-10 bg-gradient-to-l from-[#FAFAF8] to-transparent" />

          <div
            className="overflow-x-auto -mx-4 px-12"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            <motion.div
              className="flex gap-5 w-max mx-auto"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
            >
              {screenshots.map((s) => (
                <PhoneFrame key={s.file} {...s} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
