const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏗️  Building Jellyfin Milkdrop Visualizer Plugin...\n');

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
}

// Run TypeScript type checking
console.log('🔍 Running TypeScript type check...');
try {
  execSync('npm run type-check', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ TypeScript check failed:', error.message);
  process.exit(1);
}

// Clean previous build
console.log('🧹 Cleaning previous build...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}

// Run webpack build
console.log('⚙️  Running webpack build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Verify build output
console.log('✅ Verifying build output...');
const mainJs = path.join('dist', 'main.js');
const pluginJson = 'plugin.json';

if (!fs.existsSync(mainJs)) {
  console.error('❌ Build failed: main.js not found in dist/');
  process.exit(1);
}

if (!fs.existsSync(pluginJson)) {
  console.error('❌ Build failed: plugin.json not found');
  process.exit(1);
}

// Get file sizes
const mainJsStats = fs.statSync(mainJs);
const mainJsSize = (mainJsStats.size / 1024).toFixed(2);
const pluginJsonStats = fs.statSync(pluginJson);
const pluginJsonSize = (pluginJsonStats.size / 1024).toFixed(2);

console.log('\n🎉 Build completed successfully!');
console.log(`📊 Build statistics:`);
console.log(`   - main.js: ${mainJsSize} KB`);
console.log(`   - plugin.json: ${pluginJsonSize} KB`);
console.log(`   - Total files: ${fs.readdirSync('dist').length}`);

console.log('\n📦 Build artifacts:');
console.log('   - dist/main.js (plugin code)');
console.log('   - plugin.json (plugin manifest)');

console.log('\n🚀 Installation instructions:');
console.log('   1. Copy dist/main.js to your Jellyfin plugins directory');
console.log('   2. Copy plugin.json to the same directory');
console.log('   3. Restart Jellyfin server');
console.log('   4. Enable "Milkdrop Visualizer" in Dashboard > Plugins');

console.log('\n✨ Plugin features:');
console.log('   - Advanced butterchurn visualizer');
console.log('   - Comprehensive configuration system');
console.log('   - Multiple audio sources');
console.log('   - Performance monitoring');
console.log('   - Error boundaries and fallbacks');
console.log('   - Keyboard shortcuts and touch gestures');

console.log('\n🎵 Enjoy your enhanced Milkdrop Visualizer!');