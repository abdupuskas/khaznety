import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { fontFamily } from "../Root";
import { CounterNumber } from "./CounterNumber";

interface RolloverMonth {
  month: string;
  salary: number;
  spent: number;
  rollover: number;
  startFrame: number;
}

interface RolloverStackProps {
  months: RolloverMonth[];
  currency?: string;
}

const MonthCard: React.FC<{
  month: RolloverMonth;
  currency: string;
  index: number;
}> = ({ month, currency, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - month.startFrame);

  const sp = spring({
    frame: localFrame,
    fps,
    config: { damping: 20, stiffness: 200 },
  });

  const translateY = interpolate(sp, [0, 1], [30, 0]);

  // Fade earlier cards as newer ones appear — graveyard effect reversed (they stay readable but slightly dimmed)
  const agingOpacity = interpolate(sp, [0, 1], [0, 1]);

  return (
    <div
      style={{
        background: "#FAFAF8",
        borderRadius: 14,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        opacity: agingOpacity,
        transform: `translateY(${translateY}px)`,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        fontFamily,
        width: "100%",
      }}
    >
      {/* Month label */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#1A1A1A",
          minWidth: 56,
        }}
      >
        {month.month}
      </div>

      {/* Salary pill */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div style={{ fontSize: 10, color: "#9C9485" }}>دخل</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#1A1A1A" }}>
          {currency} {month.salary.toLocaleString("en-EG")}
        </div>
      </div>

      {/* Spent */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 10, color: "#9C9485" }}>مصروف</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#C0392B" }}>
          {currency} {month.spent.toLocaleString("en-EG")}
        </div>
      </div>

      {/* Rollover pill — the hero element */}
      <div
        style={{
          background: "#EAF4EE",
          borderRadius: 9999,
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 5,
          paddingBottom: 5,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 10, color: "#1A7A52" }}>↑</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#1A7A52" }}>
          +{currency} {month.rollover.toLocaleString("en-EG")}
        </span>
      </div>
    </div>
  );
};

export const RolloverStack: React.FC<RolloverStackProps> = ({
  months,
  currency = "EGP",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Running total = sum of rollovers for months that have appeared
  const visibleTotal = months.reduce((acc, m) => {
    if (frame >= m.startFrame + 10) return acc + m.rollover;
    return acc;
  }, 0);

  // Find the frame when the LAST month card starts (for counter timing)
  const lastMonthFrame = months[months.length - 1]?.startFrame ?? 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 10,
        width: "100%",
      }}
    >
      {months.map((m, i) => (
        <MonthCard key={m.month} month={m} currency={currency} index={i} />
      ))}

      {/* Running total accumulator */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 8,
        }}
      >
        <div
          style={{
            background: "#1A7A52",
            borderRadius: 9999,
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 10,
            paddingBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 4px 20px rgba(26,122,82,0.3)",
          }}
        >
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily }}>
            إجمالي الفلوس الزيادة
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#FFFFFF",
              fontFamily,
              letterSpacing: "-0.02em",
            }}
          >
            <CounterNumber
              from={0}
              to={visibleTotal}
              startFrame={months[0]?.startFrame ?? 0}
              prefix={`${currency} `}
              fontSize={20}
              color="#FFFFFF"
              fontWeight={800}
              damping={200}
              stiffness={60}
            />
          </span>
        </div>
      </div>
    </div>
  );
};
