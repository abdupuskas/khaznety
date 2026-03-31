import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";
import { Video2Aspiration } from "./Video2Aspiration";

// Global frame offsets for SFX (calculated from TransitionSeries layout):
// Scene 1 DreamQuestion → global 0    (seq 90f)
// Scene 2 GoalSetup     → global 75   (90 - 15)
// Scene 3 RolloverMagic → global 225  (75 + 165 - 15)
// Scene 4 GoalFilling   → global 450  (225 + 240 - 15)
// Scene 5 EndCard       → global 645  (450 + 210 - 15)

const SCENE_GOAL_FILLING_START = 450;

export const Video2AspirationWithMusic: React.FC = () => {
  return (
    <>
      <Video2Aspiration />

      {/* Background music — warm and forward-moving */}
      <Audio
        src={staticFile("bg-music-v2.mp3")}
        volume={(f) => {
          if (f < 30) return interpolate(f, [0, 30], [0, 0.55], { extrapolateRight: "clamp" });
          if (f > 720) return interpolate(f, [720, 750], [0.55, 0], { extrapolateRight: "clamp" });
          return 0.55;
        }}
      />

      {/* Goal completion ding — Scene 4 local frame 150 */}
      <Sequence from={SCENE_GOAL_FILLING_START + 150} durationInFrames={60}>
        <Audio src={staticFile("sfx/success-ding.mp3")} volume={0.8} />
      </Sequence>

      {/* Soft chime when rollover total accumulates — Scene 3 local frame 120 */}
      <Sequence from={225 + 120} durationInFrames={60}>
        <Audio src={staticFile("sfx/success-chime.mp3")} volume={0.5} />
      </Sequence>
    </>
  );
};
