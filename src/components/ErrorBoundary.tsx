import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Milkdrop Visualizer Error:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report error to analytics or logging service
    this.reportError(error, errorInfo);
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // In a real implementation, this would send to an error reporting service
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    console.error('Error Report:', errorReport);

    // Store error in localStorage for debugging
    try {
      const existingErrors = JSON.parse(localStorage.getItem('milkdrop-errors') || '[]');
      existingErrors.push(errorReport);
      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.shift();
      }
      localStorage.setItem('milkdrop-errors', JSON.stringify(existingErrors));
    } catch (e) {
      console.warn('Failed to store error report:', e);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleResetConfig = () => {
    // Reset configuration to defaults
    if (window.confirm('Reset all settings to defaults and reload?')) {
      localStorage.removeItem('jellyfin-milkdrop-visualizer-config');
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 9999,
          fontFamily: 'monospace'
        }}>
          <h1 style={{ color: '#ff6b6b', marginBottom: '20px' }}>
            ⚠️ Milkdrop Visualizer Error
          </h1>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '100%',
            marginBottom: '20px',
            overflow: 'auto',
            maxHeight: '300px'
          }}>
            <h3>Error Details:</h3>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '12px' }}>
              {this.state.error?.message}
              {this.state.error?.stack}
            </pre>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '100%',
            marginBottom: '20px'
          }}>
            <h3>Possible Solutions:</h3>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Try refreshing the page</li>
              <li>Reset plugin settings to defaults</li>
              <li>Check browser compatibility (Chrome 66+, Firefox 60+, Safari 14+)</li>
              <li>Disable hardware acceleration in browser settings</li>
              <li>Clear browser cache and cookies</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
            <button
              onClick={this.handleResetConfig}
              style={{
                padding: '10px 20px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reset Settings
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}