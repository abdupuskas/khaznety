"use client";

import { Download, Scan, Target } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FadeIn } from "@/components/ui/FadeIn";

const steps = [
  {
    number: 1,
    Icon: Download,
    title: "Connect",
    description:
      "Set up Apple Pay shortcut + bank SMS in 2 minutes.",
  },
  {
    number: 2,
    Icon: Scan,
    title: "Track",
    description:
      "Transactions logged and categorized automatically.",
  },
  {
    number: 3,
    Icon: Target,
    title: "Budget",
    description:
      "Monthly allocation, rollovers, and savings goals.",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-surface py-24 px-4"
    >
      <div className="text-center">
        <SectionLabel>HOW IT WORKS</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold text-text text-center mt-4">
          Up and running in 2 minutes
        </h2>
      </div>

      <div className="relative max-w-4xl mx-auto mt-16">
        {/* Desktop connecting line */}
        <div
          className="hidden md:block absolute top-7 left-1/2 -translate-x-1/2 border-t-2 border-dashed border-border"
          style={{ width: "60%" }}
          aria-hidden="true"
        />

        {/* Mobile connecting line */}
        <div
          className="md:hidden absolute left-1/2 -translate-x-1/2 top-14 border-l-2 border-dashed border-border"
          style={{ height: "calc(100% - 3.5rem)" }}
          aria-hidden="true"
        />

        <div className="flex flex-col md:flex-row items-center md:justify-between gap-16 md:gap-0">
          {steps.map((step, index) => (
            <FadeIn
              key={step.number}
              delay={index * 0.15}
              className="relative z-10 flex flex-col items-center"
            >
              {/* Numbered circle */}
              <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center text-xl font-bold shrink-0">
                {step.number}
              </div>

              {/* Icon */}
              <div className="mt-4">
                <step.Icon
                  size={28}
                  strokeWidth={1.75}
                  className="text-accent"
                  aria-hidden="true"
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-text mt-4">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-text-secondary mt-2 text-center max-w-[200px]">
                {step.description}
              </p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
