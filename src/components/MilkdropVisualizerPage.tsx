import React, { useEffect, useRef, useState } from 'react';
import { Visualizer } from './Visualizer';
import { MediaControls } from './MediaControls';
import { Header } from './Header';
import { ConfigPage } from './ConfigPage';
import { ErrorBoundary } from './ErrorBoundary';
import { MusicSyncService } from '../services/MusicSyncService';
import { ConfigManager } from '../config/ConfigManager';
import { PluginConfig } from '../config/types';
import './MilkdropVisualizerPage.css';

export const MilkdropVisualizerPage: React.FC = () => {
  const [config, setConfig] = useState<PluginConfig>(ConfigManager.getInstance().getConfig());
  const [showConfig, setShowConfig] = useState(false);
  const [musicSyncService] = useState(() => new MusicSyncService());
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const configSubscriptionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Subscribe to config changes
    configSubscriptionRef.current = ConfigManager.getInstance().subscribe((newConfig) => {
      setConfig(newConfig);
      // Reconfigure services based on new config
      musicSyncService.updateConfig(newConfig);
    });

    // Initialize music sync when component mounts
    const initializeSync = async () => {
      try {
        await musicSyncService.connectToJellyfinAudio();
        musicSyncService.startSync();
      } catch (error) {
        console.error('Failed to initialize music sync:', error);
      }
    };

    initializeSync();

    return () => {
      // Cleanup subscriptions and services
      if (configSubscriptionRef.current) {
        configSubscriptionRef.current();
      }
      musicSyncService.dispose();
    };
  }, [musicSyncService]);

  // Handle mouse movement for controls visibility
  const handleMouseMove = () => {
    if (!config.controls.showControls) return;

    // Don't hide controls if config panel is open
    if (showConfig) return;

    // Temporarily show controls
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    // Controls are always visible when config is open, otherwise follow mouse
    if (!showConfig) {
      controlsTimeoutRef.current = setTimeout(() => {
        // Controls visibility is handled by MediaControls component based on mouse position
      }, config.controls.autoHideDelay);
    }
  };

  const toggleHeader = () => {
    // Header visibility is handled in the render
  };

  const handleConfigButton = () => {
    setShowConfig(true);
  };

  const handleConfigClose = () => {
    setShowConfig(false);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!config.controls.enableKeyboardShortcuts) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't handle shortcuts when config is open or when typing in inputs
      if (showConfig || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          // Handle play/pause
          break;
        case 'KeyH':
          event.preventDefault();
          // Toggle header - header visibility handled in render
          break;
        case 'KeyF':
          event.preventDefault();
          // Toggle fullscreen
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
          break;
        case 'KeyP':
          event.preventDefault();
          // Next preset - handled by Visualizer
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [config.controls.enableKeyboardShortcuts, showConfig]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Milkdrop Visualizer crashed:', error, errorInfo);
        // Could send to analytics service here
      }}
    >
      <div
        className="milkdrop-visualizer-page"
        onMouseMove={handleMouseMove}
      >
        {config.controls.showControls && (
          <Header
            onToggle={toggleHeader}
            onConfig={handleConfigButton}
            showConfig={showConfig}
          />
        )}

        <div className="visualizer-container">
        <Visualizer
          config={config}
          audioContext={musicSyncService.getAudioContext() || undefined}
          analyserNode={musicSyncService.getAnalyserNode() || undefined}
        />
        </div>

        {config.controls.showControls && (
          <MediaControls
            config={config.controls}
            visible={!showConfig}
            onToggleHeader={toggleHeader}
            showHeader={config.controls.showControls}
          />
        )}
      </div>

      {showConfig && (
        <ConfigPage onClose={handleConfigClose} />
      )}
    </ErrorBoundary>
  );
};