import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { fontFamily } from "../Root";

interface CounterNumberProps {
  from?: number;
  to: number;
  startFrame: number;
  /** Higher damping = slower, more dramatic settle */
  damping?: number;
  stiffness?: number;
  prefix?: string;
  suffix?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  style?: React.CSSProperties;
}

export const CounterNumber: React.FC<CounterNumberProps> = ({
  from = 0,
  to,
  startFrame,
  damping = 200,
  stiffness = 80,
  prefix = "",
  suffix = "",
  fontSize = 30,
  color = "#FFFFFF",
  fontWeight = 700,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - startFrame);

  const progress = spring({
    frame: localFrame,
    fps,
    config: { damping, stiffness },
  });

  const value = Math.round(interpolate(progress, [0, 1], [from, to]));

  return (
    <span
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        color,
        letterSpacing: "-0.02em",
        ...style,
      }}
    >
      {prefix}
      {value.toLocaleString("en-EG")}
      {suffix}
    </span>
  );
};
