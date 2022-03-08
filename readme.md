Video Quality Monitor
===

A small package to monitor buffering and dropped frames on the video element, reporting it back as state updates into a sent in callback.

## Simple Usage

```js
  import { VideoQualityMonitor } from "@eyevinn/video-quality-monitor";

  const videoElement = document.querySelector("video");
  
  function handler = (state) => {
    console.log(`state changed –>`, state);
  };

  new VideoQualityMonitor(videoElement, handler);
```

## State Object

```ts
export interface IQualityState {
  watchedDuration: number;

  watchedFrames: number;
  droppedFrames: number;
  droppedFramesRatio: number;
  
  bufferingEvents: number;
  bufferingDuration: number;
  bufferRatio: number;

  qualityPoints: number;
}
```

## Data

- `watchedDuration`, how many seconds of content has been played

- `watchedFrames`, how many total frames should have been viewed
- `droppedFrames`, how many of these total frames have been dropped
- `droppedFramesRatio`

- `bufferingEvents`, how many times have playback been stopped due to buffering
- `bufferingDuration`, for how long have this buffering been stalling
- `bufferRatio`, the ratio of stalled buffering vs watched duration

- `qualityPoints`, calculation of the experience
