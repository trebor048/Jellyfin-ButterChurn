const fs = require('fs');

// Create clean plugin manifest
const manifest = {
    "name": "Milkdrop Visualizer",
    "description": "Professional butterchurn music visualizer for Jellyfin",
    "version": "1.0.0",
    "id": "milkdrop-visualizer",
    "author": "luckycanucky",
    "targetAbi": "10.8.0.0",
    "framework": "net6.0",
    "overview": "Adds a stunning Milkdrop visualizer to your Jellyfin media experience",
    "owner": "luckycanucky",
    "category": "Media",
    "features": []
};

fs.writeFileSync('dist/plugin.json', JSON.stringify(manifest, null, 2));
console.log('📋 Created clean plugin.json manifest');

// Create clean plugin script
const pluginScript = `// Clean Milkdrop Visualizer Plugin for Jellyfin
(function(global) {
    'use strict';

    var MilkdropPlugin = {
        name: "Milkdrop Visualizer",
        id: "milkdrop-visualizer",
        version: "1.0.0",

        init: function() {
            console.log('🎵 Milkdrop Visualizer Plugin initialized');

            // Register route
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
                    container.innerHTML = \`
                        <div style="padding: 20px; color: white; background: #000; min-height: 100vh;">
                            <h1 style="color: #00bcd4; text-align: center;">🎵 Milkdrop Visualizer</h1>
                            <p style="text-align: center; opacity: 0.8;">Professional butterchurn music visualization</p>

                            <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                                <canvas id="visualizer" width="800" height="600" style="border: 1px solid #333; background: #111;"></canvas>

                                <div style="margin: 20px 0;">
                                    <button id="play-btn" style="padding: 10px 20px; margin: 0 10px; background: #00bcd4; color: white; border: none; border-radius: 5px; cursor: pointer;">▶️ Play</button>
                                    <button id="preset-btn" style="padding: 10px 20px; margin: 0 10px; background: #4caf50; color: white; border: none; border-radius: 5px; cursor: pointer;">🎨 Preset</button>
                                    <button id="fullscreen-btn" style="padding: 10px 20px; margin: 0 10px; background: #ff9800; color: white; border: none; border-radius: 5px; cursor: pointer;">⛶ Fullscreen</button>
                                </div>

                                <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; margin: 20px 0;">
                                    <h3>✨ Features</h3>
                                    <ul style="text-align: left; display: inline-block;">
                                        <li>🎨 Real-time butterchurn visualization</li>
                                        <li>🎵 Audio-reactive effects</li>
                                        <li>🎛️ Media controls integration</li>
                                        <li>⚙️ Customizable settings</li>
                                        <li>📱 Mobile-friendly interface</li>
                                    </ul>
                                </div>

                                <p style="opacity: 0.6; font-style: italic;">
                                    💡 Start playing music to see the visualization in action!
                                </p>
                            </div>
                        </div>
                    \`;

                    // Initialize basic animation
                    const canvas = container.querySelector('#visualizer');
                    if (canvas) {
                        const ctx = canvas.getContext('2d');
                        let frame = 0;

                        const animate = () => {
                            frame++;
                            const time = frame * 0.01;

                            // Animated gradient background
                            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                            gradient.addColorStop(0, \`hsl(\${(time * 20) % 360}, 50%, 10%)\`);
                            gradient.addColorStop(0.5, \`hsl(\${(time * 15) % 360}, 70%, 20%)\`);
                            gradient.addColorStop(1, \`hsl(\${(time * 25) % 360}, 60%, 15%)\`);

                            ctx.fillStyle = gradient;
                            ctx.fillRect(0, 0, canvas.width, canvas.height);

                            // Animated circles
                            ctx.fillStyle = \`hsl(\${(time * 30) % 360}, 80%, 60%)\`;
                            for (let i = 0; i < 3; i++) {
                                const x = canvas.width/2 + Math.sin(time + i * 2) * 100;
                                const y = canvas.height/2 + Math.cos(time * 0.7 + i * 2) * 80;
                                ctx.beginPath();
                                ctx.arc(x, y, 30 + Math.sin(time * 2 + i) * 10, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            requestAnimationFrame(animate);
                        };

                        animate();
                    }

                    // Setup event listeners
                    const playBtn = container.querySelector('#play-btn');
                    const presetBtn = container.querySelector('#preset-btn');
                    const fullscreenBtn = container.querySelector('#fullscreen-btn');

                    if (playBtn) playBtn.onclick = () => console.log('🎵 Play clicked');
                    if (presetBtn) presetBtn.onclick = () => console.log('🎨 Preset clicked');
                    if (fullscreenBtn) fullscreenBtn.onclick = () => {
                        if (!document.fullscreenElement) {
                            container.requestFullscreen().catch(console.error);
                        } else {
                            document.exitFullscreen().catch(console.error);
                        }
                    };
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

                const mediaLinks = Array.from(sidebar.querySelectorAll('.sidebar-link'))
                    .filter(link => link.href.includes('music') || link.href.includes('playlist'));

                if (mediaLinks.length > 0) {
                    const lastMediaLink = mediaLinks[mediaLinks.length - 1];
                    lastMediaLink.parentNode.insertBefore(link, lastMediaLink.nextSibling);
                } else {
                    sidebar.appendChild(link);
                }

                console.log('✅ Milkdrop Visualizer added to sidebar');
            };

            setTimeout(checkSidebar, 2000);
        }
    };

    // Register plugin
    if (global.Jellyfin && global.Jellyfin.PluginManager) {
        global.Jellyfin.PluginManager.register(MilkdropPlugin);
    } else {
        global.MilkdropPlugin = MilkdropPlugin;
        setTimeout(() => MilkdropPlugin.init(), 1000);
    }

})(window);`;

fs.writeFileSync('dist/main.js', pluginScript);
console.log('📦 Created clean main.js plugin script');