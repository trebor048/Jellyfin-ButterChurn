import React from 'react';
import { PerformanceConfig } from '../../config/types';

interface PerformanceConfigSectionProps {
  config: PerformanceConfig;
  onChange: (updates: Partial<PerformanceConfig>) => void;
}

export const PerformanceConfigSection: React.FC<PerformanceConfigSectionProps> = ({ config, onChange }) => {
  return (
    <div className="config-section">
      <h3>Performance Configuration</h3>

      <div className="config-group">
        <h4>Rendering</h4>
        <div className="config-field">
          <label>Target FPS</label>
          <select
            className="config-select"
            value={config.targetFps}
            onChange={(e) => onChange({ targetFps: parseInt(e.target.value) })}
          >
            <option value="30">30 FPS (Low Power)</option>
            <option value="60">60 FPS (Standard)</option>
            <option value="120">120 FPS (High Performance)</option>
          </select>
        </div>

        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.enableVSync}
              onChange={(e) => onChange({ enableVSync: e.target.checked })}
            />
            Enable V-Sync
          </label>
        </div>

        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.lowPowerMode}
              onChange={(e) => onChange({ lowPowerMode: e.target.checked })}
            />
            Low Power Mode
          </label>
        </div>
      </div>

      <div className="config-group">
        <h4>Memory Management</h4>
        <div className="config-field">
          <label>
            Max Memory Usage: {config.maxMemoryUsage}MB
            <span className="slider-value">{config.maxMemoryUsage}MB</span>
          </label>
          <input
            type="range"
            className="config-slider"
            min="64"
            max="1024"
            step="32"
            value={config.maxMemoryUsage}
            onChange={(e) => onChange({ maxMemoryUsage: parseInt(e.target.value) })}
          />
        </div>

        <div className="config-field">
          <label>Texture Quality</label>
          <select
            className="config-select"
            value={config.textureQuality}
            onChange={(e) => onChange({ textureQuality: e.target.value as PerformanceConfig['textureQuality'] })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="config-group">
        <h4>Advanced</h4>
        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.enableWorker}
              onChange={(e) => onChange({ enableWorker: e.target.checked })}
            />
            Enable Web Worker (Experimental)
          </label>
        </div>

        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.preloadPresets}
              onChange={(e) => onChange({ preloadPresets: e.target.checked })}
            />
            Preload Presets
          </label>
        </div>
      </div>
    </div>
  );
};