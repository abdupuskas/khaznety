import React from "react";
import { Audio, interpolate, staticFile } from "remotion";
import { PromoVideo } from "./PromoVideo";

export const PromoVideoWithMusic: React.FC = () => {
  return (
    <>
      <PromoVideo />
      <Audio
        src={staticFile("bg-music.mp3")}
        volume={(f) => {
          // Fade in over first second (0–30 frames)
          if (f < 30) return interpolate(f, [0, 30], [0, 0.65], { extrapolateRight: "clamp" });
          // Fade out over last second (420–450 frames)
          if (f > 420) return interpolate(f, [420, 450], [0.65, 0], { extrapolateRight: "clamp" });
          return 0.65;
        }}
      />
    </>
  );
};
