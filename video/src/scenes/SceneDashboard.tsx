import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PhoneFrame } from "../components/PhoneFrame";
import { HeroCard } from "../components/HeroCard";
import { CategoryRow } from "../components/CategoryRow";
import { AnimatedText } from "../components/AnimatedText";
import { fontFamily } from "../Root";

const FloatingTabBarReplica: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const tabSpring = spring({
    frame: Math.max(0, frame - 140),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const translateY = interpolate(tabSpring, [0, 1], [60, 0]);

  const tabs = [
    { icon: "⌂", label: "Home", active: true },
    { icon: "◑", label: "Budget", active: false },
    { icon: "↗", label: "Trends", active: false },
    { icon: "↺", label: "Subs", active: false },
    { icon: "◎", label: "Profile", active: false },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: `translateX(-50%) translateY(${translateY}px)`,
        opacity: tabSpring,
        display: "flex",
        alignItems: "center",
        background: "rgba(250,248,244,0.72)",
        borderRadius: 9999,
        border: "0.5px solid rgba(212,205,194,0.6)",
        paddingTop: 6,
        paddingBottom: 6,
        paddingLeft: 8,
        paddingRight: 8,
        gap: 2,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        fontFamily,
        zIndex: 20,
      }}
    >
      {tabs.map((tab) =>
        tab.active ? (
          <div
            key={tab.label}
            style={{
              display: "flex",
              alignItems: "center",
              height: 32,
              borderRadius: 9999,
              paddingLeft: 12,
              paddingRight: 12,
              gap: 5,
              background: "#FAFAF8",
              border: "0.5px solid #E4DDD2",
            }}
          >
            <span style={{ fontSize: 14, color: "#1A7A52" }}>{tab.icon}</span>
            <span
              style={{ fontSize: 12, fontWeight: 600, color: "#1A7A52" }}
            >
              {tab.label}
            </span>
          </div>
        ) : (
          <div
            key={tab.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 32,
              width: 36,
            }}
          >
            <span style={{ fontSize: 14, color: "#9C9485" }}>{tab.icon}</span>
          </div>
        )
      )}
    </div>
  );
};

export const SceneDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone entrance
  const phoneSpring = spring({
    frame: Math.max(0, frame),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const phoneY = interpolate(phoneSpring, [0, 1], [80, 0]);

  // Header fade
  const headerOpacity = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 200 },
  });

  // Section label
  const sectionOpacity = spring({
    frame: Math.max(0, frame - 70),
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
      {/* Phone mockup */}
      <div
        style={{
          transform: `translateY(${phoneY}px)`,
          opacity: phoneSpring,
          marginBottom: 28,
        }}
      >
        <PhoneFrame>
          {/* Status bar spacing */}
          <div style={{ height: 58 }} />

          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "4px 14px 8px",
              opacity: headerOpacity,
              fontFamily,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "#EAF4EE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#1A7A52",
                marginRight: 10,
              }}
            >
              A
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "#9C9485" }}>
                Good morning,
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                Abdullah
              </div>
            </div>
            {/* Bell */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "#FAFAF8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              🔔
            </div>
          </div>

          {/* Hero card */}
          <HeroCard animStartFrame={25} />

          {/* Section label */}
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#9C9485",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "10px 16px 4px",
              opacity: sectionOpacity,
              fontFamily,
            }}
          >
            Budgets
          </div>

          {/* Budget rows */}
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
              name="Food & Groceries"
              pct={0.65}
              spentLabel="EGP 6,500 spent"
              budgetLabel="EGP 10,000"
              animDelay={80}
            />
            <div style={{ height: 1, background: "#F0EEE9", margin: "0 14px" }} />
            <CategoryRow
              icon="🚗"
              iconBg="#EAF4EE"
              name="Transport"
              pct={0.42}
              spentLabel="EGP 2,100 spent"
              budgetLabel="EGP 5,000"
              animDelay={93}
            />
            <div style={{ height: 1, background: "#F0EEE9", margin: "0 14px" }} />
            <CategoryRow
              icon="🛍️"
              iconBg="#FEE2E2"
              name="Shopping"
              pct={0.88}
              spentLabel="EGP 8,800 spent"
              budgetLabel="EGP 10,000"
              animDelay={106}
            />
          </div>

          {/* Floating tab bar */}
          <FloatingTabBarReplica frame={frame} fps={fps} />
        </PhoneFrame>
      </div>

      {/* Caption */}
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "#1A1A1A",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        <AnimatedText
          text="Everything, in one place."
          startFrame={155}
          wordsPerSecond={3}
        />
      </div>
    </div>
  );
};
