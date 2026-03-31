"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface ShowcaseItem {
  label: string;
  title: string;
  description: string;
  bullets: [string, string, string];
  screenshot: string;
}

const showcaseItems: ShowcaseItem[] = [
  {
    label: "DASHBOARD",
    title: "Your finances at a glance",
    description:
      "See total balance, spending breakdown, and recent transactions — all on one screen.",
    bullets: [
      "Real-time balance updates",
      "Category-wise spending",
      "Quick action buttons",
    ],
    screenshot: "Home.PNG",
  },
  {
    label: "BUDGETS",
    title: "Budgets that actually work",
    description:
      "Set monthly limits per category. Unused budget rolls over — no money left behind.",
    bullets: [
      "Automatic rollover",
      "Visual progress bars",
      "Overspend alerts",
    ],
    screenshot: "Budgets.PNG",
  },
  {
    label: "SUBSCRIPTIONS",
    title: "Never miss a renewal",
    description:
      "Track every subscription in one place. Get reminded before you're charged.",
    bullets: [
      "14-day renewal calendar",
      "Monthly & yearly totals",
      "One-tap cancellation tracking",
    ],
    screenshot: "Subscriptions.PNG",
  },
];

function PhoneFrame({ screenshot, label }: { screenshot: string; label: string }) {
  return (
    <div
      className="relative rounded-[40px] bg-accent-dark p-[10px] shadow-xl w-[220px] h-[440px] sm:w-[250px] sm:h-[500px] shrink-0"
      aria-hidden="true"
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 z-10 -translate-x-1/2">
        <div className="h-[22px] w-[100px] rounded-b-2xl bg-accent-dark" />
      </div>

      {/* Screen */}
      <div className="relative h-full w-full overflow-hidden rounded-[30px]">
        <Image
          src={`/screenshots/${screenshot}`}
          alt={`Khaznety ${label.toLowerCase()} screen`}
          fill
          sizes="(max-width: 640px) 220px, 250px"
          className="object-cover object-top"
          quality={90}
        />
      </div>
    </div>
  );
}

function ShowcaseBlock({
  item,
  index,
}: {
  item: ShowcaseItem;
  index: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const isEven = index % 2 === 1;
  const slideDirection = isEven ? 60 : -60;

  const phoneContent = <PhoneFrame screenshot={item.screenshot} label={item.label} />;

  const textContent = (
    <div className="flex-1 max-w-lg">
      <SectionLabel>{item.label}</SectionLabel>
      <h3 className="text-2xl md:text-3xl font-bold text-text mt-3">
        {item.title}
      </h3>
      <p className="text-text-secondary leading-relaxed mt-4">
        {item.description}
      </p>
      <ul className="mt-6 space-y-3" role="list">
        {item.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-light">
              <Check
                size={12}
                className="text-accent"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </span>
            <span className="text-text-secondary text-sm leading-snug">
              {bullet}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  if (prefersReducedMotion) {
    return (
      <div
        className={`flex flex-col items-center gap-12 md:gap-16 ${
          isEven ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        {phoneContent}
        {textContent}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center gap-12 md:gap-16 ${
        isEven ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, x: slideDirection }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1] as const,
        }}
      >
        {phoneContent}
      </motion.div>

      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{
          duration: 0.5,
          delay: 0.15,
          ease: [0.25, 0.1, 0.25, 1] as const,
        }}
      >
        {textContent}
      </motion.div>
    </div>
  );
}

export function PhoneShowcase() {
  return (
    <section className="bg-page-bg py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-16 md:space-y-24">
        {showcaseItems.map((item, index) => (
          <ShowcaseBlock key={item.label} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
