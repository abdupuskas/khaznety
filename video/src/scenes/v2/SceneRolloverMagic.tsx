import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { RolloverStack } from "../../components/RolloverStack";
import { AnimatedText } from "../../components/AnimatedText";
import { fontFamily } from "../../Root";

const MONTHS = [
  { month: "يناير", salary: 30000, spent: 27000, rollover: 3000, startFrame: 20 },
  { month: "فبراير", salary: 30000, spent: 27500, rollover: 2500, startFrame: 70 },
  { month: "مارس",  salary: 30000, spent: 26800, rollover: 3200, startFrame: 120 },
];

export const SceneRolloverMagic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = spring({ frame, fps, config: { damping: 200 } });

  const headerOpacity = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 200 },
  });

  const captionOpacity = spring({
    frame: Math.max(0, frame - 160),
    fps,
    config: { damping: 200 },
  });

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
        opacity: sceneFade,
        fontFamily,
        paddingLeft: 40,
        paddingRight: 40,
      }}
    >
      {/* Header label */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#9C9485",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 20,
          opacity: headerOpacity,
          direction: "rtl",
          textAlign: "center",
          fontFamily,
        }}
      >
        الفلوس الزيادة مش بتروح...
      </div>

      {/* Rollover stack component */}
      <RolloverStack months={MONTHS} currency="EGP" />

      {/* Caption */}
      <div
        style={{
          marginTop: 24,
          fontSize: 20,
          fontWeight: 600,
          color: "#1A1A1A",
          textAlign: "center",
          opacity: captionOpacity,
          direction: "rtl",
          fontFamily,
          lineHeight: 1.4,
        }}
      >
        <AnimatedText
          text="بتتراكم... في هدفك"
          startFrame={165}
          wordsPerSecond={2.5}
        />
      </div>
    </div>
  );
};
