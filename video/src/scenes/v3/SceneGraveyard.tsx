import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { fontFamily } from "../../Root";

const graveyardItems = [
  { emoji: "⚡", text: "Spreadsheets.", startFrame: 5 },
  { emoji: "📱", text: "Budget apps.", startFrame: 25 },
  { emoji: "🔔", text: "Reminders you ignore.", startFrame: 45 },
  { emoji: "📊", text: "Excel budgets.", startFrame: 65 },
];

const GraveyardPill: React.FC<{
  emoji: string;
  text: string;
  startFrame: number;
  index: number;
  totalCount: number;
}> = ({ emoji, text, startFrame, index, totalCount }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sp = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 18, stiffness: 200 },
  });
  const translateY = interpolate(sp, [0, 1], [24, 0]);

  // Age fade — earlier items dim as newer ones appear
  const ageOffset = (totalCount - 1 - index) * 20; // how many frames after this item appeared
  const ageFade = frame > startFrame + ageOffset
    ? interpolate(frame, [startFrame + ageOffset, startFrame + ageOffset + 40], [1, 0.35], {
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 9999,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 12,
        paddingBottom: 12,
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: sp * ageFade,
        transform: `translateY(${translateY}px)`,
        fontFamily,
      }}
    >
      <span style={{ fontSize: 20 }}>{emoji}</span>
      <span
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "rgba(255,255,255,0.75)",
          textDecoration: ageFade < 0.8 ? "line-through" : "none",
          textDecorationColor: "rgba(255,255,255,0.4)",
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const SceneGraveyard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = spring({ frame, fps, config: { damping: 200 } });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: sceneFade,
        fontFamily,
        gap: 14,
        paddingLeft: 60,
        paddingRight: 60,
      }}
    >
      {graveyardItems.map((item, i) => (
        <GraveyardPill
          key={item.text}
          {...item}
          index={i}
          totalCount={graveyardItems.length}
        />
      ))}
    </div>
  );
};
