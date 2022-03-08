import { PlayerEvents, VideoEventFilter } from "@eyevinn/video-event-filter";

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

const defaultQualityState: IQualityState = {
  watchedDuration: 0,
  watchedFrames: 0,
  droppedFrames: 0,
  droppedFramesRatio: 0,
  bufferingEvents: 0,
  bufferingDuration: 0,
  bufferRatio: 0,

  qualityPoints: 1,
};

export class VideoQualityMonitor {
  private videoEventFilter: VideoEventFilter;
  private videoEventListener: any;

  private state: IQualityState = { ...defaultQualityState };

  private watchTimer: number;
  private bufferingTimer: number;

  constructor(
    private videoElement: HTMLVideoElement,
    private handler: (state: IQualityState) => void
  ) {
    this.videoEventFilter = new VideoEventFilter(videoElement);
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.videoEventFilter.addEventListener(
      "*",
      (this.videoEventListener = (event: PlayerEvents) => {
        switch (event) {
          case PlayerEvents.Play:
          case PlayerEvents.Resume:
          case PlayerEvents.Seeked:
            this.watching();
            break;
          case PlayerEvents.Pause:
          case PlayerEvents.Ended:
          case PlayerEvents.Seeking:
            this.pausing();
            break;
          case PlayerEvents.Buffering:
            this.pausing();
            this.onBuffering();
            break;
          case PlayerEvents.Buffered:
            this.onBuffered();
            this.watching();
            break;
          case PlayerEvents.TimeUpdate:
            this.onTimeUpdate();
            break;
        }
      })
    );
  }

  private onBuffering() {
    this.setState({
      bufferingEvents: this.state.bufferingEvents + 1,
    });
    this.bufferingTimer = setInterval(() => {
      this.setState({
        bufferingDuration: this.state.bufferingDuration + 0.1,
      });
    }, 100);
  }

  private onBuffered() {
    this.bufferingTimer && clearInterval(this.bufferingTimer);
  }

  private watching() {
    this.watchTimer = setInterval(() => {
      this.setState({
        watchedDuration: this.state.watchedDuration + 0.1,
      });
    }, 100);
  }

  private pausing() {
    this.watchTimer && clearInterval(this.watchTimer);
  }

  private onTimeUpdate() {
    const watchedFrames =
      this.videoElement.getVideoPlaybackQuality().totalVideoFrames;
    const droppedFrames =
      this.videoElement.getVideoPlaybackQuality().droppedVideoFrames;
    const droppedFramesRatio = droppedFrames / watchedFrames;

    const bufferRatio =
      this.state.bufferingDuration / this.state.watchedDuration;


    this.setState({
      watchedFrames,
      droppedFrames,
      droppedFramesRatio,
      bufferRatio,
    });
  }

  private setState(newState: Partial<IQualityState>): void {
    this.state = {
      ...this.state,
      ...newState,
    };
    this.handler(this.state);
  }

  public destroy() {
    this.videoEventFilter &&
      this.videoEventFilter.removeEventListener("*", this.videoEventListener);
    this.watchTimer && clearInterval(this.watchTimer);
    this.bufferingTimer && clearInterval(this.bufferingTimer);
    this.state = defaultQualityState;
  }
}
