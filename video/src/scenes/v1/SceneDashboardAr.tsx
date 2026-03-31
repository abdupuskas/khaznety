import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PhoneFrame } from "../../components/PhoneFrame";
import { HeroCard } from "../../components/HeroCard";
import { CategoryRow } from "../../components/CategoryRow";
import { AnimatedText } from "../../components/AnimatedText";
import { fontFamily } from "../../Root";

const FloatingTabBarAr: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const tabSpring = spring({
    frame: Math.max(0, frame - 130),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const translateY = interpolate(tabSpring, [0, 1], [60, 0]);

  const tabs = [
    { icon: "⌂", label: "الرئيسية", active: true },
    { icon: "◑", label: "الميزانية", active: false },
    { icon: "↗", label: "إحصاء", active: false },
    { icon: "↺", label: "اشتراكات", active: false },
    { icon: "◎", label: "الإعدادات", active: false },
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
        direction: "rtl",
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
            <span style={{ fontSize: 11, fontWeight: 600, color: "#1A7A52", fontFamily }}>
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

export const SceneDashboardAr: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneSpring = spring({
    frame: Math.max(0, frame),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const phoneY = interpolate(phoneSpring, [0, 1], [80, 0]);

  const headerOpacity = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 200 },
  });

  const sectionOpacity = spring({
    frame: Math.max(0, frame - 65),
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

          {/* Header row — Arabic RTL */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "4px 14px 8px",
              opacity: headerOpacity,
              fontFamily,
              direction: "rtl",
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
                marginLeft: 10,
              }}
            >
              أ
            </div>
            <div style={{ flex: 1, direction: "rtl" }}>
              <div style={{ fontSize: 12, color: "#9C9485" }}>صباح الخير،</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                أحمد
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

          {/* Hero card — Arabic labels */}
          <HeroCard
            animStartFrame={20}
            targetBalance={24350}
            month="مارس ٢٠٢٦"
            stats={[
              { label: "مصروف", amount: "٨٫٤ألف" },
              { label: "واصل", amount: "٣٢٫٨ألف" },
              { label: "متبقي", amount: "٤٫٦ألف" },
            ]}
          />

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
              direction: "rtl",
              textAlign: "right",
            }}
          >
            الميزانيات
          </div>

          {/* Budget rows — Arabic labels */}
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
              spentLabel="٦٫٥ألف مصروف"
              budgetLabel="١٠ألف"
              animDelay={75}
            />
            <div style={{ height: 1, background: "#F0EEE9", margin: "0 14px" }} />
            <CategoryRow
              icon="🚗"
              iconBg="#EAF4EE"
              name="مواصلات"
              pct={0.42}
              spentLabel="٢٫١ألف مصروف"
              budgetLabel="٥ألف"
              animDelay={90}
            />
            <div style={{ height: 1, background: "#F0EEE9", margin: "0 14px" }} />
            <CategoryRow
              icon="🛍️"
              iconBg="#FEE2E2"
              name="تسوق"
              pct={0.88}
              spentLabel="٨٫٨ألف مصروف"
              budgetLabel="١٠ألف"
              animDelay={105}
            />
          </div>

          <FloatingTabBarAr frame={frame} fps={fps} />
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
          text="Khaznety بيحسبها عنك."
          startFrame={100}
          wordsPerSecond={2.5}
        />
      </div>
    </div>
  );
};
