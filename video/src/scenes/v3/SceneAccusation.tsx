import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { KineticText } from "../../components/KineticText";
import { fontFamily } from "../../Root";

export const SceneAccusation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "You quit." vertical shake — small oscillation after slam settles
  const shakeProgress = interpolate(frame, [18, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeY = Math.sin(shakeProgress * Math.PI * 3) * 3;

  // "Again." slams quickly — no long pause, just impact
  const againOpacity = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 200 },
  });

  // Sub-text fades in right after "Again." settles
  const subOpacity = spring({
    frame: Math.max(0, frame - 52),
    fps,
    config: { damping: 200 },
  });

  return (
    // 🔊 SOUND: impact-thud.mp3 at frame 5
    // 🔊 SOUND: impact-thud-low.mp3 at frame 35
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
        gap: 4,
      }}
    >
      {/* "You quit." */}
      <div style={{ transform: `translateY(${shakeY}px)` }}>
        <KineticText
          text="You quit."
          startFrame={5}
          fontSize={108}
          color="#FFFFFF"
          weight={800}
          impact
        />
      </div>

      {/* "Again." */}
      <div style={{ opacity: againOpacity }}>
        <KineticText
          text="Again."
          startFrame={35}
          fontSize={108}
          color="#C0392B"
          weight={800}
          impact
          style={{ textShadow: "0 0 30px rgba(192,57,43,0.4)" }}
        />
      </div>

      {/* Sub-text */}
      <div
        style={{
          fontSize: 18,
          color: "rgba(255,255,255,0.35)",
          marginTop: 16,
          opacity: subOpacity,
          letterSpacing: "0.02em",
          fontFamily,
        }}
      >
        3rd budget app this year.
      </div>
    </div>
  );
};
