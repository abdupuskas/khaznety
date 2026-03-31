"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionLabel } from "@/components/ui/SectionLabel";

const freeFeatures = [
  "Unlimited transaction tracking",
  "Apple Pay + SMS automation",
  "3 custom categories",
  "Current month analytics",
  "1 bank SMS sender",
];

const proFeatures = [
  "Everything in Free",
  "Unlimited categories",
  "Full rollover control",
  "All-time analytics & trends",
  "Subscription tracking",
  "CSV / PDF export",
  "Multiple income sources",
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const proPrice = isAnnual ? "399" : "59";
  const proPeriod = isAnnual ? "/year" : "/month";

  return (
    <section id="pricing" className="bg-page-bg py-24 px-4">
      <FadeIn className="text-center">
        <SectionLabel>PRICING</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold text-text text-center mt-4">
          Simple, transparent pricing
        </h2>
        <p className="text-text-secondary text-center mt-3">
          Start free. Upgrade when you&apos;re ready.
        </p>
      </FadeIn>

      {/* Billing toggle */}
      <FadeIn className="flex justify-center mt-8" delay={0.1}>
        <div className="bg-surface-2 rounded-full p-1 inline-flex items-center" role="radiogroup" aria-label="Billing period">
          <button
            type="button"
            role="radio"
            aria-checked={!isAnnual}
            onClick={() => setIsAnnual(false)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              !isAnnual
                ? "bg-surface shadow-sm text-text"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={isAnnual}
            onClick={() => setIsAnnual(true)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent inline-flex items-center gap-2 ${
              isAnnual
                ? "bg-surface shadow-sm text-text"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Annual
            <span className="bg-accent text-white text-xs rounded-full px-2 py-0.5 font-medium">
              Save 30%
            </span>
          </button>
        </div>
      </FadeIn>

      {/* Cards */}
      {prefersReducedMotion ? (
        <div className="flex flex-col md:flex-row gap-6 max-w-3xl mx-auto mt-10 items-stretch">
          <FreeCard />
          <ProCard
            price={proPrice}
            period={proPeriod}
            isAnnual={isAnnual}
          />
        </div>
      ) : (
        <motion.div
          className="flex flex-col md:flex-row gap-6 max-w-3xl mx-auto mt-10 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.div className="flex-1 flex" variants={cardVariants}>
            <FreeCard />
          </motion.div>
          <motion.div className="flex-1 flex" variants={cardVariants}>
            <ProCard
              price={proPrice}
              period={proPeriod}
              isAnnual={isAnnual}
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

function FreeCard() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-8 flex flex-col flex-1">
      <h3 className="text-xl font-bold text-text">Free</h3>
      <div className="mt-4">
        <span className="text-3xl font-bold text-text">EGP 0</span>
        <span className="text-text-muted text-sm ml-1">/month</span>
      </div>
      <p className="text-text-secondary text-sm mt-2">
        Everything you need to start tracking
      </p>

      <ul className="mt-6 space-y-3 flex-1" role="list">
        {freeFeatures.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              size={18}
              className="text-accent shrink-0 mt-0.5"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="text-sm text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="border border-border rounded-full py-3 px-6 w-full text-center font-medium text-text hover:bg-surface-2 transition-colors duration-200 cursor-pointer mt-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Get Started
      </button>
    </div>
  );
}

function ProCard({
  price,
  period,
  isAnnual,
}: {
  price: string;
  period: string;
  isAnnual: boolean;
}) {
  return (
    <div className="bg-accent-dark rounded-2xl p-8 relative flex flex-col flex-1">
      {/* Most Popular badge */}
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-medium rounded-full px-3 py-1 whitespace-nowrap">
        Most Popular
      </span>

      <h3 className="text-xl font-bold text-white">Khaznety Pro</h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">EGP {price}</span>
        <span className="text-white/60 text-sm">{period}</span>
        {isAnnual && (
          <span className="text-white/40 text-sm line-through ml-1">
            EGP 59/mo
          </span>
        )}
      </div>
      <p className="text-white/70 text-sm mt-2">
        Full control over your finances
      </p>

      <ul className="mt-6 space-y-3 flex-1" role="list">
        {proFeatures.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              size={18}
              className="text-accent-border shrink-0 mt-0.5"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="text-sm text-white/90">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="bg-white text-accent-dark rounded-full py-3 px-6 w-full text-center font-semibold hover:bg-white/90 transition-colors duration-200 cursor-pointer mt-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Try Pro Free for 7 Days
      </button>
    </div>
  );
}
