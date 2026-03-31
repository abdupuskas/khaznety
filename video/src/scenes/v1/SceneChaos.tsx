import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { fontFamily } from "../../Root";

const chaosRows = [
  { label: "مطعم", amount: "450 ؟؟؟", color: "#C0392B" },
  { label: "أوبر", amount: "200 ؟", color: "#C0392B" },
  { label: "سوبر ماركت", amount: "800 أو 900 ؟", color: "#D97706" },
  { label: "لا أعرف !!!", amount: "...", color: "#9C9485" },
  { label: "???", amount: "× × ×", color: "#C0392B" },
  { label: "إيه ده كمان", amount: "150 ؟", color: "#9C9485" },
];

const ChaosRow: React.FC<{
  label: string;
  amount: string;
  color: string;
  startFrame: number;
  index: number;
}> = ({ label, amount, color, startFrame, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rowSpring = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const translateX = interpolate(rowSpring, [0, 1], [30, 0]);

  // Earlier rows fade slightly as more appear (claustrophobic pile-up)
  const laterRowsStarted = frame > startFrame + 40;
  const ageFade = laterRowsStarted
    ? interpolate(frame, [startFrame + 40, startFrame + 80], [1, 0.6], {
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        borderBottom: "1px solid #F0EEE9",
        opacity: rowSpring * ageFade,
        transform: `translateX(${translateX}px)`,
        direction: "rtl",
        fontFamily,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color }}>
        {amount}
      </div>
    </div>
  );
};

export const SceneChaos: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance
  const cardSpring = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 20, stiffness: 180 },
  });
  const cardY = interpolate(cardSpring, [0, 1], [40, 0]);

  // Header text
  const headerSpring = spring({
    frame: Math.max(0, frame),
    fps,
    config: { damping: 200 },
  });

  // Sub-text
  const subOpacity = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 200 },
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#111111",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        paddingLeft: 32,
        paddingRight: 32,
      }}
    >
      {/* Bold question above the card */}
      <div
        style={{
          fontSize: 38,
          fontWeight: 800,
          color: "#FFFFFF",
          textAlign: "center",
          direction: "rtl",
          opacity: headerSpring,
          marginBottom: 20,
          fontFamily,
          lineHeight: 1.2,
        }}
      >
        فين راحت فلوسك؟
      </div>

      {/* Fake Notes app card */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          overflow: "hidden",
          width: "100%",
          maxWidth: 540,
          opacity: cardSpring,
          transform: `translateY(${cardY}px)`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Notes app header bar */}
        <div
          style={{
            background: "#F7F7F7",
            padding: "10px 14px",
            borderBottom: "1px solid #E8E8E8",
            display: "flex",
            alignItems: "center",
            gap: 8,
            direction: "rtl",
            fontFamily,
          }}
        >
          <div style={{ fontSize: 15, color: "#9C9485" }}>📝</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
            مصاريف الشهر
          </div>
        </div>

        {/* Chaos rows — staggered entries */}
        {chaosRows.map((row, i) => (
          <ChaosRow
            key={row.label}
            {...row}
            startFrame={i * 22}
            index={i}
          />
        ))}
      </div>

      {/* Sub-text */}
      <div
        style={{
          fontSize: 18,
          color: "rgba(255,255,255,0.45)",
          marginTop: 20,
          textAlign: "center",
          direction: "rtl",
          opacity: subOpacity,
          fontFamily,
        }}
      >
        كل شهر نفس الحكاية
      </div>
    </div>
  );
};
