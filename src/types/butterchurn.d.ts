// Type declarations for butterchurn modules

declare module 'butterchurn' {
  interface VisualizerOptions {
    width?: number;
    height?: number;
    pixelRatio?: number;
    texSize?: number;
  }

  interface Visualizer {
    loadPreset(preset: any, blendTime?: number): void;
    render(): void;
    setRendererSize(width: number, height: number): void;
    connectAudio(analyserNode: AnalyserNode): void;
    disconnectAudio(): void;
  }

  function createVisualizer(audioContext: AudioContext | null, canvas: HTMLCanvasElement, options?: VisualizerOptions): Visualizer;

  export = {
    createVisualizer
  };
}

declare module 'butterchurn-presets' {
  interface Presets {
    [key: string]: any;
  }

  function getPresets(): Presets;

  export = {
    getPresets
  };
}