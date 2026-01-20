import React from 'react';
import './Header.css';

interface HeaderProps {
  onToggle: () => void;
  onConfig: () => void;
  showConfig: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggle, onConfig, showConfig }) => {
  return (
    <header className="milkdrop-header">
      <div className="header-content">
        <h1 className="header-title">Milkdrop Visualizer</h1>
        <div className="header-controls">
          <button className="header-btn" onClick={onConfig}>
            {showConfig ? '✖️ Close Config' : '⚙️ Settings'}
          </button>
          <button className="header-btn" onClick={onToggle}>
            Hide Header
          </button>
        </div>
      </div>
    </header>
  );
};