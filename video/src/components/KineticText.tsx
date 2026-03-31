import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { fontFamily } from "../Root";

interface KineticTextProps {
  text: string;
  startFrame: number;
  fontSize?: number;
  color?: string;
  weight?: number;
  /** Adds aggressive scale overshoot — use for impact slams */
  impact?: boolean;
  style?: React.CSSProperties;
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  startFrame,
  fontSize = 80,
  color = "#FFFFFF",
  weight = 800,
  impact = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - startFrame);

  const sp = spring({
    frame: localFrame,
    fps,
    config: impact
      ? { damping: 14, stiffness: 300 }   // snappy overshoot
      : { damping: 18, stiffness: 200 },  // reduced for secondary elements
  });

  // Scale: overshoots slightly past 1.0 then settles — the "slam" feel
  const scale = interpolate(sp, [0, 1], [0.55, 1]);

  // Opacity: fast fade-in
  const opacity = interpolate(
    spring({ frame: localFrame, fps, config: { damping: 200 } }),
    [0, 1],
    [0, 1]
  );

  // Motion blur: blur clears as element enters
  const blur = interpolate(sp, [0, 0.6, 1], [8, 2, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        fontFamily,
        fontSize,
        fontWeight: weight,
        color,
        display: "inline-block",
        transform: `scale(${scale})`,
        opacity,
        filter: `blur(${blur}px)`,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        ...style,
      }}
    >
      {text}
    </span>
  );
};
