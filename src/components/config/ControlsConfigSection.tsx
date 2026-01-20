import React from 'react';
import { ControlsConfig } from '../../config/types';

interface ControlsConfigSectionProps {
  config: ControlsConfig;
  onChange: (updates: Partial<ControlsConfig>) => void;
}

export const ControlsConfigSection: React.FC<ControlsConfigSectionProps> = ({ config, onChange }) => {
  return (
    <div className="config-section">
      <h3>Controls Configuration</h3>

      <div className="config-group">
        <h4>General</h4>
        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.showControls}
              onChange={(e) => onChange({ showControls: e.target.checked })}
            />
            Show Media Controls
          </label>
        </div>

        <div className="config-field">
          <label>
            Auto-hide Delay: {config.autoHideDelay / 1000}s
            <span className="slider-value">{config.autoHideDelay}ms</span>
          </label>
          <input
            type="range"
            className="config-slider"
            min="1000"
            max="10000"
            step="500"
            value={config.autoHideDelay}
            onChange={(e) => onChange({ autoHideDelay: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="config-group">
        <h4>Appearance</h4>
        <div className="config-field">
          <label>Position</label>
          <select
            className="config-select"
            value={config.position}
            onChange={(e) => onChange({ position: e.target.value as ControlsConfig['position'] })}
          >
            <option value="bottom">Bottom</option>
            <option value="top">Top</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>

        <div className="config-field">
          <label>Size</label>
          <select
            className="config-select"
            value={config.size}
            onChange={(e) => onChange({ size: e.target.value as ControlsConfig['size'] })}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="config-field">
          <label>Theme</label>
          <select
            className="config-select"
            value={config.theme}
            onChange={(e) => onChange({ theme: e.target.value as ControlsConfig['theme'] })}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div className="config-field">
          <label>
            Opacity
            <span className="slider-value">{(config.opacity * 100).toFixed(0)}%</span>
          </label>
          <input
            type="range"
            className="config-slider"
            min="0.1"
            max="1"
            step="0.05"
            value={config.opacity}
            onChange={(e) => onChange({ opacity: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="config-group">
        <h4>Input</h4>
        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.enableKeyboardShortcuts}
              onChange={(e) => onChange({ enableKeyboardShortcuts: e.target.checked })}
            />
            Enable Keyboard Shortcuts
          </label>
        </div>

        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.enableTouchGestures}
              onChange={(e) => onChange({ enableTouchGestures: e.target.checked })}
            />
            Enable Touch Gestures
          </label>
        </div>
      </div>

      {config.enableKeyboardShortcuts && (
        <div className="config-group">
          <h4>Keyboard Shortcuts</h4>
          <div className="shortcuts-list">
            <div className="shortcut-item">
              <kbd>Space</kbd> Play/Pause
            </div>
            <div className="shortcut-item">
              <kbd>←</kbd> Previous Track
            </div>
            <div className="shortcut-item">
              <kbd>→</kbd> Next Track
            </div>
            <div className="shortcut-item">
              <kbd>↑</kbd> Volume Up
            </div>
            <div className="shortcut-item">
              <kbd>↓</kbd> Volume Down
            </div>
            <div className="shortcut-item">
              <kbd>M</kbd> Mute/Unmute
            </div>
            <div className="shortcut-item">
              <kbd>F</kbd> Fullscreen
            </div>
            <div className="shortcut-item">
              <kbd>P</kbd> Next Preset
            </div>
            <div className="shortcut-item">
              <kbd>H</kbd> Toggle Header
            </div>
          </div>
        </div>
      )}
    </div>
  );
};