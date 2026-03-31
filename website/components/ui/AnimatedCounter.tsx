"use client";

import { useEffect, useRef } from "react";
import {
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
  useInView,
  motion,
} from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

function formatWithCommas(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function AnimatedCounter({
  target,
  duration = 2,
  prefix = "",
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) => formatWithCommas(v));
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    if (prefersReducedMotion) {
      motionValue.set(target);
      return;
    }

    const controls = animate(motionValue, target, {
      duration,
      ease: [0.25, 0.1, 0.25, 1] as const,
    });

    return () => controls.stop();
  }, [isInView, target, duration, motionValue, prefersReducedMotion]);

  // For reduced motion, render the final value immediately
  if (prefersReducedMotion) {
    return (
      <span ref={ref} className={className}>
        {prefix}
        {formatWithCommas(target)}
        {suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}
