import { PlaybackState, JellyfinApi } from '../components/types';
import { PluginConfig } from '../config/types';

export class MusicSyncService {
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private jellyfinApi: JellyfinApi | null = null;
  private currentPlaybackState: PlaybackState | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private config: PluginConfig | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      // Create audio context for visualization
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create analyser node for frequency data
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 2048;
      this.analyserNode.smoothingTimeConstant = 0.8;

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.analyserNode);

      console.log('Audio context initialized for Milkdrop visualizer');
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  // Connect to Jellyfin's audio output (this is a placeholder - actual implementation
  // would depend on how Jellyfin exposes its audio stream)
  public connectToJellyfinAudio(): Promise<void> {
    return new Promise((resolve, reject) => {
      // This is where you would connect to Jellyfin's Web Audio API
      // For now, we'll create a workaround by capturing system audio

      if (!this.audioContext || !this.analyserNode) {
        reject(new Error('Audio context not initialized'));
        return;
      }

      try {
        // Try to get access to user's microphone (for demo purposes)
        // In a real implementation, this would connect to Jellyfin's audio stream
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
              const source = this.audioContext!.createMediaStreamSource(stream);
              source.connect(this.gainNode!);
              resolve();
            })
            .catch(error => {
              console.warn('Could not access microphone for audio visualization:', error);
              // Fallback: create synthetic audio data for demo
              this.createFallbackAudio();
              resolve();
            });
        } else {
          this.createFallbackAudio();
          resolve();
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private createFallbackAudio() {
    // Create a simple oscillator for demo purposes
    if (!this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);

    oscillator.connect(gain);
    gain.connect(this.gainNode);

    oscillator.start();
  }

  public getAnalyserNode(): AnalyserNode | null {
    return this.analyserNode;
  }

  public getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  public setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume / 100;
    }
  }

  public startSync() {
    // Start syncing with Jellyfin playback state
    this.syncInterval = setInterval(() => {
      this.syncPlaybackState();
    }, 1000); // Update every second
  }

  public stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private async syncPlaybackState() {
    if (!this.jellyfinApi) return;

    try {
      const playbackState = await this.jellyfinApi.getPlaybackInfo();
      this.currentPlaybackState = playbackState;

      // Adjust volume based on Jellyfin's volume
      this.setVolume(playbackState.volume);

      // You could add more sync logic here
    } catch (error) {
      console.error('Failed to sync playback state:', error);
    }
  }

  public getCurrentPlaybackState(): PlaybackState | null {
    return this.currentPlaybackState;
  }

  public setJellyfinApi(api: JellyfinApi) {
    this.jellyfinApi = api;
  }

  public updateConfig(config: PluginConfig) {
    this.config = config;

    // Update audio settings
    if (this.analyserNode) {
      this.analyserNode.fftSize = config.audio.fftSize;
      this.analyserNode.smoothingTimeConstant = config.audio.smoothing;
      this.analyserNode.minDecibels = config.audio.minDecibels;
      this.analyserNode.maxDecibels = config.audio.maxDecibels;
    }

    // Update gain based on volume
    if (this.gainNode) {
      // Volume will be controlled by the media controls
    }
  }

  public dispose() {
    this.stopSync();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}