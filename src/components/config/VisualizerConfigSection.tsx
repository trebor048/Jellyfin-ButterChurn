import React from 'react';
import { VisualizerConfig } from '../../config/types';

interface VisualizerConfigSectionProps {
  config: VisualizerConfig;
  onChange: (updates: Partial<VisualizerConfig>) => void;
}

export const VisualizerConfigSection: React.FC<VisualizerConfigSectionProps> = ({ config, onChange }) => {
  return (
    <div className="config-section">
      <h3>Visualizer Configuration</h3>

      <div className="config-group">
        <h4>Quality Settings</h4>
        <div className="config-field">
          <label>Quality</label>
          <select
            className="config-select"
            value={config.quality}
            onChange={(e) => onChange({ quality: e.target.value as VisualizerConfig['quality'] })}
          >
            <option value="low">Low (256x256)</option>
            <option value="medium">Medium (512x512)</option>
            <option value="high">High (1024x1024)</option>
            <option value="ultra">Ultra (2048x2048)</option>
          </select>
        </div>

        <div className="config-field">
          <label>Pixel Ratio</label>
          <select
            className="config-select"
            value={config.pixelRatio}
            onChange={(e) => onChange({ pixelRatio: parseFloat(e.target.value) })}
          >
            <option value="0.5">0.5x (Low DPI)</option>
            <option value="1">1x (Standard)</option>
            <option value="2">2x (High DPI)</option>
          </select>
        </div>

        <div className="config-field">
          <label>Blend Mode</label>
          <select
            className="config-select"
            value={config.blendMode}
            onChange={(e) => onChange({ blendMode: e.target.value as VisualizerConfig['blendMode'] })}
          >
            <option value="normal">Normal</option>
            <option value="additive">Additive</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
          </select>
        </div>
      </div>

      <div className="config-group">
        <h4>Color Adjustments</h4>
        <div className="config-field">
          <label>
            Gamma
            <span className="slider-value">{config.gamma.toFixed(2)}</span>
          </label>
          <input
            type="range"
            className="config-slider"
            min="0.5"
            max="3.0"
            step="0.1"
            value={config.gamma}
            onChange={(e) => onChange({ gamma: parseFloat(e.target.value) })}
          />
        </div>

        <div className="config-field">
          <label>
            Brightness
            <span className="slider-value">{config.brightness.toFixed(2)}</span>
          </label>
          <input
            type="range"
            className="config-slider"
            min="0"
            max="2"
            step="0.1"
            value={config.brightness}
            onChange={(e) => onChange({ brightness: parseFloat(e.target.value) })}
          />
        </div>

        <div className="config-field">
          <label>
            Contrast
            <span className="slider-value">{config.contrast.toFixed(2)}</span>
          </label>
          <input
            type="range"
            className="config-slider"
            min="0"
            max="2"
            step="0.1"
            value={config.contrast}
            onChange={(e) => onChange({ contrast: parseFloat(e.target.value) })}
          />
        </div>

        <div className="config-field">
          <label>
            Saturation
            <span className="slider-value">{config.saturation.toFixed(2)}</span>
          </label>
          <input
            type="range"
            className="config-slider"
            min="0"
            max="2"
            step="0.1"
            value={config.saturation}
            onChange={(e) => onChange({ saturation: parseFloat(e.target.value) })}
          />
        </div>

        <div className="config-field">
          <label>
            Hue Shift
            <span className="slider-value">{config.hueShift}°</span>
          </label>
          <input
            type="range"
            className="config-slider"
            min="0"
            max="360"
            step="1"
            value={config.hueShift}
            onChange={(e) => onChange({ hueShift: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="config-group">
        <h4>Effects</h4>
        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.invertColors}
              onChange={(e) => onChange({ invertColors: e.target.checked })}
            />
            Invert Colors
          </label>
        </div>

        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.enablePostProcessing}
              onChange={(e) => onChange({ enablePostProcessing: e.target.checked })}
            />
            Enable Post Processing
          </label>
        </div>
      </div>
    </div>
  );
};