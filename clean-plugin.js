const fs = require('fs');

// Clean, minimal Jellyfin plugin structure
const pluginContent = `// Jellyfin Milkdrop Visualizer Plugin
// Clean, minimal implementation

(function (global) {
    'use strict';

    // Plugin definition
    var MilkdropVisualizerPlugin = {
        name: "Milkdrop Visualizer",
        description: "Butterchurn music visualizer for Jellyfin",
        id: "milkdrop-visualizer",
        version: "1.0.0",

        // Plugin initialization
        init: function () {
            console.log('🎵 Milkdrop Visualizer Plugin loaded');

            // Register page route
            if (global.ApiClient && global.ApiClient.registerRoute) {
                global.ApiClient.registerRoute('/milkdrop', this.createPage.bind(this));
            }

            // Add to navigation
            this.addToNavigation();

            return Promise.resolve();
        },

        // Create the visualizer page
        createPage: function () {
            return {
                view: 'milkdrop-visualizer-view',
                controller: this,
                render: this.renderPage.bind(this),
                destroy: this.destroyPage.bind(this)
            };
        },

        // Render the page
        renderPage: function (view, params) {
            view.innerHTML = \`
                <div class="milkdrop-page">
                    <div class="milkdrop-header">
                        <h1>Milkdrop Visualizer</h1>
                        <p>Professional butterchurn music visualization</p>
                    </div>

                    <div class="milkdrop-content">
                        <div class="milkdrop-visualizer">
                            <canvas id="milkdrop-canvas" width="800" height="600"></canvas>
                        </div>

                        <div class="milkdrop-controls">
                            <button id="play-btn" class="btn btn-primary">▶️ Play</button>
                            <button id="preset-btn" class="btn">🎨 Next Preset</button>
                            <button id="fullscreen-btn" class="btn">⛶ Fullscreen</button>
                        </div>

                        <div class="milkdrop-info">
                            <div class="now-playing">
                                <h3>Now Playing</h3>
                                <p id="track-title">No track playing</p>
                                <p id="track-artist">Unknown artist</p>
                            </div>
                        </div>
                    </div>
                </div>
            \`;

            // Initialize visualizer
            this.initVisualizer(view);

            // Setup event listeners
            this.setupEventListeners(view);
        },

        // Initialize the butterchurn visualizer
        initVisualizer: function (view) {
            try {
                const canvas = view.querySelector('#milkdrop-canvas');
                if (!canvas) return;

                // Create basic visualizer placeholder
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                // Simple animated background as placeholder
                let animationId;
                const animate = () => {
                    const time = Date.now() * 0.001;
                    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

                    // Animated gradient
                    gradient.addColorStop(0, \`hsl(\${(time * 50) % 360}, 70%, 20%)\`);
                    gradient.addColorStop(0.5, \`hsl(\${(time * 30) % 360}, 80%, 30%)\`);
                    gradient.addColorStop(1, \`hsl(\${(time * 40) % 360}, 60%, 25%)\`);

                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Add some animated shapes
                    ctx.fillStyle = \`hsl(\${(time * 60) % 360}, 100%, 70%)\`;
                    for (let i = 0; i < 5; i++) {
                        const x = canvas.width * (0.2 + 0.6 * Math.sin(time + i));
                        const y = canvas.height * (0.2 + 0.6 * Math.cos(time * 0.7 + i));
                        const size = 20 + 10 * Math.sin(time * 2 + i);
                        ctx.beginPath();
                        ctx.arc(x, y, size, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    animationId = requestAnimationFrame(animate);
                };

                animate();

                // Store animation ID for cleanup
                canvas._animationId = animationId;

                console.log('🎨 Basic visualizer initialized');

            } catch (error) {
                console.error('Failed to initialize visualizer:', error);
                this.showFallbackVisualizer(view);
            }
        },

        // Fallback visualizer for when butterchurn fails
        showFallbackVisualizer: function (view) {
            const canvas = view.querySelector('#milkdrop-canvas');
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#fff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Milkdrop Visualizer', canvas.width / 2, canvas.height / 2 - 50);
            ctx.font = '16px Arial';
            ctx.fillText('Enhanced butterchurn coming soon...', canvas.width / 2, canvas.height / 2);
            ctx.fillText('Start playing music to see visualizations!', canvas.width / 2, canvas.height / 2 + 50);
        },

        // Setup event listeners
        setupEventListeners: function (view) {
            const playBtn = view.querySelector('#play-btn');
            const presetBtn = view.querySelector('#preset-btn');
            const fullscreenBtn = view.querySelector('#fullscreen-btn');

            if (playBtn) {
                playBtn.addEventListener('click', () => {
                    console.log('🎵 Play/Pause clicked');
                    // TODO: Integrate with Jellyfin playback API
                });
            }

            if (presetBtn) {
                presetBtn.addEventListener('click', () => {
                    console.log('🎨 Next preset clicked');
                    // TODO: Change butterchurn preset
                });
            }

            if (fullscreenBtn) {
                fullscreenBtn.addEventListener('click', () => {
                    if (!document.fullscreenElement) {
                        view.requestFullscreen().catch(console.error);
                    } else {
                        document.exitFullscreen().catch(console.error);
                    }
                });
            }

            // Keyboard shortcuts
            const handleKeyPress = (e) => {
                switch (e.code) {
                    case 'Space':
                        e.preventDefault();
                        console.log('🎵 Space: Play/Pause');
                        break;
                    case 'KeyF':
                        e.preventDefault();
                        console.log('⛶ F: Fullscreen toggle');
                        fullscreenBtn?.click();
                        break;
                    case 'KeyP':
                        e.preventDefault();
                        console.log('🎨 P: Next preset');
                        presetBtn?.click();
                        break;
                }
            };

            document.addEventListener('keydown', handleKeyPress);

            // Store for cleanup
            view._keyListener = handleKeyPress;
        },

        // Add to navigation/sidebar
        addToNavigation: function () {
            // Try to add to sidebar when DOM is ready
            const tryAddToSidebar = () => {
                const sidebar = document.querySelector('.sidebar');
                if (!sidebar) {
                    setTimeout(tryAddToSidebar, 1000);
                    return;
                }

                // Look for media section
                const mediaSection = Array.from(document.querySelectorAll('.sidebar-section, [data-category]'))
                    .find(el => el.textContent?.toLowerCase().includes('media') ||
                               el.querySelector('[href*="music"], [href*="playlist"]'));

                if (mediaSection) {
                    const link = document.createElement('a');
                    link.className = 'sidebar-link';
                    link.href = '#/milkdrop';
                    link.innerHTML = '<div class="sidebar-link-icon">🎵</div><div class="sidebar-link-text">Milkdrop Visualizer</div>';

                    mediaSection.appendChild(link);
                    console.log('✅ Added Milkdrop Visualizer to sidebar');
                } else {
                    console.log('⚠️ Could not find media section in sidebar');
                }
            };

            // Wait for page to load
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', tryAddToSidebar);
            } else {
                setTimeout(tryAddToSidebar, 2000);
            }
        },

        // Destroy the page
        destroyPage: function (view) {
            // Cleanup animations
            const canvas = view.querySelector('#milkdrop-canvas');
            if (canvas && canvas._animationId) {
                cancelAnimationFrame(canvas._animationId);
            }

            // Remove event listeners
            if (view._keyListener) {
                document.removeEventListener('keydown', view._keyListener);
            }

            console.log('🗑️ Milkdrop Visualizer page destroyed');
        }
    };

    // Register plugin with Jellyfin
    if (global.Jellyfin && global.Jellyfin.PluginManager) {
        global.Jellyfin.PluginManager.register(MilkdropVisualizerPlugin);
    } else if (global.PluginManager) {
        global.PluginManager.register(MilkdropVisualizerPlugin);
    } else {
        // Fallback: expose globally and try to initialize
        global.MilkdropVisualizerPlugin = MilkdropVisualizerPlugin;

        // Try to initialize when page is ready
        const initPlugin = () => {
            MilkdropVisualizerPlugin.init().catch(console.error);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPlugin);
        } else {
            setTimeout(initPlugin, 1000);
        }
    }

    return MilkdropVisualizerPlugin;

})(this || window);