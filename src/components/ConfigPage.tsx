import React, { useState, useEffect } from 'react';
import { PluginConfig } from '../config/types';
import { ConfigManager } from '../config/ConfigManager';
import { AudioConfigSection } from './config/AudioConfigSection';
import { VisualizerConfigSection } from './config/VisualizerConfigSection';
import { ControlsConfigSection } from './config/ControlsConfigSection';
import { PresetsConfigSection } from './config/PresetsConfigSection';
import { PerformanceConfigSection } from './config/PerformanceConfigSection';
import { CompatibilityConfigSection } from './config/CompatibilityConfigSection';
import './ConfigPage.css';

interface ConfigPageProps {
  onClose: () => void;
}

export const ConfigPage: React.FC<ConfigPageProps> = ({ onClose }) => {
  const [config, setConfig] = useState<PluginConfig>(ConfigManager.getInstance().getConfig());
  const [activeTab, setActiveTab] = useState<'audio' | 'visualizer' | 'controls' | 'presets' | 'performance' | 'compatibility'>('audio');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const unsubscribe = ConfigManager.getInstance().subscribe((newConfig) => {
      setConfig(newConfig);
      setHasChanges(false);
    });

    return unsubscribe;
  }, []);

  const handleConfigChange = (updates: Partial<PluginConfig>) => {
    ConfigManager.getInstance().updateConfig(updates);
    setHasChanges(true);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      ConfigManager.getInstance().resetToDefaults();
    }
  };

  const handleExportConfig = () => {
    const configJson = ConfigManager.getInstance().exportConfig();
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'milkdrop-visualizer-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = ConfigManager.getInstance().importConfig(content);
      if (!result.success) {
        alert(`Failed to import config: ${result.error}`);
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'audio' as const, label: 'Audio', icon: '🔊' },
    { id: 'visualizer' as const, label: 'Visualizer', icon: '🎨' },
    { id: 'controls' as const, label: 'Controls', icon: '🎛️' },
    { id: 'presets' as const, label: 'Presets', icon: '📚' },
    { id: 'performance' as const, label: 'Performance', icon: '⚡' },
    { id: 'compatibility' as const, label: 'Compatibility', icon: '🔧' }
  ];

  return (
    <div className="config-page">
      <div className="config-header">
        <h2>Milkdrop Visualizer Settings</h2>
        <div className="config-actions">
          <button onClick={handleExportConfig} className="config-btn secondary">
            Export Config
          </button>
          <label className="config-btn secondary">
            Import Config
            <input
              type="file"
              accept=".json"
              onChange={handleImportConfig}
              style={{ display: 'none' }}
            />
          </label>
          <button onClick={handleResetToDefaults} className="config-btn danger">
            Reset to Defaults
          </button>
          <button onClick={onClose} className="config-btn primary">
            Close
          </button>
        </div>
      </div>

      <div className="config-content">
        <div className="config-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`config-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="config-panel">
          {activeTab === 'audio' && (
            <AudioConfigSection
              config={config.audio}
              onChange={(updates) => handleConfigChange({ audio: { ...config.audio, ...updates } })}
            />
          )}
          {activeTab === 'visualizer' && (
            <VisualizerConfigSection
              config={config.visualizer}
              onChange={(updates) => handleConfigChange({ visualizer: { ...config.visualizer, ...updates } })}
            />
          )}
          {activeTab === 'controls' && (
            <ControlsConfigSection
              config={config.controls}
              onChange={(updates) => handleConfigChange({ controls: { ...config.controls, ...updates } })}
            />
          )}
          {activeTab === 'presets' && (
            <PresetsConfigSection
              config={config.presets}
              onChange={(updates) => handleConfigChange({ presets: { ...config.presets, ...updates } })}
            />
          )}
          {activeTab === 'performance' && (
            <PerformanceConfigSection
              config={config.performance}
              onChange={(updates) => handleConfigChange({ performance: { ...config.performance, ...updates } })}
            />
          )}
          {activeTab === 'compatibility' && (
            <CompatibilityConfigSection
              config={config.compatibility}
              onChange={(updates) => handleConfigChange({ compatibility: { ...config.compatibility, ...updates } })}
            />
          )}
        </div>
      </div>

      {hasChanges && (
        <div className="config-unsaved">
          ⚠️ You have unsaved changes. Settings are automatically saved.
        </div>
      )}
    </div>
  );
};