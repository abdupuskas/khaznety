import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PhoneFrame } from "../../components/PhoneFrame";
import { GoalProgressCard } from "../../components/GoalProgressCard";
import { AnimatedText } from "../../components/AnimatedText";
import { fontFamily } from "../../Root";

export const SceneGoalSetup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneSpring = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const phoneY = interpolate(phoneSpring, [0, 1], [80, 0]);

  const headerOpacity = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 200 },
  });

  const contributionOpacity = spring({
    frame: Math.max(0, frame - 60),
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
        fontFamily,
      }}
    >
      <div
        style={{
          transform: `translateY(${phoneY}px)`,
          opacity: phoneSpring,
          marginBottom: 28,
        }}
      >
        <PhoneFrame>
          <div style={{ height: 58 }} />

          {/* Screen header */}
          <div
            style={{
              padding: "6px 16px 8px",
              opacity: headerOpacity,
              direction: "rtl",
              fontFamily,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>
              أهدافي 🎯
            </div>
          </div>

          {/* Goal card — starts at 0% */}
          <GoalProgressCard
            goalName="رحلة أوروبا 🌍"
            targetAmount={50000}
            currentAmount={0}
            animStartFrame={20}
            currency="EGP"
            monthlyContribution={3000}
          />

          {/* Monthly contribution note */}
          <div
            style={{
              margin: "10px 14px 0",
              background: "#EAF4EE",
              borderRadius: 12,
              padding: "10px 14px",
              opacity: contributionOpacity,
              direction: "rtl",
              fontFamily,
            }}
          >
            <div style={{ fontSize: 11, color: "#1A7A52", fontWeight: 600 }}>
              💰 مساهمة شهرية: EGP 3,000
            </div>
            <div style={{ fontSize: 10, color: "#5C5850", marginTop: 2 }}>
              كمان ١٧ شهر وتوصل لهدفك
            </div>
          </div>
        </PhoneFrame>
      </div>

      {/* Caption */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#1A1A1A",
          textAlign: "center",
          lineHeight: 1.3,
          direction: "rtl",
          fontFamily,
        }}
      >
        <AnimatedText
          text="حدد هدفك... وخلي Khaznety يوصلك"
          startFrame={80}
          wordsPerSecond={2.5}
        />
      </div>
    </div>
  );
};
