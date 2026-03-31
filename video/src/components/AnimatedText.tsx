import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { fontFamily } from "../Root";

interface AnimatedTextProps {
  text: string;
  startFrame: number;
  wordsPerSecond?: number;
  style?: React.CSSProperties;
  wordStyle?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  startFrame,
  wordsPerSecond = 2.5,
  style,
  wordStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <span style={{ fontFamily, ...style }}>
      {words.map((word, i) => {
        const wordStartFrame =
          startFrame + Math.round((i / wordsPerSecond) * fps);
        const wp = spring({
          frame: Math.max(0, frame - wordStartFrame),
          fps,
          config: { damping: 20, stiffness: 200 },
        });
        return (
          <span
            key={i}
            style={{
              opacity: wp,
              transform: `translateY(${interpolate(wp, [0, 1], [10, 0])}px)`,
              display: "inline-block",
              marginRight: "0.25em",
              ...wordStyle,
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};
