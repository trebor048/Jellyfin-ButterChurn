export interface PluginConfig {
  version: string;
  audio: AudioConfig;
  visualizer: VisualizerConfig;
  controls: ControlsConfig;
  presets: PresetsConfig;
  performance: PerformanceConfig;
  compatibility: CompatibilityConfig;
}

export interface AudioConfig {
  source: 'jellyfin' | 'microphone' | 'system' | 'demo';
  sensitivity: number; // 0-2, default 1
  smoothing: number; // 0-1, default 0.8
  fftSize: number; // 256, 512, 1024, 2048, 4096, 8192
  minDecibels: number; // -90 to -10
  maxDecibels: number; // -10 to 0
  enableEqualizer: boolean;
  equalizerBands: number[]; // 10 bands
}

export interface VisualizerConfig {
  quality: 'low' | 'medium' | 'high' | 'ultra';
  pixelRatio: number; // 0.5, 1, 2
  blendMode: 'normal' | 'additive' | 'multiply' | 'screen';
  gamma: number; // 0.5-3.0
  brightness: number; // 0-2
  contrast: number; // 0-2
  saturation: number; // 0-2
  hueShift: number; // 0-360
  invertColors: boolean;
  enablePostProcessing: boolean;
}

export interface ControlsConfig {
  showControls: boolean;
  autoHideDelay: number; // milliseconds
  position: 'bottom' | 'top' | 'left' | 'right';
  opacity: number; // 0-1
  size: 'small' | 'medium' | 'large';
  theme: 'dark' | 'light' | 'auto';
  enableKeyboardShortcuts: boolean;
  enableTouchGestures: boolean;
}

export interface PresetsConfig {
  currentPreset: string;
  autoSwitchPresets: boolean;
  switchInterval: number; // seconds
  favoritePresets: string[];
  customPresets: CustomPreset[];
  presetTransitionTime: number; // seconds
  shufflePresets: boolean;
}

export interface CustomPreset {
  id: string;
  name: string;
  description: string;
  presetData: any;
  createdAt: number;
  modifiedAt: number;
}

export interface PerformanceConfig {
  targetFps: number; // 30, 60, 120
  enableVSync: boolean;
  lowPowerMode: boolean;
  maxMemoryUsage: number; // MB
  enableWorker: boolean;
  preloadPresets: boolean;
  textureQuality: 'low' | 'medium' | 'high';
}

export interface CompatibilityConfig {
  enableFallbacks: boolean;
  webglVersion: 'auto' | 'webgl1' | 'webgl2';
  audioWorklet: boolean;
  sharedArrayBuffer: boolean;
  webAudioApi: boolean;
  forceSoftwareRendering: boolean;
}

export const DEFAULT_CONFIG: PluginConfig = {
  version: '1.0.0',
  audio: {
    source: 'jellyfin',
    sensitivity: 1.0,
    smoothing: 0.8,
    fftSize: 2048,
    minDecibels: -90,
    maxDecibels: -10,
    enableEqualizer: false,
    equalizerBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  },
  visualizer: {
    quality: 'high',
    pixelRatio: 1,
    blendMode: 'normal',
    gamma: 1.0,
    brightness: 1.0,
    contrast: 1.0,
    saturation: 1.0,
    hueShift: 0,
    invertColors: false,
    enablePostProcessing: true
  },
  controls: {
    showControls: true,
    autoHideDelay: 3000,
    position: 'bottom',
    opacity: 0.9,
    size: 'medium',
    theme: 'dark',
    enableKeyboardShortcuts: true,
    enableTouchGestures: true
  },
  presets: {
    currentPreset: 'random',
    autoSwitchPresets: false,
    switchInterval: 30,
    favoritePresets: [],
    customPresets: [],
    presetTransitionTime: 2,
    shufflePresets: false
  },
  performance: {
    targetFps: 60,
    enableVSync: true,
    lowPowerMode: false,
    maxMemoryUsage: 256,
    enableWorker: false,
    preloadPresets: true,
    textureQuality: 'high'
  },
  compatibility: {
    enableFallbacks: true,
    webglVersion: 'auto',
    audioWorklet: false,
    sharedArrayBuffer: false,
    webAudioApi: true,
    forceSoftwareRendering: false
  }
};