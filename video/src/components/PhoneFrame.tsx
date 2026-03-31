import React from "react";

// iPhone 15 Pro proportions — scaled to fit 1080px wide canvas
// Base logical size: 393×852 (display points), rendered at ~2x for sharpness
// We use 460×996 as our "frame" size inside the 1080×1920 canvas
export const PHONE_WIDTH = 460;
export const PHONE_HEIGHT = 996;

interface PhoneFrameProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, style }) => {
  const BORDER_RADIUS = 60;
  const SHELL_BORDER = 2;
  const SCREEN_INSET = 9;
  const SCREEN_RADIUS = BORDER_RADIUS - SCREEN_INSET;

  const DYNAMIC_ISLAND_W = 130;
  const DYNAMIC_ISLAND_H = 36;

  return (
    <div
      style={{
        width: PHONE_WIDTH,
        height: PHONE_HEIGHT,
        borderRadius: BORDER_RADIUS,
        background: "linear-gradient(160deg, #2A2A2A 0%, #1A1A1A 100%)",
        border: `${SHELL_BORDER}px solid #3A3A3A`,
        position: "relative",
        boxShadow:
          "0 40px 120px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        flexShrink: 0,
        ...style,
      }}
    >
      {/* Side buttons */}
      {/* Power button — right side */}
      <div
        style={{
          position: "absolute",
          right: -4,
          top: 160,
          width: 4,
          height: 80,
          background: "#2A2A2A",
          borderRadius: "0 3px 3px 0",
        }}
      />
      {/* Volume up — left */}
      <div
        style={{
          position: "absolute",
          left: -4,
          top: 130,
          width: 4,
          height: 50,
          background: "#2A2A2A",
          borderRadius: "3px 0 0 3px",
        }}
      />
      {/* Volume down — left */}
      <div
        style={{
          position: "absolute",
          left: -4,
          top: 196,
          width: 4,
          height: 50,
          background: "#2A2A2A",
          borderRadius: "3px 0 0 3px",
        }}
      />

      {/* Screen area */}
      <div
        style={{
          position: "absolute",
          top: SCREEN_INSET,
          left: SCREEN_INSET,
          right: SCREEN_INSET,
          bottom: SCREEN_INSET,
          borderRadius: SCREEN_RADIUS,
          background: "#F0EEE9",
          overflow: "hidden",
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: "50%",
            transform: "translateX(-50%)",
            width: DYNAMIC_ISLAND_W,
            height: DYNAMIC_ISLAND_H,
            background: "#000",
            borderRadius: DYNAMIC_ISLAND_H / 2,
            zIndex: 10,
          }}
        />

        {/* Screen content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
