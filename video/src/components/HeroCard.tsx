import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { fontFamily } from "../Root";

interface StatPill {
  label: string;
  amount: string;
}

interface HeroCardProps {
  targetBalance?: number;
  month?: string;
  stats?: StatPill[];
  animStartFrame?: number;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  targetBalance = 24350,
  month = "March 2026",
  stats = [
    { label: "Spent", amount: "EGP 8,420" },
    { label: "Received", amount: "EGP 32,770" },
    { label: "Remaining", amount: "EGP 4,580" },
  ],
  animStartFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - animStartFrame);

  // Slide up entrance
  const entranceSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const translateY = interpolate(entranceSpring, [0, 1], [40, 0]);
  const opacity = entranceSpring;

  // Count-up animation — slower settle for dramatic effect
  const countProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 200, stiffness: 80 },
  });
  const displayBalance = Math.round(
    interpolate(countProgress, [0, 1], [0, targetBalance])
  );

  // Stats fade in slightly after card
  const statsSpring = spring({
    frame: Math.max(0, localFrame - 20),
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  return (
    <div
      style={{
        background: "#1A7A52",
        borderRadius: 16,
        padding: "18px 18px 16px",
        margin: "0 14px",
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily,
      }}
    >
      {/* Label */}
      <div
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.65)",
          marginBottom: 2,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        Total balance
      </div>

      {/* Balance amount */}
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: "#FFFFFF",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
          marginBottom: 2,
        }}
      >
        EGP {displayBalance.toLocaleString("en-EG")}
      </div>

      {/* Month */}
      <div
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.55)",
          marginBottom: 12,
        }}
      >
        {month} · All accounts
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          gap: 8,
          opacity: statsSpring,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 10,
              padding: "8px 10px",
            }}
          >
            <div
              style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}
            >
              {s.label}
            </div>
            <div
              style={{ fontSize: 12, fontWeight: 600, color: "#FFFFFF" }}
            >
              {s.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
