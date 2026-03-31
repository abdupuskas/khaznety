import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PhoneFrame } from "../../components/PhoneFrame";
import { CategoryRow } from "../../components/CategoryRow";
import { AnimatedText } from "../../components/AnimatedText";
import { fontFamily } from "../../Root";

const SummaryDonut: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const progress = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 30, stiffness: 100 },
  });
  const pct = interpolate(progress, [0, 1], [0, 0.62]); // 62% spent

  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "12px 16px 8px",
        fontFamily,
      }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#EEECE7"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1A7A52"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
          />
        </svg>
        {/* Center text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>
            {Math.round(pct * 100)}%
          </div>
          <div style={{ fontSize: 8, color: "#9C9485" }}>مصروف</div>
        </div>
      </div>
    </div>
  );
};

export const SceneBudgetOverview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneSpring = spring({
    frame: Math.max(0, frame),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const phoneY = interpolate(phoneSpring, [0, 1], [50, 0]);

  const headerOpacity = spring({
    frame: Math.max(0, frame - 8),
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

          {/* Screen title */}
          <div
            style={{
              padding: "6px 16px 4px",
              opacity: headerOpacity,
              direction: "rtl",
              fontFamily,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1A1A1A" }}>
              الميزانية
            </div>
          </div>

          {/* Donut ring */}
          <SummaryDonut frame={frame} fps={fps} />

          {/* Section label */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#9C9485",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "4px 16px 4px",
              fontFamily,
              direction: "rtl",
              textAlign: "right",
              opacity: spring({ frame: Math.max(0, frame - 30), fps, config: { damping: 200 } }),
            }}
          >
            التفاصيل
          </div>

          {/* 4 categories — organized, legible */}
          <div
            style={{
              margin: "0 14px",
              background: "#FAFAF8",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <CategoryRow
              icon="🍔"
              iconBg="#FEF3C7"
              name="طعام ومشتروات"
              pct={0.65}
              spentLabel="٦٫٥ألف"
              budgetLabel="١٠ألف"
              animDelay={40}
            />
            <div style={{ height: 1, background: "#F0EEE9", margin: "0 14px" }} />
            <CategoryRow
              icon="🚗"
              iconBg="#EAF4EE"
              name="مواصلات"
              pct={0.42}
              spentLabel="٢٫١ألف"
              budgetLabel="٥ألف"
              animDelay={55}
            />
            <div style={{ height: 1, background: "#F0EEE9", margin: "0 14px" }} />
            <CategoryRow
              icon="🛍️"
              iconBg="#FEE2E2"
              name="تسوق"
              pct={0.88}
              spentLabel="٨٫٨ألف"
              budgetLabel="١٠ألف"
              animDelay={70}
            />
            <div style={{ height: 1, background: "#F0EEE9", margin: "0 14px" }} />
            <CategoryRow
              icon="💊"
              iconBg="#EAF4EE"
              name="صحة"
              pct={0.3}
              spentLabel="٩٠٠"
              budgetLabel="٣ألف"
              animDelay={85}
            />
          </div>
        </PhoneFrame>
      </div>

      {/* Caption */}
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: "#1A1A1A",
          textAlign: "center",
          lineHeight: 1.3,
          direction: "rtl",
          fontFamily,
        }}
      >
        <AnimatedText
          text="عارف فلوسك. في أي وقت."
          startFrame={90}
          wordsPerSecond={2.5}
        />
      </div>
    </div>
  );
};
