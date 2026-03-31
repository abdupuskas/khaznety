import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { fontFamily } from "../Root";

interface CategoryRowProps {
  icon: string;
  iconBg: string;
  name: string;
  pct: number; // 0–1
  spentLabel: string;
  budgetLabel: string;
  animDelay?: number;
}

const BAR_COLORS: Record<string, string> = {
  safe: "#1A7A52",
  warning: "#D97706",
  danger: "#C0392B",
};

export const CategoryRow: React.FC<CategoryRowProps> = ({
  icon,
  iconBg,
  name,
  pct,
  spentLabel,
  budgetLabel,
  animDelay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rowSpring = spring({
    frame: Math.max(0, frame - animDelay),
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const fillSpring = spring({
    frame: Math.max(0, frame - animDelay - 5),
    fps,
    config: { damping: 200, stiffness: 80 },
  });

  const translateY = interpolate(rowSpring, [0, 1], [24, 0]);
  const opacity = rowSpring;
  const fillWidth = interpolate(fillSpring, [0, 1], [0, pct * 100]);

  const barColor =
    pct >= 1 ? BAR_COLORS.danger : pct >= 0.75 ? BAR_COLORS.warning : BAR_COLORS.safe;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "11px 16px",
        gap: 10,
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily,
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Text + bar */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#1A1A1A",
            }}
          >
            {name}
          </span>
          <span style={{ fontSize: 12, color: "#9C9485" }}>{budgetLabel}</span>
        </div>

        {/* Progress track */}
        <div
          style={{
            height: 4,
            background: "#E4DDD2",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${fillWidth}%`,
              background: barColor,
              borderRadius: 2,
            }}
          />
        </div>

        <span
          style={{
            fontSize: 11,
            color: "#9C9485",
            marginTop: 3,
            display: "block",
          }}
        >
          {spentLabel}
        </span>
      </div>
    </div>
  );
};
