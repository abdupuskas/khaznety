import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";
import { Video3Automation } from "./Video3Automation";

// Global frame offsets for SFX (calculated from TransitionSeries layout):
// Scene 1 Accusation → global 0    (seq 90f)
// Scene 2 Graveyard  → global 75   (90 - 15)
// Scene 3 Question   → global 165  (75 + 105 - 15)
// Scene 4 Magic      → global 270  (165 + 120 - 15)
// Scene 5 EndCard    → global 390  (270 + 135 - 15)

const SCENE_MAGIC_START = 270;

export const Video3AutomationWithMusic: React.FC = () => {
  return (
    <>
      <Video3Automation />

      {/* Background music — starts silent, kicks in at Question scene */}
      <Audio
        src={staticFile("bg-music-v3.mp3")}
        volume={(f) => {
          // Silent during dark Accusation + Graveyard scenes (0–165)
          if (f < 165) return interpolate(f, [150, 165], [0, 0], { extrapolateRight: "clamp" });
          // Fade in as Question scene appears — warmth enters
          if (f < 195) return interpolate(f, [165, 195], [0, 0.6], { extrapolateRight: "clamp" });
          // Fade out at end
          if (f > 420) return interpolate(f, [420, 450], [0.6, 0], { extrapolateRight: "clamp" });
          return 0.6;
        }}
      />

      {/* "You quit." impact thud — Accusation local frame 5 */}
      <Sequence from={5} durationInFrames={30}>
        <Audio src={staticFile("sfx/impact-thud.mp3")} volume={0.85} />
      </Sequence>

      {/* "Again." impact — Accusation local frame 35 */}
      <Sequence from={35} durationInFrames={30}>
        <Audio src={staticFile("sfx/impact-thud-low.mp3")} volume={0.9} />
      </Sequence>

      {/* SMS notification ping — Magic local frame 15 */}
      <Sequence from={SCENE_MAGIC_START + 15} durationInFrames={60}>
        <Audio src={staticFile("sfx/notification-ping.mp3")} volume={0.8} />
      </Sequence>

      {/* Success chime — tracked badge appears — Magic local frame 30 */}
      <Sequence from={SCENE_MAGIC_START + 30} durationInFrames={60}>
        <Audio src={staticFile("sfx/success-chime.mp3")} volume={0.7} />
      </Sequence>
    </>
  );
};
