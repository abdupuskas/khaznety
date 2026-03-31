import React from "react";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { SceneAccusation } from "./scenes/v3/SceneAccusation";
import { SceneGraveyard } from "./scenes/v3/SceneGraveyard";
import { SceneQuestion } from "./scenes/v3/SceneQuestion";
import { SceneMagic } from "./scenes/v3/SceneMagic";
import { SceneEndCardEn } from "./scenes/v3/SceneEndCardEn";

// Frame math:
// 5 scenes × sequence durations − 4 transitions × 15 frames = 450 total
// Sequence durations: 90 + 105 + 120 + 135 + 60 = 510
// 510 − (4 × 15) = 510 − 60 = 450 ✓
const T = 15;

export const Video3Automation: React.FC = () => {
  return (
    <TransitionSeries>
      {/* Scene 1 — "You quit. Again." (net 75f / 2.5s) — punchy, no dead pause */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <SceneAccusation />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 2 — Graveyard of failed tools (net 90f / 3s) */}
      <TransitionSeries.Sequence durationInFrames={105}>
        <SceneGraveyard />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 3 — "What if it just tracked itself?" (net 105f / 3.5s) — let it breathe */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <SceneQuestion />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationRestThreshold: 0.001 })}
      />

      {/* Scene 4 — Live app + SMS auto-tracked (net 120f / 4s) — the hero moment */}
      <TransitionSeries.Sequence durationInFrames={135}>
        <SceneMagic />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: T })}
      />

      {/* Scene 5 — "Your money. Finally clear." (net 45f / 1.5s) — brand stamp */}
      <TransitionSeries.Sequence durationInFrames={60}>
        <SceneEndCardEn />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
