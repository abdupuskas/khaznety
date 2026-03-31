import React from "react";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { SceneSMS } from "./scenes/SceneSMS";
import { SceneApplePay } from "./scenes/SceneApplePay";
import { SceneDashboard } from "./scenes/SceneDashboard";
import { SceneEndCard } from "./scenes/SceneEndCard";

// Frame math:
// 3 transitions × 15 frames each = 45 frames consumed by overlaps
// Scene durations sum: 105 + 135 + 195 + 60 = 495
// 495 - 45 = 450 total ✓
const TRANSITION_FRAMES = 15;

export const PromoVideo: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1 — SMS Hook (0–90 visible) */}
      <TransitionSeries.Sequence durationInFrames={105}>
        <SceneSMS />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({
          config: { damping: 200 },
          durationRestThreshold: 0.001,
        })}
      />

      {/* Scene 2 — Apple Pay (90–210 visible) */}
      <TransitionSeries.Sequence durationInFrames={135}>
        <SceneApplePay />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({
          config: { damping: 200 },
          durationRestThreshold: 0.001,
        })}
      />

      {/* Scene 3 — Dashboard (210–390 visible) */}
      <TransitionSeries.Sequence durationInFrames={195}>
        <SceneDashboard />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      {/* Scene 4 — End Card (390–450) */}
      <TransitionSeries.Sequence durationInFrames={60}>
        <SceneEndCard />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
