import { VideoQualityMonitor } from "../index.ts";

document.addEventListener("DOMContentLoaded", () => {
  const videoElement = document.querySelector("video");
  const handler = (state) => {
    console.log(`state changed –>`, state);
  };
  new VideoQualityMonitor(videoElement, handler);
});
