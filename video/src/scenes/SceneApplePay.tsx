import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PhoneFrame } from "../components/PhoneFrame";
import { AnimatedText } from "../components/AnimatedText";
import { fontFamily } from "../Root";

const ApplePaySheet: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Sheet rises on entry
  const riseSpring = spring({
    frame: Math.max(0, frame),
    fps,
    config: { damping: 20, stiffness: 180 },
  });
  // Sheet dismisses around frame 45
  const dismissSpring = spring({
    frame: Math.max(0, frame - 45),
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const translateY = interpolate(riseSpring, [0, 1], [320, 0])
    + interpolate(dismissSpring, [0, 1], [0, 340]);

  // Content fades in after sheet rises
  const contentOpacity = interpolate(
    spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 200 } }),
    [0, 1],
    [0, 1]
  );

  // Checkmark
  const checkSpring = spring({
    frame: Math.max(0, frame - 28),
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        transform: `translateY(${translateY}px)`,
        background: "#1C1C1E",
        borderRadius: "24px 24px 0 0",
        padding: "20px 20px 32px",
        fontFamily,
      }}
    >
      {/* Handle */}
      <div
        style={{
          width: 36,
          height: 4,
          background: "rgba(255,255,255,0.3)",
          borderRadius: 2,
          margin: "0 auto 20px",
        }}
      />

      <div style={{ opacity: contentOpacity }}>
        {/* Apple Pay logo text */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#FFFFFF",
            textAlign: "center",
            marginBottom: 6,
            letterSpacing: "-0.02em",
          }}
        >
           Pay
        </div>

        <div
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          Noon.com
        </div>

        {/* Amount */}
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "#FFFFFF",
            textAlign: "center",
            letterSpacing: "-0.02em",
            marginBottom: 20,
          }}
        >
          EGP 350.00
        </div>

        {/* Checkmark */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            transform: `scale(${checkSpring})`,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "#1A7A52",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: "#FFF",
            }}
          >
            ✓
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            Payment successful
          </div>
        </div>
      </div>
    </div>
  );
};

const VaultDashboardPreview: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // Appears after sheet dismisses (~frame 60)
  const dashOpacity = spring({
    frame: Math.max(0, frame - 60),
    fps,
    config: { damping: 200 },
  });

  // Transaction row pops in
  const txSpring = spring({
    frame: Math.max(0, frame - 70),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const txY = interpolate(txSpring, [0, 1], [20, 0]);

  // Category card slides in from right
  const cardSpring = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const cardX = interpolate(cardSpring, [0, 1], [60, 0]);

  // Progress bar fill
  const barSpring = spring({
    frame: Math.max(0, frame - 90),
    fps,
    config: { damping: 200, stiffness: 80 },
  });
  const barWidth = interpolate(barSpring, [0, 1], [0, 58]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#F0EEE9",
        opacity: dashOpacity,
        fontFamily,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "64px 14px 10px",
          fontSize: 16,
          fontWeight: 700,
          color: "#1A1A1A",
        }}
      >
        Khaznety
      </div>

      {/* Transaction logged row */}
      <div
        style={{
          margin: "0 14px 12px",
          background: "#FAFAF8",
          borderRadius: 14,
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: txSpring,
          transform: `translateY(${txY}px)`,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "#EAF4EE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          🛍️
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
            Noon.com
          </div>
          <div style={{ fontSize: 11, color: "#9C9485" }}>Shopping · now</div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#C0392B" }}>
          −EGP 350
        </div>
      </div>

      {/* Category card slides in */}
      <div
        style={{
          margin: "0 14px",
          background: "#FAFAF8",
          borderRadius: 14,
          padding: "14px 14px",
          opacity: cardSpring,
          transform: `translateX(${cardX}px)`,
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🛍️</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
              Shopping
            </span>
          </div>
          <span style={{ fontSize: 12, color: "#9C9485" }}>EGP 1,000</span>
        </div>
        {/* Progress bar */}
        <div
          style={{
            height: 5,
            background: "#E4DDD2",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${barWidth}%`,
              background: "#1A7A52",
              borderRadius: 3,
            }}
          />
        </div>
        <div
          style={{ fontSize: 11, color: "#9C9485", marginTop: 4 }}
        >
          EGP 580 left
        </div>
      </div>
    </div>
  );
};

export const SceneApplePay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone entrance
  const phoneSpring = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const phoneY = interpolate(phoneSpring, [0, 1], [60, 0]);

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
      <div
        style={{
          transform: `translateY(${phoneY}px)`,
          opacity: phoneSpring,
          marginBottom: 32,
        }}
      >
        <PhoneFrame>
          {/* Base dashboard visible through the sheet */}
          <VaultDashboardPreview frame={frame} fps={fps} />
          {/* Apple Pay sheet overlaid */}
          <ApplePaySheet frame={frame} fps={fps} />
        </PhoneFrame>
      </div>

      {/* Caption */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#1A1A1A",
          textAlign: "center",
        }}
      >
        <AnimatedText
          text="Apple Pay? Tracked. ✓"
          startFrame={105}
          wordsPerSecond={3.5}
        />
      </div>
    </div>
  );
};
