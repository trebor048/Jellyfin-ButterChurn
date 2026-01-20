import React from 'react';
import { createRoot } from 'react-dom/client';
import { MilkdropVisualizerPage } from './components/MilkdropVisualizerPage';
import { registerRoute } from './routes';
import { registerSidebarItem } from './sidebar';
import { ConfigManager } from './config/ConfigManager';

// Initialize configuration manager
ConfigManager.getInstance();

// Register the route for the Milkdrop Visualizer page
registerRoute('/milkdrop', MilkdropVisualizerPage);

// Register the sidebar item
registerSidebarItem();

// Export for Jellyfin plugin system
export default {
  name: 'Milkdrop Visualizer',
  version: '1.0.0',
  routes: {
    '/milkdrop': MilkdropVisualizerPage
  },
  onPluginLoad: () => {
    // Initialize the plugin when loaded
    console.log('Milkdrop Visualizer plugin loaded');

    // Ensure configuration is loaded
    const config = ConfigManager.getInstance().getConfig();
    console.log('Plugin configuration loaded:', config);
  },
  // Expose configuration API for external access
  getConfig: () => ConfigManager.getInstance().getConfig(),
  updateConfig: (updates: any) => ConfigManager.getInstance().updateConfig(updates),
  resetConfig: () => ConfigManager.getInstance().resetToDefaults(),
  exportConfig: () => ConfigManager.getInstance().exportConfig(),
  importConfig: (jsonString: string) => ConfigManager.getInstance().importConfig(jsonString)
};