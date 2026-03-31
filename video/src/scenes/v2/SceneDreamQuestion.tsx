import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { KineticText } from "../../components/KineticText";
import { fontFamily } from "../../Root";

const dreamItems = [
  { emoji: "✈️", label: "سفرة", delay: 25 },
  { emoji: "🚗", label: "عربية", delay: 35 },
  { emoji: "🏠", label: "شقة", delay: 45 },
];

const DreamPill: React.FC<{
  emoji: string;
  label: string;
  startFrame: number;
}> = ({ emoji, label, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 16, stiffness: 250 },
  });
  const scale = interpolate(sp, [0, 1], [0.5, 1]);
  const opacity = interpolate(
    spring({ frame: Math.max(0, frame - startFrame), fps, config: { damping: 200 } }),
    [0, 1],
    [0, 1]
  );

  return (
    <div
      style={{
        background: "#EAF4EE",
        borderRadius: 9999,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 10,
        paddingBottom: 10,
        display: "flex",
        alignItems: "center",
        gap: 6,
        transform: `scale(${scale})`,
        opacity,
        fontFamily,
      }}
    >
      <span style={{ fontSize: 20 }}>{emoji}</span>
      <span style={{ fontSize: 16, fontWeight: 700, color: "#1A7A52" }}>{label}</span>
    </div>
  );
};

export const SceneDreamQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = spring({ frame, fps, config: { damping: 200 } });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#F0EEE9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: bgOpacity,
        fontFamily,
        gap: 28,
        direction: "rtl",
      }}
    >
      {/* Bold question */}
      <div style={{ textAlign: "center" }}>
        <KineticText
          text="حلمك بـ كام؟"
          startFrame={5}
          fontSize={72}
          color="#1A1A1A"
          weight={800}
          impact
        />
      </div>

      {/* Dream pills */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
          direction: "rtl",
        }}
      >
        {dreamItems.map((item) => (
          <DreamPill
            key={item.label}
            emoji={item.emoji}
            label={item.label}
            startFrame={item.delay}
          />
        ))}
      </div>
    </div>
  );
};
