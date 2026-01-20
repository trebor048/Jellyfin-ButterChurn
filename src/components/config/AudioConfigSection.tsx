import React from 'react';
import { AudioConfig } from '../../config/types';

interface AudioConfigSectionProps {
  config: AudioConfig;
  onChange: (updates: Partial<AudioConfig>) => void;
}

export const AudioConfigSection: React.FC<AudioConfigSectionProps> = ({ config, onChange }) => {
  return (
    <div className="config-section">
      <h3>Audio Configuration</h3>

      <div className="config-group">
        <h4>Audio Source</h4>
        <div className="config-field">
          <label>Source</label>
          <select
            className="config-select"
            value={config.source}
            onChange={(e) => onChange({ source: e.target.value as AudioConfig['source'] })}
          >
            <option value="jellyfin">Jellyfin Playback</option>
            <option value="microphone">Microphone</option>
            <option value="system">System Audio</option>
            <option value="demo">Demo/Synthetic</option>
          </select>
        </div>
      </div>

      <div className="config-group">
        <h4>Audio Analysis</h4>
        <div className="config-field">
          <label>
            Sensitivity
            <span className="slider-value">{config.sensitivity.toFixed(2)}</span>
          </label>
          <input
            type="range"
            className="config-slider"
            min="0"
            max="2"
            step="0.1"
            value={config.sensitivity}
            onChange={(e) => onChange({ sensitivity: parseFloat(e.target.value) })}
          />
        </div>

        <div className="config-field">
          <label>
            Smoothing
            <span className="slider-value">{config.smoothing.toFixed(2)}</span>
          </label>
          <input
            type="range"
            className="config-slider"
            min="0"
            max="1"
            step="0.01"
            value={config.smoothing}
            onChange={(e) => onChange({ smoothing: parseFloat(e.target.value) })}
          />
        </div>

        <div className="config-field">
          <label>FFT Size</label>
          <select
            className="config-select"
            value={config.fftSize}
            onChange={(e) => onChange({ fftSize: parseInt(e.target.value) })}
          >
            <option value="256">256 (Low Quality)</option>
            <option value="512">512 (Low Quality)</option>
            <option value="1024">1024 (Medium Quality)</option>
            <option value="2048">2048 (High Quality)</option>
            <option value="4096">4096 (Very High Quality)</option>
            <option value="8192">8192 (Ultra Quality)</option>
          </select>
        </div>

        <div className="config-field">
          <label>
            Min Decibels: {config.minDecibels}dB
            <span className="slider-value">{config.minDecibels}</span>
          </label>
          <input
            type="range"
            className="config-slider"
            min="-90"
            max="-10"
            step="1"
            value={config.minDecibels}
            onChange={(e) => onChange({ minDecibels: parseInt(e.target.value) })}
          />
        </div>

        <div className="config-field">
          <label>
            Max Decibels: {config.maxDecibels}dB
            <span className="slider-value">{config.maxDecibels}</span>
          </label>
          <input
            type="range"
            className="config-slider"
            min="-10"
            max="0"
            step="1"
            value={config.maxDecibels}
            onChange={(e) => onChange({ maxDecibels: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="config-group">
        <h4>Equalizer</h4>
        <div className="config-field">
          <label>
            <input
              type="checkbox"
              className="config-checkbox"
              checked={config.enableEqualizer}
              onChange={(e) => onChange({ enableEqualizer: e.target.checked })}
            />
            Enable Equalizer
          </label>
        </div>

        {config.enableEqualizer && (
          <div className="equalizer-bands">
            {[32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000].map((freq, index) => (
              <div key={freq} className="config-field">
                <label>
                  {freq}Hz
                  <span className="slider-value">{config.equalizerBands[index]}dB</span>
                </label>
                <input
                  type="range"
                  className="config-slider"
                  min="-12"
                  max="12"
                  step="0.5"
                  value={config.equalizerBands[index]}
                  onChange={(e) => {
                    const newBands = [...config.equalizerBands];
                    newBands[index] = parseFloat(e.target.value);
                    onChange({ equalizerBands: newBands });
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};