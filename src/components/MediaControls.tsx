import React, { useState, useEffect } from 'react';
import { PlaybackState } from './types';
import { ControlsConfig } from '../config/types';
import './MediaControls.css';

interface MediaControlsProps {
  config: ControlsConfig;
  visible: boolean;
  onToggleHeader: () => void;
  showHeader: boolean;
}

export const MediaControls: React.FC<MediaControlsProps> = ({
  config,
  visible,
  onToggleHeader,
  showHeader
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  // Handle mouse movement for auto-hide
  useEffect(() => {
    if (!config.showControls) return;

    let hideTimeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setIsVisible(true);
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        if (!visible) { // Don't auto-hide if explicitly shown
          setIsVisible(false);
        }
      }, config.autoHideDelay);
    };

    const handleMouseLeave = () => {
      if (!visible) {
        hideTimeout = setTimeout(() => setIsVisible(false), config.autoHideDelay);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(hideTimeout);
    };
  }, [config.autoHideDelay, config.showControls, visible]);

  // This would integrate with Jellyfin's playback API
  // For now, we'll create placeholder controls
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Integrate with Jellyfin playback API
    console.log('Play/Pause clicked');
  };

  const handlePrevious = () => {
    // TODO: Integrate with Jellyfin playback API
    console.log('Previous clicked');
  };

  const handleNext = () => {
    // TODO: Integrate with Jellyfin playback API
    console.log('Next clicked');
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    // TODO: Integrate with Jellyfin playback API
    console.log('Volume changed:', newVolume);
  };

  if (!config.showControls) return null;

  const positionClass = `position-${config.position}`;
  const themeClass = `theme-${config.theme}`;
  const sizeClass = `size-${config.size}`;

  return (
    <div
      className={`media-controls ${isVisible ? 'visible' : ''} ${positionClass} ${themeClass} ${sizeClass}`}
      style={{
        opacity: config.opacity,
        transition: `transform 0.3s ease-in-out, opacity 0.3s ease-in-out`
      }}
    >
      <div className="controls-container">
        <div className="track-info">
          <div className="track-title">Now Playing</div>
          <div className="track-artist">Artist Name</div>
        </div>

        <div className="playback-controls">
          <button className="control-btn" onClick={handlePrevious}>
            ⏮️
          </button>
          <button className="control-btn play-pause" onClick={handlePlayPause}>
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button className="control-btn" onClick={handleNext}>
            ⏭️
          </button>
        </div>

        <div className="volume-controls">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => handleVolumeChange(Number(e.target.value))}
            className="volume-slider"
          />
        </div>

        <div className="additional-controls">
          <button className="control-btn" onClick={onToggleHeader}>
            {showHeader ? '⬆️' : '⬇️'}
          </button>
        </div>
      </div>
    </div>
  );
};