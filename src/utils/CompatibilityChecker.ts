export interface CompatibilityResult {
  compatible: boolean;
  warnings: string[];
  errors: string[];
  recommendations: string[];
  score: number; // 0-100, higher is better
}

export class CompatibilityChecker {
  static checkCompatibility(): CompatibilityResult {
    const result: CompatibilityResult = {
      compatible: true,
      warnings: [],
      errors: [],
      recommendations: [],
      score: 100
    };

    // Check WebGL support
    this.checkWebGL(result);

    // Check Web Audio API
    this.checkWebAudio(result);

    // Check browser features
    this.checkBrowserFeatures(result);

    // Check performance capabilities
    this.checkPerformance(result);

    // Check screen capabilities
    this.checkDisplay(result);

    // Calculate final score
    result.score = Math.max(0, result.score - (result.warnings.length * 5) - (result.errors.length * 20));

    return result;
  }

  private static checkWebGL(result: CompatibilityResult): void {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

      if (!gl) {
        result.errors.push('WebGL is not supported by this browser');
        result.compatible = false;
        return;
      }

      // Type assertion for WebGL context
      const webglContext = gl as WebGLRenderingContext;

      const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (renderer && renderer.includes('Software')) {
          result.warnings.push('Software WebGL renderer detected - performance may be reduced');
          result.recommendations.push('Enable hardware acceleration in browser settings');
        }
      }

      // Check for required extensions
      const requiredExtensions = [
        'OES_texture_float',
        'OES_standard_derivatives'
      ];

      for (const ext of requiredExtensions) {
        if (!webglContext.getExtension(ext)) {
          result.warnings.push(`WebGL extension ${ext} not available`);
        }
      }

    } catch (error) {
      result.errors.push('WebGL initialization failed');
      result.compatible = false;
    }
  }

  private static checkWebAudio(result: CompatibilityResult): void {
    if (!window.AudioContext && !(window as any).webkitAudioContext) {
      result.errors.push('Web Audio API is not supported');
      result.compatible = false;
      return;
    }

    // Check for AudioWorklet support (optional)
    if (!window.AudioWorklet) {
      result.warnings.push('AudioWorklet not supported - using legacy audio processing');
      result.recommendations.push('Consider using a modern browser for better audio processing');
    }
  }

  private static checkBrowserFeatures(result: CompatibilityResult): void {
    // Check for required APIs
    const requiredAPIs = [
      'localStorage',
      'requestAnimationFrame',
      'performance',
      'navigator.mediaDevices'
    ];

    for (const api of requiredAPIs) {
      if (!(api in window) && !(api in navigator)) {
        result.errors.push(`Required API ${api} not available`);
        result.compatible = false;
      }
    }

    // Check for optional but recommended features
    if (!window.SharedArrayBuffer) {
      result.warnings.push('SharedArrayBuffer not available - some optimizations disabled');
    }

    // Check user agent for known problematic browsers
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('msie') || ua.includes('trident')) {
      result.errors.push('Internet Explorer is not supported');
      result.compatible = false;
    }
  }

  private static checkPerformance(result: CompatibilityResult): void {
    // Check hardware concurrency
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 2) {
      result.warnings.push('Low CPU core count detected - performance may be limited');
    }

    // Check device memory (if available)
    if ('deviceMemory' in navigator) {
      const memory = (navigator as any).deviceMemory;
      if (memory && memory < 4) {
        result.warnings.push('Low device memory detected - consider reducing quality settings');
        result.recommendations.push('Use Low or Medium quality settings for better performance');
      }
    }

    // Simple performance test
    const startTime = performance.now();
    for (let i = 0; i < 100000; i++) {
      Math.sin(i);
    }
    const endTime = performance.now();
    const perfScore = endTime - startTime;

    if (perfScore > 50) { // Arbitrary threshold
      result.warnings.push('Slow JavaScript performance detected');
      result.recommendations.push('Consider using a more powerful device or reducing visual complexity');
    }
  }

  private static checkDisplay(result: CompatibilityResult): void {
    // Check screen resolution
    if (window.screen.width < 1024 || window.screen.height < 768) {
      result.warnings.push('Low screen resolution detected - some features may not display optimally');
    }

    // Check pixel ratio for high DPI displays
    if (window.devicePixelRatio && window.devicePixelRatio > 2) {
      result.warnings.push('High DPI display detected - may impact performance');
      result.recommendations.push('Consider adjusting pixel ratio in settings');
    }

    // Check for touch capability
    if ('ontouchstart' in window) {
      result.recommendations.push('Touch device detected - touch gestures are available');
    }
  }

  static getRecommendedSettings(result: CompatibilityResult): any {
    const recommendations: any = {};

    // Base recommendations based on compatibility score
    if (result.score < 50) {
      recommendations.quality = 'low';
      recommendations.targetFps = 30;
      recommendations.textureQuality = 'low';
    } else if (result.score < 80) {
      recommendations.quality = 'medium';
      recommendations.targetFps = 60;
      recommendations.textureQuality = 'medium';
    } else {
      recommendations.quality = 'high';
      recommendations.targetFps = 60;
      recommendations.textureQuality = 'high';
    }

    // Specific recommendations based on warnings
    for (const warning of result.warnings) {
      if (warning.includes('memory')) {
        recommendations.maxMemoryUsage = 128;
        recommendations.preloadPresets = false;
      }
      if (warning.includes('CPU') || warning.includes('performance')) {
        recommendations.enableWorker = false;
        recommendations.lowPowerMode = true;
      }
      if (warning.includes('WebGL') || warning.includes('renderer')) {
        recommendations.forceSoftwareRendering = true;
      }
    }

    return recommendations;
  }
}