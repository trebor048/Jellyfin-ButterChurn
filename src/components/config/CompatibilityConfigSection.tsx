import React from 'react';
import { CompatibilityConfig } from '../../config/types';

interface CompatibilityConfigSectionProps {
  config: CompatibilityConfig;
  onChange: (updates: Partial<CompatibilityConfig>) => void;
}

export const CompatibilityConfigSection: React.FC<CompatibilityConfigSectionProps> = ({ config, onChange }) => {
  return (
    <div className="config-section">
      <h3>Compatibility Configuration</h3>

      <div className="config-group">
        <h4>Fallbacks</h4>
        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.enableFallbacks}
              onChange={(e) => onChange({ enableFallbacks: e.target.checked })}
            />
            Enable Fallbacks
          </label>
        </div>
      </div>

      <div className="config-group">
        <h4>WebGL</h4>
        <div className="config-field">
          <label>WebGL Version</label>
          <select
            className="config-select"
            value={config.webglVersion}
            onChange={(e) => onChange({ webglVersion: e.target.value as CompatibilityConfig['webglVersion'] })}
          >
            <option value="auto">Auto-detect</option>
            <option value="webgl1">WebGL 1.0</option>
            <option value="webgl2">WebGL 2.0</option>
          </select>
        </div>

        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.forceSoftwareRendering}
              onChange={(e) => onChange({ forceSoftwareRendering: e.target.checked })}
            />
            Force Software Rendering
          </label>
        </div>
      </div>

      <div className="config-group">
        <h4>Audio API</h4>
        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.audioWorklet}
              onChange={(e) => onChange({ audioWorklet: e.target.checked })}
            />
            Enable Audio Worklet (Experimental)
          </label>
        </div>

        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.sharedArrayBuffer}
              onChange={(e) => onChange({ sharedArrayBuffer: e.target.checked })}
            />
            Enable Shared Array Buffer
          </label>
        </div>

        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.webAudioApi}
              onChange={(e) => onChange({ webAudioApi: e.target.checked })}
            />
            Enable Web Audio API
          </label>
        </div>
      </div>
    </div>
  );
};