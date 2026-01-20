export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  currentItem?: {
    Name: string;
    AlbumArtist?: string;
    Artist?: string;
  };
}

export interface JellyfinApi {
  getCurrentUser(): Promise<any>;
  getPlaybackInfo(): Promise<PlaybackState>;
  play(): Promise<void>;
  pause(): Promise<void>;
  stop(): Promise<void>;
  setVolume(volume: number): Promise<void>;
  seek(position: number): Promise<void>;
  nextTrack(): Promise<void>;
  previousTrack(): Promise<void>;
}