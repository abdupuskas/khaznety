import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PhoneFrame } from "../../components/PhoneFrame";
import { HeroCard } from "../../components/HeroCard";
import { KineticText } from "../../components/KineticText";
import { fontFamily } from "../../Root";

// SMS notification banner dropping over the live Khaznety app
const SMSBannerOverApp: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // 🔊 SOUND: notification-ping.mp3 at frame 15
  const bannerSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const translateY = interpolate(bannerSpring, [0, 1], [-90, 0]);

  // 🔊 SOUND: success-chime.mp3 at frame 30
  const badgeSpring = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 20, stiffness: 260 },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 58,
        left: 12,
        right: 12,
        transform: `translateY(${translateY}px)`,
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(20px)",
        borderRadius: 20,
        padding: "10px 12px 12px",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        boxShadow: "0 6px 24px rgba(0,0,0,0.14)",
        fontFamily,
        zIndex: 20,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: "#C8102E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          fontWeight: 700,
          color: "#FFF",
          flexShrink: 0,
        }}
      >
        CIB
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>CIB Bank</span>
          <span style={{ fontSize: 10, color: "#9C9485" }}>now</span>
        </div>
        <div style={{ fontSize: 11, color: "#5C5850", lineHeight: 1.35 }}>
          تم خصم ٨٥٠ج.م من حسابك في Carrefour
        </div>
        {/* Instantly tracked — no user action */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginTop: 5,
            opacity: badgeSpring,
            transform: `scale(${interpolate(badgeSpring, [0, 1], [0.7, 1])})`,
          }}
        >
          <div
            style={{
              width: 15,
              height: 15,
              borderRadius: "50%",
              background: "#1A7A52",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              color: "#FFF",
              fontWeight: 700,
            }}
          >
            ✓
          </div>
          <span style={{ fontSize: 10, color: "#1A7A52", fontWeight: 600 }}>
            Added to Khaznety automatically
          </span>
        </div>
      </div>
    </div>
  );
};

// New transaction row sliding into the recent list
const NewTransactionRow: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const rowSpring = spring({
    frame: Math.max(0, frame - 55),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const translateY = interpolate(rowSpring, [0, 1], [-24, 0]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 14px",
        gap: 10,
        opacity: rowSpring,
        transform: `translateY(${translateY}px)`,
        background: "#EAF4EE",
        fontFamily,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "#EAF4EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        🛒
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>Carrefour</div>
        <div style={{ fontSize: 10, color: "#9C9485", marginTop: 1 }}>
          Groceries · Just now
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#C0392B" }}>−EGP 850</div>
        <div style={{ fontSize: 9, color: "#1A7A52", fontWeight: 600, marginTop: 1 }}>
          ✓ auto
        </div>
      </div>
    </div>
  );
};

export const SceneMagic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneSpring = spring({
    frame: Math.max(0, frame),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const phoneY = interpolate(phoneSpring, [0, 1], [80, 0]);

  const sectionOpacity = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 200 },
  });

  const subOpacity = spring({
    frame: Math.max(0, frame - 80),
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
          marginBottom: 24,
        }}
      >
        <PhoneFrame>
          {/* Khaznety app is already open — warm background */}
          <div style={{ position: "absolute", inset: 0, background: "#F0EEE9" }} />

          {/* Status bar area */}
          <div style={{ height: 58 }} />

          {/* App header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "2px 14px 6px",
              opacity: sectionOpacity,
              fontFamily,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#EAF4EE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#1A7A52",
                marginRight: 8,
              }}
            >
              J
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#9C9485" }}>Good morning,</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>James</div>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#FAFAF8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🔔
            </div>
          </div>

          {/* Hero balance card */}
          <HeroCard
            animStartFrame={5}
            targetBalance={18200}
            month="March 2026"
            stats={[
              { label: "Spent", amount: "EGP 6,800" },
              { label: "Income", amount: "EGP 25,000" },
              { label: "Left", amount: "EGP 18,200" },
            ]}
          />

          {/* Recent transactions section */}
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "#9C9485",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "8px 16px 2px",
              opacity: sectionOpacity,
              fontFamily,
            }}
          >
            Recent
          </div>

          {/* Transaction list — new row slides in at top */}
          <div
            style={{
              margin: "0 14px",
              background: "#FAFAF8",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {/* New Carrefour row slides in */}
            <NewTransactionRow frame={frame} fps={fps} />
            <div style={{ height: 1, background: "#F0EEE9", margin: "0 14px" }} />
            {/* Pre-existing rows */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 14px",
                gap: 10,
                opacity: sectionOpacity,
                fontFamily,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#FEF3C7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                ☕
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
                  Starbucks
                </div>
                <div style={{ fontSize: 10, color: "#9C9485", marginTop: 1 }}>
                  Eating out · 2h ago
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#C0392B" }}>
                −EGP 120
              </div>
            </div>
          </div>

          {/* SMS banner drops over the live app */}
          <SMSBannerOverApp frame={frame} fps={fps} />
        </PhoneFrame>
      </div>

      {/* Caption */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <KineticText
          text="Zero manual entry."
          startFrame={10}
          fontSize={30}
          color="#1A1A1A"
          weight={700}
          impact={false}
        />
      </div>

      {/* Sub-caption */}
      <div
        style={{
          fontSize: 16,
          color: "#5C5850",
          opacity: subOpacity,
          textAlign: "center",
          maxWidth: 720,
          lineHeight: 1.5,
          fontFamily,
        }}
      >
        Khaznety reads your bank. You just live your life.
      </div>
    </div>
  );
};
