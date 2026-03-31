import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PhoneFrame } from "../components/PhoneFrame";
import { AnimatedText } from "../components/AnimatedText";
import { fontFamily } from "../Root";

const SMSNotificationBanner: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const bannerSpring = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const translateY = interpolate(bannerSpring, [0, 1], [-90, 0]);

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 12,
        right: 12,
        transform: `translateY(${translateY}px)`,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        borderRadius: 20,
        padding: "12px 14px",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        fontFamily,
      }}
    >
      {/* CIB icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: "#C8102E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          color: "#FFF",
          flexShrink: 0,
        }}
      >
        CIB
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>
            CIB Bank
          </span>
          <span style={{ fontSize: 11, color: "#9C9485" }}>now</span>
        </div>
        <div style={{ fontSize: 12, color: "#5C5850", lineHeight: 1.4 }}>
          تم خصم ٨٥٠ج.م من حسابك في Carrefour
        </div>
      </div>
    </div>
  );
};

const TransactionRow: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const rowSpring = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const translateY = interpolate(rowSpring, [0, 1], [20, 0]);

  const checkSpring = spring({
    frame: Math.max(0, frame - 62),
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 180,
        left: 14,
        right: 14,
        background: "#FAFAF8",
        borderRadius: 16,
        padding: "14px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: rowSpring,
        transform: `translateY(${translateY}px)`,
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        fontFamily,
      }}
    >
      {/* Merchant icon */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: "#EAF4EE",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        🛒
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>
          Carrefour
        </div>
        <div style={{ fontSize: 11, color: "#9C9485", marginTop: 2 }}>
          Groceries · Just now
        </div>
      </div>
      {/* Amount */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#C0392B" }}>
          −EGP 850
        </div>
        {/* Checkmark badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 3,
            marginTop: 3,
            opacity: checkSpring,
            transform: `scale(${checkSpring})`,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: "#1A7A52",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              color: "#FFF",
              fontWeight: 700,
            }}
          >
            ✓
          </div>
          <span style={{ fontSize: 10, color: "#1A7A52", fontWeight: 600 }}>
            Tracked
          </span>
        </div>
      </div>
    </div>
  );
};

export const SceneSMS: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Overall scene fade-in
  const sceneFade = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  // Phone entrance
  const phoneSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const phoneY = interpolate(phoneSpring, [0, 1], [120, 0]);

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
        opacity: sceneFade,
        fontFamily,
      }}
    >
      {/* Phone mockup */}
      <div
        style={{
          transform: `translateY(${phoneY}px)`,
          opacity: phoneSpring,
          marginBottom: 32,
        }}
      >
        <PhoneFrame>
          {/* Lock screen background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, #1A1A2E 0%, #16213E 60%, #0F3460 100%)",
            }}
          />

          {/* Time on lock screen */}
          <div
            style={{
              position: "absolute",
              top: 80,
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily,
            }}
          >
            <div style={{ fontSize: 56, fontWeight: 300, color: "#FFF", lineHeight: 1 }}>
              9:41
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
              Thursday, March 26
            </div>
          </div>

          {/* SMS notification */}
          <SMSNotificationBanner frame={frame} fps={fps} />

          {/* Transaction row */}
          <TransactionRow frame={frame} fps={fps} />
        </PhoneFrame>
      </div>

      {/* Caption text */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#1A1A1A",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        <AnimatedText
          text="Bank SMS? Tracked. ✓"
          startFrame={75}
          wordsPerSecond={3.5}
          wordStyle={{ color: "#1A1A1A" }}
        />
      </div>
    </div>
  );
};
