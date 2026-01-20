import React from 'react';

// Type for route registration function
declare global {
  interface Window {
    $route: (path: string, component: React.ComponentType) => void;
  }
}

// Register a route with Jellyfin's routing system
export function registerRoute(path: string, component: React.ComponentType) {
  if (window.$route) {
    window.$route(path, component);
  }
}