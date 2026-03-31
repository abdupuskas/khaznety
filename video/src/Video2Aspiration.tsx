import React from "react";
import {
  TransitionSeries,
  springTiming,
} from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { SceneDreamQuestion } from "./scenes/v2/SceneDreamQuestion";
import { SceneGoalSetup } from "./scenes/v2/SceneGoalSetup";
import { SceneRolloverMagic } from "./scenes/v2/SceneRolloverMagic";
import { SceneGoalFilling } from "./scenes/v2/SceneGoalFilling";
import { SceneEndCardAr2 } from "./scenes/v2/SceneEndCardAr2";

// Frame math:
// 5 scenes × sequence durations − 4 transitions × 15 frames = 750 total
// Sequence durations: 90 + 165 + 240 + 210 + 105 = 810
// 810 − (4 × 15) = 810 − 60 = 750 ✓

export const Video2Aspiration: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1 — Dream question: "حلمك بـ كام؟" (net 75f / 2.5s) */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <SceneDreamQuestion />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationRestThreshold: 0.001 })}
      />

      {/* Scene 2 — Goal setup at 0% (net 150f / 5s) */}
      <TransitionSeries.Sequence durationInFrames={165}>
        <SceneGoalSetup />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationRestThreshold: 0.001 })}
      />

      {/* Scene 3 — Rollover data visualization (net 225f / 7.5s) */}
      <TransitionSeries.Sequence durationInFrames={240}>
        <SceneRolloverMagic />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationRestThreshold: 0.001 })}
      />

      {/* Scene 4 — Goal bar fills to 67% (net 195f / 6.5s) */}
      <TransitionSeries.Sequence durationInFrames={210}>
        <SceneGoalFilling />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationRestThreshold: 0.001 })}
      />

      {/* Scene 5 — End card: "جرّبه مجاناً ٧ أيام" (net 90f / 3s) */}
      <TransitionSeries.Sequence durationInFrames={105}>
        <SceneEndCardAr2 />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
