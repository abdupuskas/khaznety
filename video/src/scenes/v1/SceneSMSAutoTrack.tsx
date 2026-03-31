import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PhoneFrame } from "../../components/PhoneFrame";
import { AnimatedText } from "../../components/AnimatedText";
import { fontFamily } from "../../Root";

const SMSBannerAr: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // 🔊 SOUND: notification-ping.mp3 at frame 10
  const bannerSpring = spring({
    frame: Math.max(0, frame - 10),
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
        direction: "rtl",
        zIndex: 10,
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
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>CIB Bank</span>
          <span style={{ fontSize: 11, color: "#9C9485" }}>الآن</span>
        </div>
        <div style={{ fontSize: 12, color: "#5C5850", lineHeight: 1.4, direction: "rtl" }}>
          تم خصم ٨٥٠ج.م من حسابك في Carrefour
        </div>
      </div>
    </div>
  );
};

const VaultTransactionRow: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  // 🔊 SOUND: success-chime.mp3 at frame 65
  const rowSpring = spring({
    frame: Math.max(0, frame - 55),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const translateY = interpolate(rowSpring, [0, 1], [20, 0]);

  const badgeSpring = spring({
    frame: Math.max(0, frame - 68),
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 170,
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
        direction: "rtl",
      }}
    >
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
      <div style={{ flex: 1, direction: "rtl" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>Carrefour</div>
        <div style={{ fontSize: 11, color: "#9C9485", marginTop: 2 }}>مصروف يومي · الآن</div>
      </div>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#C0392B" }}>−٨٥٠ ج.م</div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 3,
            marginTop: 3,
            opacity: badgeSpring,
            transform: `scale(${badgeSpring})`,
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
          <span style={{ fontSize: 10, color: "#1A7A52", fontWeight: 600 }}>اتسجل</span>
        </div>
      </div>
    </div>
  );
};

export const SceneSMSAutoTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneFade = spring({ frame, fps, config: { damping: 200 } });

  const phoneSpring = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const phoneY = interpolate(phoneSpring, [0, 1], [60, 0]);

  // Arrow/line drawing from SMS to Khaznety (simplified — opacity reveal)
  const arrowOpacity = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 20, stiffness: 200 },
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
        opacity: sceneFade,
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
          {/* Lock screen background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, #1A1A2E 0%, #16213E 60%, #0F3460 100%)",
            }}
          />

          {/* Lock screen time */}
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
            <div style={{ fontSize: 52, fontWeight: 300, color: "#FFF", lineHeight: 1 }}>
              9:41
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 5 }}>
              الخميس، ٢٦ مارس
            </div>
          </div>

          <SMSBannerAr frame={frame} fps={fps} />
          <VaultTransactionRow frame={frame} fps={fps} />
        </PhoneFrame>
      </div>

      {/* Arrow indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 320,
          fontSize: 13,
          color: "#1A7A52",
          fontWeight: 600,
          opacity: arrowOpacity,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "#EAF4EE",
          borderRadius: 9999,
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 6,
          paddingBottom: 6,
          direction: "rtl",
          fontFamily,
        }}
      >
        ↓ تم التصنيف تلقائياً
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
          text="SMS من البنك... بيتسجل لوحده"
          startFrame={80}
          wordsPerSecond={2.5}
        />
      </div>
    </div>
  );
};
