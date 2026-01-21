
(function(global) {
    'use strict';

    var MilkdropWebPlugin = {
        name: "Milkdrop Visualizer",
        id: "milkdrop-visualizer",
        version: "1.0.0",

        init: function() {
            console.log('🎵 Milkdrop Visualizer Web Plugin loaded');

            // Register routes
            if (global.ApiClient && global.ApiClient.registerRoute) {
                global.ApiClient.registerRoute('/milkdrop', this.createPage.bind(this));
            }

            // Add to sidebar
            this.addToSidebar();

            return Promise.resolve();
        },

        createPage: function() {
            return {
                render: function(container) {
                    container.innerHTML = `
                        <div style="padding: 20px; color: white; background: #000; min-height: 100vh;">
                            <h1 style="color: #00bcd4; text-align: center;">🎵 Milkdrop Visualizer</h1>
                            <p style="text-align: center; opacity: 0.8;">Web Client Version</p>

                            <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                                <canvas id="web-visualizer" width="800" height="600" style="border: 1px solid #333; background: #111;"></canvas>

                                <div style="margin: 20px 0;">
                                    <button id="web-play-btn" style="padding: 10px 20px; margin: 0 10px; background: #00bcd4; color: white; border: none; border-radius: 5px; cursor: pointer;">▶️ Play/Pause</button>
                                    <button id="web-preset-btn" style="padding: 10px 20px; margin: 0 10px; background: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer;">🎨 Next Preset</button>
                                    <button id="web-fullscreen-btn" style="padding: 10px 20px; margin: 0 10px; background: #ff9800; color: white; border: none; border-radius: 5px; cursor: pointer;">⛶ Fullscreen</button>
                                </div>

                                <div class="web-track-info" style="text-align: center; opacity: 0.9;">
                                    <div class="web-track-title" style="font-size: 1.2rem; font-weight: 600; margin-bottom: 5px;">Start playing music to see visualizations</div>
                                    <div class="web-track-artist" style="font-size: 0.9rem; opacity: 0.7;">Milkdrop Visualizer Ready</div>
                                </div>

                                <p style="opacity: 0.6; font-style: italic;">
                                    🌐 Web Client Plugin - Enhanced features available in full version!
                                </p>
                            </div>
                        </div>
                    `;

                    // Load butterchurn
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

                        const canvas = container.querySelector('#web-visualizer');
                        const audioContext = new AudioContext();
                        const visualizer = butterchurn.createVisualizer(audioContext, canvas, {
                            width: canvas.width,
                            height: canvas.height
                        });

                        visualizer.loadPreset(presets[presetKeys[currentPresetIndex]], 0.0);

                        let animationId;
                        const render = () => {
                            visualizer.render();
                            animationId = requestAnimationFrame(render);
                        };
                        render();

                        // Connect audio (similar to main plugin)
                        const connectAudio = () => {
                            const playbackManager = global.PlaybackManager;
                            if (playbackManager && playbackManager._currentPlayer && playbackManager._currentPlayer._mediaElement) {
                                const audioElement = playbackManager._currentPlayer._mediaElement;
                                if (!audioElement._visualizerSource) {
                                    const source = audioContext.createMediaElementSource(audioElement);
                                    source.connect(audioContext.destination);
                                    audioElement._visualizerSource = source;
                                }
                                visualizer.connectAudio(audioElement._visualizerSource);
                            } else {
                                navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
                                    const source = audioContext.createMediaStreamSource(stream);
                                    visualizer.connectAudio(source);
                                });
                            }
                        };
                        connectAudio();

                        // Update track info
                        const updateTrackInfo = () => {
                            const item = global.PlaybackManager.currentItem();
                            const titleElem = container.querySelector('.web-track-title');
                            const artistElem = container.querySelector('.web-track-artist');
                            if (item) {
                                titleElem.textContent = item.Name || 'Unknown Title';
                                artistElem.textContent = item.Artists ? item.Artists.join(', ') : 'Unknown Artist';
                            } else {
                                titleElem.textContent = 'No track playing';
                                artistElem.textContent = 'Start music in Jellyfin';
                            }
                        };
                        updateTrackInfo();

                        // Event listeners
                        const playBtn = container.querySelector('#web-play-btn');
                        const presetBtn = container.querySelector('#web-preset-btn');
                        const fullscreenBtn = container.querySelector('#web-fullscreen-btn');

                        if (playBtn) playBtn.onclick = () => {
                            global.PlaybackManager.playPause();
                            updateTrackInfo();
                        };
                        if (presetBtn) presetBtn.onclick = () => {
                            currentPresetIndex = (currentPresetIndex + 1) % presetKeys.length;
                            visualizer.loadPreset(presets[presetKeys[currentPresetIndex]], 5.0);
                        };
                        if (fullscreenBtn) fullscreenBtn.onclick = () => {
                            if (!document.fullscreenElement) {
                                container.requestFullscreen().catch(console.error);
                            } else {
                                document.exitFullscreen().catch(console.error);
                            }
                        };

                        // Playback events
                        global.Events.on(global.PlaybackManager, 'playbackstart', () => { connectAudio(); updateTrackInfo(); });
                        global.Events.on(global.PlaybackManager, 'playbackstop', updateTrackInfo);
                        global.Events.on(global.PlaybackManager, 'playerchange', connectAudio);

                    }).catch(console.error);
                }
            };
        },

        addToSidebar: function() {
            const checkSidebar = () => {
                const sidebar = document.querySelector('.sidebar');
                if (!sidebar) {
                    setTimeout(checkSidebar, 1000);
                    return;
                }

                const link = document.createElement('a');
                link.className = 'sidebar-link';
                link.href = '#/milkdrop';
                link.innerHTML = '<div class="sidebar-link-icon">🎵</div><div class="sidebar-link-text">Milkdrop Visualizer</div>';

                const mediaSection = sidebar.querySelector('[data-category="Media"]') ||
                                   sidebar.querySelector('.sidebar-section');

                if (mediaSection) {
                    mediaSection.appendChild(link);
                }

                console.log('✅ Milkdrop Visualizer (Web) added to sidebar');
            };

            setTimeout(checkSidebar, 2000);
        }
    };

    // Register web plugin
    if (global.Jellyfin && global.Jellyfin.PluginManager) {
        global.Jellyfin.PluginManager.register(MilkdropWebPlugin);
    } else {
        global.MilkdropWebPlugin = MilkdropWebPlugin;
        setTimeout(() => MilkdropWebPlugin.init(), 1000);
    }

})(window);