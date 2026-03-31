"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Zap, PieChart, RefreshCw, Globe } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "Auto-Tracking",
    description: "Apple Pay + Bank SMS. No manual entry needed.",
  },
  {
    icon: PieChart,
    title: "Smart Budgets",
    description:
      "Categories, rollovers, and monthly allocation that adapts to you.",
  },
  {
    icon: RefreshCw,
    title: "Subscription Tracking",
    description: "Renewal calendar. No surprise charges ever again.",
  },
  {
    icon: Globe,
    title: "Arabic-First",
    description: "Full RTL support. Egyptian banks. Your language.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
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

export function Features() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="features" className="bg-page-bg py-24 px-4">
      <FadeIn className="text-center">
        <SectionLabel>FEATURES</SectionLabel>
        <h2 className="text-3xl md:text-4xl font-bold text-text text-center mt-4">
          Everything you need to manage your money
        </h2>
      </FadeIn>

      {prefersReducedMotion ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={cardVariants}>
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <div
      className="bg-surface border border-border rounded-2xl p-6 cursor-pointer translate-y-0 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      tabIndex={0}
      role="article"
    >
      <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center">
        <Icon size={24} className="text-accent" strokeWidth={1.75} />
      </div>
      <h3 className="text-lg font-semibold text-text mt-4">{feature.title}</h3>
      <p className="text-sm text-text-secondary mt-2 leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}
