
(function(global) {
    'use strict';

    var MilkdropPlugin = {
        name: "Milkdrop Visualizer",
        id: "milkdrop-visualizer",
        version: "1.0.0",

        init: function() {
            console.log('🎵 Milkdrop Visualizer Plugin v1.0.0 initialized');

            // Register page route
            if (global.ApiClient && global.ApiClient.registerRoute) {
                global.ApiClient.registerRoute('/milkdrop', this.createPage.bind(this));
            }

            // Register sidebar item
            this.registerSidebarItem();

            console.log('✅ Plugin loaded successfully');
            return Promise.resolve();
        },

        createPage: function() {
            return {
                render: this.renderPage.bind(this),
                destroy: this.destroyPage.bind(this)
            };
        },

        renderPage: function(container) {
            container.innerHTML = `
                <div class="milkdrop-container">
                    <div class="milkdrop-header">
                        <h1 class="milkdrop-title">🎵 Milkdrop Visualizer</h1>
                        <div class="milkdrop-subtitle">Professional butterchurn music visualization</div>
                    </div>

                    <div class="milkdrop-main">
                        <canvas id="milkdrop-canvas" class="milkdrop-canvas"></canvas>

                        <div class="milkdrop-controls">
                            <button id="milkdrop-play" class="control-btn play-btn">▶️ Play/Pause</button>
                            <button id="milkdrop-preset" class="control-btn preset-btn">🎨 Next Preset</button>
                            <button id="milkdrop-fullscreen" class="control-btn fullscreen-btn">⛶ Fullscreen</button>
                        </div>

                        <div class="milkdrop-info">
                            <div class="track-info">
                                <div class="track-title">Start playing music to see visualizations</div>
                                <div class="track-artist">Milkdrop Visualizer Ready</div>
                            </div>
                        </div>

                        <div class="milkdrop-shortcuts">
                            <div class="shortcut"><kbd>Space</kbd> Play/Pause</div>
                            <div class="shortcut"><kbd>F</kbd> Fullscreen</div>
                            <div class="shortcut"><kbd>P</kbd> Next Preset</div>
                        </div>
                    </div>
                </div>

                <style>
                    .milkdrop-container {
                        width: 100%;
                        height: 100vh;
                        background: #000;
                        color: white;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        overflow: hidden;
                    }

                    .milkdrop-header {
                        padding: 20px;
                        text-align: center;
                        background: rgba(0,0,0,0.8);
                    }

                    .milkdrop-title {
                        font-size: 2.5rem;
                        margin: 0 0 10px 0;
                        background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    .milkdrop-subtitle {
                        font-size: 1.1rem;
                        opacity: 0.8;
                        margin: 0;
                    }

                    .milkdrop-main {
                        padding: 20px;
                        max-width: 1200px;
                        margin: 0 auto;
                        height: calc(100vh - 120px);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 20px;
                    }

                    .milkdrop-canvas {
                        width: 100%;
                        max-width: 800px;
                        height: 450px;
                        border: 2px solid #333;
                        border-radius: 8px;
                        background: #111;
                    }

                    .milkdrop-controls {
                        display: flex;
                        gap: 15px;
                        flex-wrap: wrap;
                        justify-content: center;
                    }

                    .control-btn {
                        padding: 12px 24px;
                        border: none;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 120px;
                    }

                    .play-btn { background: #00bcd4; color: white; }
                    .preset-btn { background: #4caf50; color: white; }
                    .fullscreen-btn { background: #ff9800; color: white; }

                    .control-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    }

                    .milkdrop-info {
                        text-align: center;
                        opacity: 0.9;
                    }

                    .track-title {
                        font-size: 1.2rem;
                        font-weight: 600;
                        margin-bottom: 5px;
                    }

                    .track-artist {
                        font-size: 0.9rem;
                        opacity: 0.7;
                    }

                    .milkdrop-shortcuts {
                        display: flex;
                        gap: 20px;
                        justify-content: center;
                        flex-wrap: wrap;
                        opacity: 0.7;
                        font-size: 0.9rem;
                    }

                    .shortcut {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    kbd {
                        background: rgba(255,255,255,0.2);
                        padding: 2px 6px;
                        border-radius: 3px;
                        font-family: monospace;
                        font-size: 0.8rem;
                    }

                    @media (max-width: 768px) {
                        .milkdrop-title { font-size: 2rem; }
                        .milkdrop-canvas { height: 300px; }
                        .control-btn { min-width: 100px; padding: 10px 20px; }
                    }
                </style>
            `;

            this.initVisualizer(container);
            this.setupEventListeners(container);
            this.updateTrackInfo(container);
        },

        initVisualizer: function(container) {
            const canvas = container.querySelector('#milkdrop-canvas');
            if (!canvas) return;

            // Set canvas size
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;

            const loadScript = (url) => new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });

            Promise.all([
                loadScript('https://unpkg.com/butterchurn@latest/dist/butterchurn.min.js'),
                loadScript('https://unpkg.com/butterchurn-presets@latest/dist/butterchurnPresets.min.js')
            ]).then(() => {
                const butterchurn = window.butterchurn.default;
                const presets = window.butterchurnPresets.default.getPresets();
                const presetKeys = Object.keys(presets);
                let currentPresetIndex = Math.floor(Math.random() * presetKeys.length);

                const audioContext = new AudioContext();
                const visualizer = butterchurn.createVisualizer(audioContext, canvas, {
                    width: rect.width,
                    height: rect.height,
                    pixelRatio: window.devicePixelRatio,
                    textureRatio: 1
                });

                visualizer.loadPreset(presets[presetKeys[currentPresetIndex]], 0.0);

                let animationId;
                const render = () => {
                    visualizer.render();
                    animationId = requestAnimationFrame(render);
                };
                render();

                // Store for cleanup
                canvas._visualizer = visualizer;
                canvas._audioContext = audioContext;
                canvas._animationId = animationId;
                canvas._presets = presets;
                canvas._presetKeys = presetKeys;
                canvas._currentPresetIndex = currentPresetIndex;

                this.connectAudio(visualizer, audioContext);

                console.log('🎨 Milkdrop visualizer initialized with butterchurn');
            }).catch(err => {
                console.error('Failed to load butterchurn:', err);
            });
        },

        connectAudio: function(visualizer, audioContext) {
            const playbackManager = global.PlaybackManager;
            if (playbackManager && playbackManager._currentPlayer && playbackManager._currentPlayer._mediaElement) {
                const audioElement = playbackManager._currentPlayer._mediaElement;
                if (!audioElement._visualizerSource) {
                    const source = audioContext.createMediaElementSource(audioElement);
                    // Connect to speakers if not already (but usually the audio plays normally)
                    source.connect(audioContext.destination);
                    audioElement._visualizerSource = source;
                }
                visualizer.connectAudio(audioElement._visualizerSource);
                console.log('🔊 Connected to Jellyfin playback audio');
            } else {
                // Fallback to microphone
                navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
                    const source = audioContext.createMediaStreamSource(stream);
                    visualizer.connectAudio(source);
                    console.log('🎤 Connected to microphone');
                }).catch(err => {
                    console.error('Failed to access microphone:', err);
                });
            }
        },

        updateTrackInfo: function(container) {
            const playbackManager = global.PlaybackManager;
            const item = playbackManager.currentItem();
            const titleElem = container.querySelector('.track-title');
            const artistElem = container.querySelector('.track-artist');

            if (item) {
                titleElem.textContent = item.Name || 'Unknown Title';
                artistElem.textContent = item.Artists ? item.Artists.join(', ') : 'Unknown Artist';
            } else {
                titleElem.textContent = 'No track playing';
                artistElem.textContent = 'Start music in Jellyfin';
            }
        },

        setupEventListeners: function(container) {
            const playBtn = container.querySelector('#milkdrop-play');
            const presetBtn = container.querySelector('#milkdrop-preset');
            const fullscreenBtn = container.querySelector('#milkdrop-fullscreen');
            const canvas = container.querySelector('#milkdrop-canvas');
            const playbackManager = global.PlaybackManager;
            const Events = global.Events;

            if (playBtn) {
                playBtn.onclick = () => {
                    if (playbackManager) {
                        playbackManager.playPause();
                        this.updateTrackInfo(container);
                    }
                };
            }

            if (presetBtn) {
                presetBtn.onclick = () => {
                    if (canvas._visualizer && canvas._presetKeys && canvas._presets) {
                        canvas._currentPresetIndex = (canvas._currentPresetIndex + 1) % canvas._presetKeys.length;
                        canvas._visualizer.loadPreset(canvas._presets[canvas._presetKeys[canvas._currentPresetIndex]], 5.0);
                        console.log('🎨 Next preset loaded');
                    }
                };
            }

            if (fullscreenBtn) {
                fullscreenBtn.onclick = () => {
                    if (!document.fullscreenElement) {
                        container.requestFullscreen().catch(console.error);
                    } else {
                        document.exitFullscreen().catch(console.error);
                    }
                };
            }

            // Keyboard shortcuts
            const handleKeyPress = (e) => {
                switch (e.code) {
                    case 'Space':
                        e.preventDefault();
                        playBtn?.click();
                        break;
                    case 'KeyF':
                        e.preventDefault();
                        fullscreenBtn?.click();
                        break;
                    case 'KeyP':
                        e.preventDefault();
                        presetBtn?.click();
                        break;
                }
            };

            document.addEventListener('keydown', handleKeyPress);

            // Store for cleanup
            container._keyListener = handleKeyPress;

            // Playback events
            const updateTrack = () => this.updateTrackInfo(container);
            const reconnectAudio = () => {
                if (canvas._visualizer && canvas._audioContext) {
                    this.connectAudio(canvas._visualizer, canvas._audioContext);
                }
                updateTrack();
            };

            Events.on(playbackManager, 'playbackstart', reconnectAudio);
            Events.on(playbackManager, 'playbackstop', updateTrack);
            Events.on(playbackManager, 'playerchange', reconnectAudio);

            container._playbackListeners = [reconnectAudio, updateTrack];
        },

        registerSidebarItem: function() {
            if (global.ApiClient && global.ApiClient.registerPluginSidebarItem) {
                global.ApiClient.registerPluginSidebarItem({
                    name: 'Milkdrop Visualizer',
                    icon: 'music_note',
                    href: '#/milkdrop',
                    category: 'Media',
                    order: 4
                });
                console.log('✅ Sidebar item registered via API');
                return;
            }

            // Fallback: Manual DOM manipulation
            this.addSidebarItemToDOM();
        },

        addSidebarItemToDOM: function() {
            const addItem = () => {
                const sidebar = document.querySelector('.sidebar, .mainSidebar, [class*="sidebar"]');
                if (!sidebar) {
                    setTimeout(addItem, 1000);
                    return;
                }

                // Find media section
                const mediaSection = Array.from(document.querySelectorAll('.sidebar-section, [data-category], [class*="section"]'))
                    .find(el => el.textContent?.toLowerCase().includes('media') ||
                               el.querySelector('[href*="music"], [href*="playlist"], [href*="audio"]'));

                if (mediaSection) {
                    const link = document.createElement('a');
                    link.className = 'sidebar-link nav-link';
                    link.href = '#/milkdrop';
                    link.setAttribute('data-nav-item', 'true');
                    link.innerHTML = '<div class="sidebar-link-icon">🎵</div><div class="sidebar-link-text">Milkdrop Visualizer</div>';

                    mediaSection.appendChild(link);
                    console.log('✅ Sidebar item added to DOM');
                } else {
                    console.log('⚠️ Could not find media section, adding to general sidebar');
                    // Add to any sidebar as fallback
                    const link = document.createElement('a');
                    link.className = 'sidebar-link nav-link';
                    link.href = '#/milkdrop';
                    link.innerHTML = '<div class="sidebar-link-icon">🎵</div><div class="sidebar-link-text">Milkdrop Visualizer</div>';
                    sidebar.appendChild(link);
                }
            };

            setTimeout(addItem, 2000);
        },

        destroyPage: function(container) {
            // Cleanup animations
            const canvas = container.querySelector('#milkdrop-canvas');
            if (canvas && canvas._animationId) {
                cancelAnimationFrame(canvas._animationId);
            }

            // Remove event listeners
            if (container._keyListener) {
                document.removeEventListener('keydown', container._keyListener);
            }

            // Remove playback listeners
            const playbackManager = global.PlaybackManager;
            const Events = global.Events;
            if (container._playbackListeners && playbackManager) {
                Events.off(playbackManager, 'playbackstart', container._playbackListeners[0]);
                Events.off(playbackManager, 'playbackstop', container._playbackListeners[1]);
                Events.off(playbackManager, 'playerchange', container._playbackListeners[0]);
            }

            // Cleanup audio context
            if (canvas._audioContext) {
                canvas._audioContext.close().catch(console.error);
            }

            console.log('🗑️ Milkdrop page destroyed');
        }
    };

    // Register plugin
    if (global.Jellyfin && global.Jellyfin.PluginManager) {
        global.Jellyfin.PluginManager.register(MilkdropPlugin);
    } else if (global.PluginManager) {
        global.PluginManager.register(MilkdropPlugin);
    } else {
        // Fallback initialization
        global.MilkdropVisualizerPlugin = MilkdropPlugin;

        // Try to initialize when page is ready
        const initPlugin = () => {
            MilkdropPlugin.init().catch(console.error);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initPlugin);
        } else {
            setTimeout(initPlugin, 1000);
        }
    }

})(this || window);