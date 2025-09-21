import React from 'react';
import { useLanguage, useTheme } from '../context/AppContext';
import './Header.css';

const Header: React.FC = () => {
  const { selectedLanguage } = useLanguage();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className={`header ${darkMode ? 'dark' : ''}`}>
      <div className="header-content">
        <div className="logo">
          <h1>Ditema tsa Dinoko</h1>
          <p>Interactive Learning Platform</p>
        </div>
        
        <div className="header-actions">
          {selectedLanguage && (
            <div className="language-indicator">
              <span className="language-name">{selectedLanguage.nativeName}</span>
              <span className="language-code">({selectedLanguage.code})</span>
            </div>
          )}
          
          <button 
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;