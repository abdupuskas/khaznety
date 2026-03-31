import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { fontFamily } from "../Root";

interface GoalProgressCardProps {
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  animStartFrame?: number;
  currency?: string;
  monthlyContribution?: number;
}

export const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  goalName,
  targetAmount,
  currentAmount,
  animStartFrame = 0,
  currency = "EGP",
  monthlyContribution = 3000,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - animStartFrame);

  // Card entrance
  const entranceSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const translateY = interpolate(entranceSpring, [0, 1], [40, 0]);

  // Counter animation — slow dramatic settle
  const countProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 200, stiffness: 80 },
  });
  const displayAmount = Math.round(
    interpolate(countProgress, [0, 1], [0, currentAmount])
  );

  // Progress bar fill
  const barProgress = spring({
    frame: Math.max(0, localFrame - 5),
    fps,
    config: { damping: 30, stiffness: 120 },
  });
  const barPct = interpolate(barProgress, [0, 1], [0, currentAmount / targetAmount]);

  // Months remaining
  const remaining = targetAmount - currentAmount;
  const monthsLeft =
    monthlyContribution > 0 ? Math.ceil(remaining / monthlyContribution) : null;

  return (
    <div
      style={{
        background: "#FAFAF8",
        borderRadius: 16,
        padding: "16px 16px",
        margin: "0 14px",
        opacity: entranceSpring,
        transform: `translateY(${translateY}px)`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        fontFamily,
      }}
    >
      {/* Goal name */}
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#1A1A1A",
          marginBottom: 4,
        }}
      >
        {goalName}
      </div>

      {/* Amount row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 10,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1A7A52" }}>
          {currency} {displayAmount.toLocaleString("en-EG")}
        </div>
        <div style={{ fontSize: 11, color: "#9C9485" }}>
          of {currency} {targetAmount.toLocaleString("en-EG")}
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 8,
          background: "#EEECE7",
          borderRadius: 9999,
          overflow: "hidden",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(barPct * 100, 100)}%`,
            background: "#1A7A52",
            borderRadius: 9999,
          }}
        />
      </div>

      {/* Footer row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 11, color: "#9C9485" }}>
          {Math.round(barPct * 100)}% complete
        </div>
        {monthsLeft !== null && monthsLeft > 0 && (
          <div style={{ fontSize: 11, color: "#9C9485" }}>
            ~{monthsLeft} months to go
          </div>
        )}
      </div>
    </div>
  );
};
