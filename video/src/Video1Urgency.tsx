import React from "react";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { SceneHook } from "./scenes/v1/SceneHook";
import { SceneChaos } from "./scenes/v1/SceneChaos";
import { SceneDashboardAr } from "./scenes/v1/SceneDashboardAr";
import { SceneSMSAutoTrack } from "./scenes/v1/SceneSMSAutoTrack";
import { SceneBudgetOverview } from "./scenes/v1/SceneBudgetOverview";
import { SceneEndCardAr } from "./scenes/v1/SceneEndCardAr";

// Frame math:
// 6 scenes × sequence durations − 5 transitions × 15 frames = 900 total
// Sequence durations: 105 + 210 + 225 + 165 + 165 + 105 = 975
// 975 − (5 × 15) = 975 − 75 = 900 ✓
const T = 15; // transition overlap frames

export const Video1Urgency: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1 — Hook: "EGP 0.00" (net 90f / 3s) */}
      <TransitionSeries.Sequence durationInFrames={105}>
        <SceneHook />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 2 — Chaos: messy notes before state (net 195f / 6.5s) */}
      <TransitionSeries.Sequence durationInFrames={210}>
        <SceneChaos />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationRestThreshold: 0.001 })}
      />

      {/* Scene 3 — Arabic dashboard reveal (net 210f / 7s) */}
      <TransitionSeries.Sequence durationInFrames={225}>
        <SceneDashboardAr />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationRestThreshold: 0.001 })}
      />

      {/* Scene 4 — SMS auto-tracking magic (net 150f / 5s) */}
      <TransitionSeries.Sequence durationInFrames={165}>
        <SceneSMSAutoTrack />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationRestThreshold: 0.001 })}
      />

      {/* Scene 5 — Full budget overview (net 150f / 5s) */}
      <TransitionSeries.Sequence durationInFrames={165}>
        <SceneBudgetOverview />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 6 — End card: "حمّل دلوقتي" (net 90f / 3s) */}
      <TransitionSeries.Sequence durationInFrames={105}>
        <SceneEndCardAr />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
