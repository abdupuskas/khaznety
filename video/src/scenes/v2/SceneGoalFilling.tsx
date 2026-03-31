import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PhoneFrame } from "../../components/PhoneFrame";
import { GoalProgressCard } from "../../components/GoalProgressCard";
import { CounterNumber } from "../../components/CounterNumber";
import { fontFamily } from "../../Root";

export const SceneGoalFilling: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneSpring = spring({
    frame: Math.max(0, frame),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const phoneY = interpolate(phoneSpring, [0, 1], [60, 0]);

  // Large % counter outside phone — appears after bar starts moving
  const pctOpacity = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 200 },
  });

  // Months remaining label
  const monthsOpacity = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { damping: 200 },
  });

  // Celebration glow ring at frame 150
  // 🔊 SOUND: success-ding.mp3 at frame 150
  const celebrationSpring = spring({
    frame: Math.max(0, frame - 150),
    fps,
    config: { damping: 10, stiffness: 100 },
  });
  const glowOpacity = interpolate(
    Math.min(celebrationSpring, 1),
    [0, 0.5, 1],
    [0, 0.4, 0]
  );
  const glowScale = interpolate(celebrationSpring, [0, 1], [1, 1.15]);

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
      {/* Celebration glow ring behind phone */}
      <div
        style={{
          position: "absolute",
          width: 520,
          height: 1050,
          borderRadius: 70,
          background: "radial-gradient(circle, rgba(26,122,82,0.15) 0%, transparent 70%)",
          opacity: glowOpacity,
          transform: `scale(${glowScale})`,
          pointerEvents: "none",
        }}
      />

      {/* Phone */}
      <div
        style={{
          transform: `translateY(${phoneY}px)`,
          opacity: phoneSpring,
          marginBottom: 24,
          position: "relative",
        }}
      >
        <PhoneFrame>
          <div style={{ height: 58 }} />
          <div style={{ padding: "6px 16px 8px", direction: "rtl", fontFamily }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>
              أهدافي 🎯
            </div>
          </div>

          {/* Goal fills from 0 → 33,500 (67%) over 120 frames */}
          <GoalProgressCard
            goalName="رحلة أوروبا 🌍"
            targetAmount={50000}
            currentAmount={33500}
            animStartFrame={0}
            currency="EGP"
            monthlyContribution={3000}
          />
        </PhoneFrame>
      </div>

      {/* Large % display outside phone */}
      <div
        style={{
          opacity: pctOpacity,
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        <CounterNumber
          from={0}
          to={67}
          startFrame={40}
          suffix="٪"
          fontSize={80}
          color="#1A7A52"
          fontWeight={800}
          damping={200}
          stiffness={60}
        />
      </div>

      {/* Months remaining */}
      <div
        style={{
          fontSize: 16,
          color: "#9C9485",
          marginTop: 8,
          opacity: monthsOpacity,
          direction: "rtl",
          fontFamily,
          textAlign: "center",
        }}
      >
        كمان ٥ شهور وتوصل 🎯
      </div>
    </div>
  );
};
