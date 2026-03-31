import { loadFont } from "@remotion/google-fonts/Cairo";
import { Composition } from "remotion";
import { PromoVideo } from "./PromoVideo";
import { PromoVideoWithMusic } from "./PromoVideoWithMusic";
import { Video1Urgency } from "./Video1Urgency";
import { Video2Aspiration } from "./Video2Aspiration";
import { Video3Automation } from "./Video3Automation";
import { Video1UrgencyWithMusic } from "./Video1UrgencyWithMusic";
import { Video2AspirationWithMusic } from "./Video2AspirationWithMusic";
import { Video3AutomationWithMusic } from "./Video3AutomationWithMusic";

// Font must be loaded at module level — outside any component
const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700"],
  subsets: ["arabic", "latin"],
});

export { fontFamily };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="PromoVideoWithMusic"
        component={PromoVideoWithMusic}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      {/* Instagram Reels — 3 campaign videos */}
      <Composition
        id="UrgencyVideo"
        component={Video1Urgency}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="AspirationVideo"
        component={Video2Aspiration}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="AutomationVideo"
        component={Video3Automation}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      {/* With music + SFX variants */}
      <Composition
        id="UrgencyVideoWithMusic"
        component={Video1UrgencyWithMusic}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="AspirationVideoWithMusic"
        component={Video2AspirationWithMusic}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
      <Composition
        id="AutomationVideoWithMusic"
        component={Video3AutomationWithMusic}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
