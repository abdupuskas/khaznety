import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { AnimatedText } from "../../components/AnimatedText";
import { fontFamily } from "../../Root";

// Interpolate between two hex colors via RGB
function lerpColor(
  from: [number, number, number],
  to: [number, number, number],
  t: number
): string {
  const r = Math.round(from[0] + (to[0] - from[0]) * t);
  const g = Math.round(from[1] + (to[1] - from[1]) * t);
  const b = Math.round(from[2] + (to[2] - from[2]) * t);
  return `rgb(${r},${g},${b})`;
}

export const SceneQuestion: React.FC = () => {
  const frame = useCurrentFrame();

  // Background transitions: #0A0A0A → #F0EEE9 over first 30 frames
  const bgT = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const bgColor = lerpColor([10, 10, 10], [240, 238, 233], bgT);

  // Text color also transitions: white → dark
  const textT = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });
  const textColor = lerpColor([255, 255, 255], [26, 26, 26], textT);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: bgColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        paddingLeft: 60,
        paddingRight: 60,
      }}
    >
      <div
        style={{
          fontSize: 34,
          fontWeight: 600,
          color: `rgb(${Math.round(26 + (240 - 26) * (1 - textT))},${Math.round(
            26
          )},${Math.round(26)})`,
          textAlign: "center",
          lineHeight: 1.4,
          maxWidth: 800,
          fontFamily,
        }}
      >
        <AnimatedText
          text="What if it just tracked itself?"
          startFrame={20}
          wordsPerSecond={3}
          style={{ color: `rgb(26,26,26)` }}
        />
      </div>
    </div>
  );
};
