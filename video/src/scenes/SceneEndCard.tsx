import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, Img } from "remotion";
import { AnimatedText } from "../components/AnimatedText";
import { fontFamily } from "../Root";

export const SceneEndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Icon entrance — scale + slight rotation
  const iconSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const iconScale = interpolate(iconSpring, [0, 1], [0.3, 1]);
  const iconRotate = interpolate(iconSpring, [0, 1], [-8, 0]);

  // Shadow fade-in slightly after icon
  const shadowOpacity = interpolate(
    spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 200 } }),
    [0, 1],
    [0, 1]
  );

  // Sub-label (App Store hint)
  const subLabelOpacity = interpolate(
    spring({ frame: Math.max(0, frame - 52), fps, config: { damping: 200 } }),
    [0, 1],
    [0, 1]
  );

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
        gap: 0,
        fontFamily,
      }}
    >
      {/* App icon */}
      <div
        style={{
          transform: `scale(${iconScale}) rotate(${iconRotate}deg)`,
          boxShadow: `0 20px 60px rgba(26,122,82,${0.3 * shadowOpacity})`,
          borderRadius: 44,
          overflow: "hidden",
          width: 200,
          height: 200,
          marginBottom: 28,
        }}
      >
        <Img
          src={staticFile("icon.png")}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#1A1A1A",
          textAlign: "center",
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
          marginBottom: 8,
        }}
      >
        <AnimatedText
          text="Your budget, on autopilot."
          startFrame={40}
          wordsPerSecond={3}
        />
      </div>

      {/* Sub-label */}
      <div
        style={{
          fontSize: 13,
          color: "#9C9485",
          opacity: subLabelOpacity,
          letterSpacing: "0.04em",
        }}
      >
        Available on the App Store
      </div>
    </div>
  );
};
