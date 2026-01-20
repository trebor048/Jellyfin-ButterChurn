// This file handles sidebar integration for the Milkdrop Visualizer plugin

interface SidebarItem {
  name: string;
  icon: string;
  href: string;
  category: string;
  order?: number;
}

// Register the Milkdrop Visualizer in the sidebar under Media category
export const registerSidebarItem = () => {
  const sidebarItem: SidebarItem = {
    name: 'Milkdrop Visualizer',
    icon: 'music_note', // You might need to add a custom icon
    href: '#/milkdrop',
    category: 'Media',
    order: 4 // After Folders (1), Music (2), Playlists (3)
  };

  // Jellyfin's sidebar registration (this might vary based on version)
  if (window.ApiClient && window.ApiClient.registerPluginSidebarItem) {
    window.ApiClient.registerPluginSidebarItem(sidebarItem);
  }

  // Alternative registration method for newer Jellyfin versions
  if (window.$plugins && window.$plugins.registerSidebarItem) {
    window.$plugins.registerSidebarItem(sidebarItem);
  }

  // Fallback: manually add to DOM if API methods aren't available
  addSidebarItemToDOM(sidebarItem);
};

const addSidebarItemToDOM = (item: SidebarItem) => {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

    // Find the Media category section
    const mediaSection = sidebar.querySelector('[data-category="Media"]') ||
                        sidebar.querySelector('.sidebar-section:has(.sidebar-link[href*="/music"])')?.parentElement;

    if (mediaSection) {
      const link = document.createElement('a') as HTMLAnchorElement;
      link.className = 'sidebar-link';
      link.href = item.href;
      link.innerHTML = `
        <div class="sidebar-link-icon">${item.icon}</div>
        <div className="sidebar-link-text">${item.name}</div>
      `;

      // Insert after existing media items
      const existingLinks = mediaSection.querySelectorAll('.sidebar-link') as NodeListOf<HTMLAnchorElement>;
      const lastMediaLink = Array.from(existingLinks).find(link =>
        link.href.includes('/music') || link.href.includes('/playlists') || link.href.includes('/folders')
      );

    if (lastMediaLink && lastMediaLink.parentElement) {
      lastMediaLink.parentElement.insertBefore(link, lastMediaLink.nextSibling);
    } else {
      mediaSection.appendChild(link);
    }
  }
};

// Global declarations for Jellyfin APIs
declare global {
  interface Window {
    ApiClient?: {
      registerPluginSidebarItem?: (item: SidebarItem) => void;
    };
    $plugins?: {
      registerSidebarItem?: (item: SidebarItem) => void;
    };
  }
}