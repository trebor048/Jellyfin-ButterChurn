import React from 'react';
import { PresetsConfig } from '../../config/types';

interface PresetsConfigSectionProps {
  config: PresetsConfig;
  onChange: (updates: Partial<PresetsConfig>) => void;
}

export const PresetsConfigSection: React.FC<PresetsConfigSectionProps> = ({ config, onChange }) => {
  return (
    <div className="config-section">
      <h3>Presets Configuration</h3>

      <div className="config-group">
        <h4>Current Preset</h4>
        <div className="config-field">
          <label>Current Preset</label>
          <input
            type="text"
            className="config-input"
            value={config.currentPreset}
            onChange={(e) => onChange({ currentPreset: e.target.value })}
            placeholder="Enter preset name or 'random'"
          />
        </div>
      </div>

      <div className="config-group">
        <h4>Auto Switching</h4>
        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.autoSwitchPresets}
              onChange={(e) => onChange({ autoSwitchPresets: e.target.checked })}
            />
            Auto-switch Presets
          </label>
        </div>

        {config.autoSwitchPresets && (
          <>
            <div className="config-field">
              <label>
                Switch Interval: {config.switchInterval}s
                <span className="slider-value">{config.switchInterval}s</span>
              </label>
              <input
                type="range"
                className="config-slider"
                min="10"
                max="300"
                step="5"
                value={config.switchInterval}
                onChange={(e) => onChange({ switchInterval: parseInt(e.target.value) })}
              />
            </div>

            <div className="config-field">
              <label>
                <input
                  type="checkbox"
                  className="config-checkbox"
                  checked={config.shufflePresets}
                  onChange={(e) => onChange({ shufflePresets: e.target.checked })}
                />
                Shuffle Presets
              </label>
            </div>
          </>
        )}
      </div>

      <div className="config-group">
        <h4>Transition</h4>
        <div className="config-field">
          <label>
            Transition Time: {config.presetTransitionTime}s
            <span className="slider-value">{config.presetTransitionTime}s</span>
          </label>
          <input
            type="range"
            className="config-slider"
            min="0"
            max="10"
            step="0.5"
            value={config.presetTransitionTime}
            onChange={(e) => onChange({ presetTransitionTime: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      <div className="config-group">
        <h4>Favorite Presets</h4>
        <div className="config-field">
          <label>Favorites (comma-separated)</label>
          <input
            type="text"
            className="config-input"
            value={config.favoritePresets.join(', ')}
            onChange={(e) => onChange({
              favoritePresets: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            })}
            placeholder="Enter preset names separated by commas"
          />
        </div>
      </div>
    </div>
  );
};