import React, { useEffect, useRef, useState } from 'react';
import butterchurn from 'butterchurn';
import butterchurnPresets from 'butterchurn-presets';
import { PluginConfig } from '../config/types';

interface VisualizerProps {
  config: PluginConfig;
  audioContext?: AudioContext;
  analyserNode?: AnalyserNode;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  config,
  audioContext,
  analyserNode
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualizerRef = useRef<any>(null);
  const [currentPreset, setCurrentPreset] = useState<string>(config.presets.currentPreset);
  const presetSwitchTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate canvas dimensions based on quality setting
  const getCanvasDimensions = () => {
    const baseWidth = window.innerWidth * config.visualizer.pixelRatio;
    const baseHeight = window.innerHeight * config.visualizer.pixelRatio;

    switch (config.visualizer.quality) {
      case 'low':
        return { width: 256, height: 256 };
      case 'medium':
        return { width: 512, height: 512 };
      case 'high':
        return { width: 1024, height: 1024 };
      case 'ultra':
        return { width: 2048, height: 2048 };
      default:
        return { width: baseWidth, height: baseHeight };
    }
  };

  // Load preset based on configuration
  const loadPreset = (presetName: string) => {
    if (!visualizerRef.current) return;

    const presets = butterchurnPresets.getPresets();
    let preset;

    if (presetName === 'random') {
      const presetKeys = Object.keys(presets);
      preset = presets[presetKeys[Math.floor(Math.random() * presetKeys.length)]];
    } else if (presets[presetName]) {
      preset = presets[presetName];
    } else {
      // Fallback to random preset
      const presetKeys = Object.keys(presets);
      preset = presets[presetKeys[Math.floor(Math.random() * presetKeys.length)]];
    }

    if (preset) {
      visualizerRef.current.loadPreset(preset, config.presets.presetTransitionTime);
      setCurrentPreset(presetName);
    }
  };

  // Handle preset switching
  useEffect(() => {
    if (config.presets.autoSwitchPresets) {
      const switchPreset = () => {
        const presets = butterchurnPresets.getPresets();
        const presetKeys = Object.keys(presets);

        let nextPreset;
        if (config.presets.shufflePresets) {
          nextPreset = presetKeys[Math.floor(Math.random() * presetKeys.length)];
        } else {
          const currentIndex = presetKeys.indexOf(currentPreset);
          const nextIndex = (currentIndex + 1) % presetKeys.length;
          nextPreset = presetKeys[nextIndex];
        }

        loadPreset(nextPreset);
      };

      presetSwitchTimeoutRef.current = setInterval(switchPreset, config.presets.switchInterval * 1000);

      return () => {
        if (presetSwitchTimeoutRef.current) {
          clearInterval(presetSwitchTimeoutRef.current);
        }
      };
    }
  }, [config.presets.autoSwitchPresets, config.presets.switchInterval, config.presets.shufflePresets, currentPreset]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const dimensions = getCanvasDimensions();

    // Initialize butterchurn visualizer with config
    const visualizer = butterchurn.createVisualizer(audioContext || null, canvasRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      pixelRatio: config.visualizer.pixelRatio,
      texSize: config.performance.textureQuality === 'low' ? 512 :
               config.performance.textureQuality === 'medium' ? 1024 : 2048
    });

    // Apply visual adjustments
    visualizer.setRendererSize(dimensions.width, dimensions.height);

    // Load initial preset
    loadPreset(config.presets.currentPreset);

    // Connect to audio analyser if provided
    if (analyserNode) {
      visualizer.connectAudio(analyserNode);
    }

    visualizerRef.current = visualizer;

    // Handle window resize
    const handleResize = () => {
      if (visualizerRef.current && canvasRef.current) {
        const newDimensions = getCanvasDimensions();
        visualizerRef.current.setRendererSize(newDimensions.width, newDimensions.height);
      }
    };

    window.addEventListener('resize', handleResize);

    // Start rendering with target FPS
    let lastFrameTime = 0;
    const targetFrameTime = 1000 / config.performance.targetFps;

    const renderLoop = (currentTime: number) => {
      if (currentTime - lastFrameTime >= targetFrameTime) {
        if (visualizerRef.current) {
          visualizerRef.current.render();
          lastFrameTime = currentTime;
        }
      }
      requestAnimationFrame(renderLoop);
    };

    if (config.performance.enableVSync) {
      requestAnimationFrame(renderLoop);
    } else {
      // High-performance mode without V-sync
      const highPerfRender = () => {
        if (visualizerRef.current) {
          visualizerRef.current.render();
        }
        setTimeout(highPerfRender, targetFrameTime);
      };
      highPerfRender();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (presetSwitchTimeoutRef.current) {
        clearInterval(presetSwitchTimeoutRef.current);
      }
      if (visualizerRef.current) {
        visualizerRef.current.disconnectAudio();
      }
    };
  }, [config, audioContext, analyserNode]);

  // Update preset when config changes
  useEffect(() => {
    if (config.presets.currentPreset !== currentPreset && !config.presets.autoSwitchPresets) {
      loadPreset(config.presets.currentPreset);
    }
  }, [config.presets.currentPreset]);

  return (
    <canvas
      ref={canvasRef}
      width={getCanvasDimensions().width}
      height={getCanvasDimensions().height}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        filter: config.visualizer.invertColors ? 'invert(1)' : 'none'
      }}
    />
  );
};