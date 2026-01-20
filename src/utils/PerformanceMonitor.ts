export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  cpuUsage?: number;
  renderTime: number;
  timestamp: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 60; // Keep 60 seconds of data
  private frameCount = 0;
  private lastTime = 0;
  private renderTime = 0;
  private isMonitoring = false;
  private callbacks: Array<(metrics: PerformanceMetrics) => void> = [];

  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.metrics = [];
    this.monitorLoop();
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    this.callbacks = [];
  }

  private monitorLoop = (): void => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    this.frameCount++;

    // Calculate FPS every second
    if (currentTime - this.lastTime >= 1000) {
      const fps = (this.frameCount * 1000) / (currentTime - this.lastTime);
      const frameTime = (currentTime - this.lastTime) / this.frameCount;

      const metrics: PerformanceMetrics = {
        fps: Math.round(fps * 10) / 10,
        frameTime: Math.round(frameTime * 100) / 100,
        renderTime: Math.round(this.renderTime * 100) / 100,
        timestamp: Date.now()
      };

      // Add memory usage if available
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        metrics.memoryUsage = Math.round(memInfo.usedJSHeapSize / 1024 / 1024); // MB
      }

      this.metrics.push(metrics);

      // Keep only recent metrics
      if (this.metrics.length > this.maxMetrics) {
        this.metrics.shift();
      }

      // Notify callbacks
      this.callbacks.forEach(callback => {
        try {
          callback(metrics);
        } catch (error) {
          console.error('Performance monitor callback error:', error);
        }
      });

      // Reset counters
      this.frameCount = 0;
      this.lastTime = currentTime;
      this.renderTime = 0;
    }

    requestAnimationFrame(this.monitorLoop);
  };

  recordRenderStart(): void {
    this.renderTime = performance.now();
  }

  recordRenderEnd(): void {
    this.renderTime = performance.now() - this.renderTime;
  }

  getCurrentMetrics(): PerformanceMetrics | null {
    return this.metrics[this.metrics.length - 1] || null;
  }

  getAverageMetrics(seconds: number = 10): PerformanceMetrics | null {
    const recentMetrics = this.metrics.slice(-seconds);
    if (recentMetrics.length === 0) return null;

    const avg = recentMetrics.reduce((acc, metric) => ({
      fps: acc.fps + metric.fps,
      frameTime: acc.frameTime + metric.frameTime,
      memoryUsage: (acc.memoryUsage || 0) + (metric.memoryUsage || 0),
      renderTime: acc.renderTime + metric.renderTime,
      timestamp: metric.timestamp
    }), {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      renderTime: 0,
      timestamp: 0
    });

    return {
      fps: Math.round((avg.fps / recentMetrics.length) * 10) / 10,
      frameTime: Math.round((avg.frameTime / recentMetrics.length) * 100) / 100,
      memoryUsage: avg.memoryUsage ? Math.round(avg.memoryUsage / recentMetrics.length) : undefined,
      renderTime: Math.round((avg.renderTime / recentMetrics.length) * 100) / 100,
      timestamp: avg.timestamp
    };
  }

  getMetricsHistory(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  onMetricsUpdate(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  // Performance recommendations based on current metrics
  getPerformanceRecommendations(): string[] {
    const current = this.getCurrentMetrics();
    const average = this.getAverageMetrics(5);
    const recommendations: string[] = [];

    if (!current) return recommendations;

    if (current.fps < 30) {
      recommendations.push('FPS is below 30 - consider reducing quality settings');
    }

    if (current.frameTime > 33) { // > 30 FPS
      recommendations.push('Frame time is high - try lowering visual quality');
    }

    if (current.memoryUsage && current.memoryUsage > 256) {
      recommendations.push('High memory usage detected - consider reducing texture quality');
    }

    if (average && average.fps < 50) {
      recommendations.push('Average FPS is low - enable low power mode or reduce quality');
    }

    if (current.renderTime > 10) {
      recommendations.push('Render time is high - consider disabling post-processing');
    }

    return recommendations;
  }

  // Export metrics for debugging
  exportMetrics(): string {
    return JSON.stringify({
      current: this.getCurrentMetrics(),
      average: this.getAverageMetrics(),
      history: this.getMetricsHistory(),
      recommendations: this.getPerformanceRecommendations()
    }, null, 2);
  }
}