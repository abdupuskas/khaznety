import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";
import { AnimatedText } from "../../components/AnimatedText";
import { fontFamily } from "../../Root";

export const SceneEndCardEn: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconSpring = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const iconScale = interpolate(iconSpring, [0, 1], [0.3, 1]);
  const iconRotate = interpolate(iconSpring, [0, 1], [-8, 0]);

  const shadowOpacity = interpolate(
    spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 200 } }),
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
          width: 180,
          height: 180,
          marginBottom: 24,
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
          fontSize: 26,
          fontWeight: 700,
          color: "#1A1A1A",
          textAlign: "center",
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}
      >
        <AnimatedText
          text="Your money. Finally clear."
          startFrame={20}
          wordsPerSecond={4}
        />
      </div>
    </div>
  );
};
