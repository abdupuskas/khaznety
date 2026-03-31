import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";
import { Video1Urgency } from "./Video1Urgency";

// Global frame offsets for SFX (calculated from TransitionSeries layout):
// Scene 1 Hook      → global 0    (seq 105f)
// Scene 2 Chaos     → global 90   (105 - 15 overlap)
// Scene 3 Dashboard → global 285  (90 + 210 - 15)
// Scene 4 SMS       → global 495  (285 + 225 - 15)
// Scene 5 Budget    → global 645  (495 + 165 - 15)
// Scene 6 EndCard   → global 795  (645 + 165 - 15)

const SCENE_SMS_START = 495;

export const Video1UrgencyWithMusic: React.FC = () => {
  return (
    <>
      <Video1Urgency />

      {/* Background music — fade in over 1s, fade out over last 1s */}
      <Audio
        src={staticFile("bg-music-v1.mp3")}
        volume={(f) => {
          if (f < 30) return interpolate(f, [0, 30], [0, 0.55], { extrapolateRight: "clamp" });
          if (f > 870) return interpolate(f, [870, 900], [0.55, 0], { extrapolateRight: "clamp" });
          return 0.55;
        }}
      />

      {/* Bank ping at scene start (Hook) */}
      <Sequence from={2} durationInFrames={60}>
        <Audio src={staticFile("sfx/notification-ping.mp3")} volume={0.7} />
      </Sequence>

      {/* SMS notification ping — Scene 4 local frame 10 */}
      <Sequence from={SCENE_SMS_START + 10} durationInFrames={60}>
        <Audio src={staticFile("sfx/notification-ping.mp3")} volume={0.75} />
      </Sequence>

      {/* Success chime — transaction tracked — Scene 4 local frame 65 */}
      <Sequence from={SCENE_SMS_START + 65} durationInFrames={60}>
        <Audio src={staticFile("sfx/success-chime.mp3")} volume={0.65} />
      </Sequence>
    </>
  );
};
