import { PluginConfig, DEFAULT_CONFIG } from './types';

export class ConfigManager {
  private static instance: ConfigManager;
  private config: PluginConfig = { ...DEFAULT_CONFIG };
  private storageKey = 'jellyfin-milkdrop-visualizer-config';
  private subscribers: Array<(config: PluginConfig) => void> = [];

  private constructor() {
    this.loadConfig();
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  // Load configuration from localStorage or use defaults
  private loadConfig(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.config = this.mergeWithDefaults(parsed);
      } else {
        this.config = { ...DEFAULT_CONFIG };
      }
    } catch (error) {
      console.warn('Failed to load config, using defaults:', error);
      this.config = { ...DEFAULT_CONFIG };
    }
  }

  // Save configuration to localStorage
  private saveConfig(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  // Merge user config with defaults to ensure all properties exist
  private mergeWithDefaults(userConfig: Partial<PluginConfig>): PluginConfig {
    const merged = { ...DEFAULT_CONFIG };

    // Deep merge function
    const deepMerge = (target: any, source: any): any => {
      if (source === null || typeof source !== 'object') return source;
      if (Array.isArray(source)) return [...source];

      const result = { ...target };
      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
            result[key] = deepMerge(target[key] || {}, source[key]);
          } else {
            result[key] = source[key];
          }
        }
      }
      return result;
    };

    return deepMerge(merged, userConfig);
  }

  // Get current configuration
  getConfig(): PluginConfig {
    return { ...this.config };
  }

  // Update configuration
  updateConfig(updates: Partial<PluginConfig>): void {
    const newConfig = this.mergeWithDefaults({ ...this.config, ...updates });
    this.config = newConfig;
    this.saveConfig();
    this.notifySubscribers();
  }

  // Update specific section
  updateSection<K extends keyof PluginConfig>(section: K, updates: Partial<PluginConfig[K]>): void {
    const newConfig = { ...this.config };
    newConfig[section] = { ...(newConfig[section] as any), ...updates };
    this.config = newConfig;
    this.saveConfig();
    this.notifySubscribers();
  }

  // Reset to defaults
  resetToDefaults(): void {
    this.config = { ...DEFAULT_CONFIG };
    this.saveConfig();
    this.notifySubscribers();
  }

  // Subscribe to config changes
  subscribe(callback: (config: PluginConfig) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify all subscribers of config changes
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback(this.getConfig());
      } catch (error) {
        console.error('Error in config subscriber:', error);
      }
    });
  }

  // Validate configuration
  validateConfig(config: Partial<PluginConfig>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Audio validation
    if (config.audio) {
      if (config.audio.sensitivity < 0 || config.audio.sensitivity > 2) {
        errors.push('Audio sensitivity must be between 0 and 2');
      }
      if (config.audio.smoothing < 0 || config.audio.smoothing > 1) {
        errors.push('Audio smoothing must be between 0 and 1');
      }
      if (![256, 512, 1024, 2048, 4096, 8192].includes(config.audio.fftSize)) {
        errors.push('FFT size must be 256, 512, 1024, 2048, 4096, or 8192');
      }
    }

    // Visualizer validation
    if (config.visualizer) {
      if (config.visualizer.gamma < 0.5 || config.visualizer.gamma > 3.0) {
        errors.push('Gamma must be between 0.5 and 3.0');
      }
      if (config.visualizer.brightness < 0 || config.visualizer.brightness > 2) {
        errors.push('Brightness must be between 0 and 2');
      }
    }

    // Performance validation
    if (config.performance) {
      if (![30, 60, 120].includes(config.performance.targetFps)) {
        errors.push('Target FPS must be 30, 60, or 120');
      }
    }

    return { valid: errors.length === 0, errors };
  }

  // Export configuration as JSON string
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  // Import configuration from JSON string
  importConfig(jsonString: string): { success: boolean; error?: string } {
    try {
      const imported = JSON.parse(jsonString);
      const validation = this.validateConfig(imported);

      if (!validation.valid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      this.config = this.mergeWithDefaults(imported);
      this.saveConfig();
      this.notifySubscribers();
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: `Invalid JSON: ${errorMessage}` };
    }
  }
}