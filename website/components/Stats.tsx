"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { FadeIn } from "@/components/ui/FadeIn";

interface Stat {
  target: number;
  suffix: string;
  label: string;
  /** When true, render statically instead of animating (for decimal values) */
  static?: boolean;
  staticDisplay?: string;
}

const stats: Stat[] = [
  {
    target: 12,
    suffix: "+",
    label: "Egyptian Banks Supported",
  },
  {
    target: 50,
    suffix: "K+",
    label: "Transactions Tracked",
  },
  {
    target: 0,
    suffix: "",
    label: "Average Rating",
    static: true,
    staticDisplay: "4.8\u2605",
  },
  {
    target: 100,
    suffix: "%",
    label: "Free to Start",
  },
];

export function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  return (
    <section
      ref={sectionRef}
      className="bg-accent-dark py-16 px-4"
      aria-label="Key statistics"
    >
      <FadeIn>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              {stat.static ? (
                <span
                  className="text-3xl md:text-4xl font-bold text-white"
                  aria-label={stat.label}
                >
                  {stat.staticDisplay}
                </span>
              ) : (
                <AnimatedCounter
                  target={isInView ? stat.target : 0}
                  duration={2}
                  suffix={stat.suffix}
                  className="text-3xl md:text-4xl font-bold text-white"
                />
              )}
              <p className="text-white/60 text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
