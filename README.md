# Jellyfin Milkdrop Visualizer Plugin

A Jellyfin plugin that adds a Milkdrop visualizer tab to the sidebar, providing butterchurn visualizations synced to your currently playing music.

## ✨ Features

### 🎨 **Advanced Visualization**
- **Butterchurn Integration**: Full butterchurn visualizer with all presets
- **Multiple Quality Levels**: Low, Medium, High, and Ultra quality rendering
- **Real-time Effects**: Gamma, brightness, contrast, saturation, and hue controls
- **Blend Modes**: Normal, Additive, Multiply, and Screen blending
- **Post-processing**: Advanced visual effects and filters

### 🎵 **Enhanced Audio Processing**
- **Multiple Audio Sources**: Jellyfin playback, microphone, system audio, or demo
- **Advanced Analysis**: Configurable FFT size, sensitivity, and smoothing
- **10-Band Equalizer**: Real-time frequency adjustment
- **Audio Worklet Support**: Modern Web Audio API integration

### 🎛️ **Comprehensive Controls**
- **Smart Media Controls**: Auto-hide on mouse inactivity
- **Multiple Positions**: Bottom, top, left, or right placement
- **Customizable Styling**: Size, theme (dark/light/auto), and opacity
- **Touch Gestures**: Mobile-friendly touch controls
- **Keyboard Shortcuts**: Full keyboard navigation support

### ⚙️ **Extensive Configuration**
- **Preset Management**: Auto-switching, favorites, and custom presets
- **Performance Tuning**: FPS targets, memory management, V-Sync control
- **Compatibility Options**: WebGL versions, fallbacks, and browser compatibility
- **Import/Export**: Save and share your configurations

### 🛡️ **Robust & Reliable**
- **Error Boundaries**: Graceful error handling with recovery options
- **Fallback Systems**: Automatic degradation for older browsers
- **Configuration Persistence**: Settings saved across sessions
- **Comprehensive Logging**: Debug information for troubleshooting

## Installation

### Option 1: Pre-built Bundle (Recommended)
```bash
# The dist/ directory already contains the production-ready plugin
# Simply copy the files to your Jellyfin plugins directory
```

### Option 2: Build from Source
```bash
# Install dependencies
npm install

# Create production bundle (works reliably)
npm run build:bundle

# Alternative: Try webpack build (may require additional configuration)
npm run build
```

### Install in Jellyfin
1. **Copy Files:**
   - Copy `dist/main.js` to your Jellyfin plugins directory
   - Copy `dist/plugin.json` to the same directory

2. **Restart Jellyfin:**
   - Restart your Jellyfin server

3. **Enable Plugin:**
   - Go to Jellyfin web interface → Dashboard → Plugins
   - Enable the "Milkdrop Visualizer" plugin

4. **Access:**
   - The "Milkdrop Visualizer" tab will appear in the sidebar under Media
   - Click it to open the visualizer

## 🚀 Usage

### Basic Setup
1. After installation, you'll see "Milkdrop Visualizer" in the sidebar under Media
2. Click on it to open the visualizer
3. Start playing music in Jellyfin
4. The visualizer will automatically sync with your music

### Configuration
1. Click the **"⚙️ Settings"** button in the header to open the configuration panel
2. Customize audio settings, visual effects, controls, and performance options
3. Settings are automatically saved and persist across sessions

### Controls
- **Mouse Movement**: Shows/hides media controls (configurable auto-hide delay)
- **Header Toggle**: Hide/show header for full-screen experience
- **Keyboard Shortcuts**: Space (play/pause), arrows (navigation), H (toggle header), F (fullscreen)
- **Touch Gestures**: Swipe controls for mobile devices

### Audio Sources
- **Jellyfin**: Sync with Jellyfin's internal audio (recommended)
- **Microphone**: Use system microphone for live audio
- **System Audio**: Capture system-wide audio output
- **Demo**: Synthetic audio for testing without music

### Presets
- **Manual Selection**: Choose specific presets from the dropdown
- **Auto-switching**: Automatically cycle through presets
- **Favorites**: Mark and quickly access favorite presets
- **Shuffle**: Random preset selection

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Project Structure

```
src/
├── components/
│   ├── MilkdropVisualizerPage.tsx    # Main page component
│   ├── Visualizer.tsx                 # Butterchurn visualizer
│   ├── MediaControls.tsx             # Media controls bar
│   ├── Header.tsx                    # Toggleable header
│   └── types.ts                      # TypeScript interfaces
├── services/
│   └── MusicSyncService.ts           # Audio sync service
├── routes.ts                         # Route registration
├── sidebar.ts                        # Sidebar integration
└── index.tsx                         # Plugin entry point
```

## Audio Sync Implementation

The plugin attempts to sync with Jellyfin's audio output. Currently, it includes:

- Audio context initialization for Web Audio API
- Analyser node for frequency data extraction
- Fallback to microphone input for demo purposes
- Volume sync with Jellyfin's playback controls

**Note:** Full audio sync with Jellyfin's internal player may require additional integration work depending on your Jellyfin version.

## Customization

### Changing Presets

The visualizer currently loads a random preset on startup. To customize:

1. Import specific presets from `butterchurn-presets`
2. Modify the preset loading logic in `Visualizer.tsx`

### Styling

- Media controls: `src/components/MediaControls.css`
- Header: `src/components/Header.css`
- Main page: `src/components/MilkdropVisualizerPage.css`

## Browser Compatibility

- Chrome 66+
- Firefox 60+
- Safari 14+
- Edge 79+

## License

This plugin is released under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Visualizer not showing
- Check browser console for errors
- Ensure butterchurn dependencies are properly loaded
- Try refreshing the page

### Audio sync not working
- Check browser permissions for microphone access
- Ensure you're playing music in Jellyfin
- Check browser console for Web Audio API errors

### Plugin not loading
- Verify plugin files are in the correct directory
- Check Jellyfin server logs
- Ensure plugin.json is valid JSON