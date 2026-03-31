import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { fontFamily } from "../../Root";

export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "EGP" label fades in quickly
  const egpOpacity = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 200 },
  });

  // "0.00" slams in with aggressive spring
  const numberSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 14, stiffness: 300 },
  });
  const numberScale = interpolate(numberSpring, [0, 1], [1.4, 1]);
  const numberOpacity = interpolate(
    spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 200 } }),
    [0, 1],
    [0, 1]
  );

  // Subtitle slides up from below
  const subtitleSpring = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 20, stiffness: 180 },
  });
  const subtitleY = interpolate(subtitleSpring, [0, 1], [20, 0]);

  return (
    // 🔊 SOUND: bank-ping.mp3 at frame 0
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#0F0F0F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        direction: "rtl",
      }}
    >
      {/* EGP label */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: "#C0392B",
          opacity: egpOpacity,
          letterSpacing: "0.05em",
          marginBottom: 8,
        }}
      >
        EGP
      </div>

      {/* 0.00 — the painful number */}
      <div
        style={{
          fontSize: 120,
          fontWeight: 800,
          color: "#FFFFFF",
          lineHeight: 1,
          letterSpacing: "-0.04em",
          textShadow: "0 0 40px rgba(192,57,43,0.5)",
          transform: `scale(${numberScale})`,
          opacity: numberOpacity,
        }}
      >
        0.00
      </div>

      {/* Subtitle: 15 days of the month remaining */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 400,
          color: "rgba(255,255,255,0.55)",
          marginTop: 24,
          textAlign: "center",
          direction: "rtl",
          opacity: subtitleSpring,
          transform: `translateY(${subtitleY}px)`,
          fontFamily,
        }}
      >
        فضل ١٥ يوم من الشهر
      </div>
    </div>
  );
};
