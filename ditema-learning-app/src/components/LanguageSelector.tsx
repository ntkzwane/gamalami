import React from 'react';
import { useLanguage } from '../context/AppContext';
import './LanguageSelector.css';

const LanguageSelector: React.FC = () => {
  const { availableLanguages, setLanguage } = useLanguage();

  const handleLanguageSelect = (language: any) => {
    setLanguage(language);
  };

  return (
    <div className="language-selector">
      <div className="selector-container">
        <div className="welcome-section">
          <h2>Welcome to Ditema tsa Dinoko Learning</h2>
          <p>Choose your language to begin your journey into this beautiful writing system</p>
        </div>
        
        <div className="languages-grid">
          {availableLanguages.map((language) => (
            <div 
              key={language.id}
              className="language-card"
              onClick={() => handleLanguageSelect(language)}
            >
              <div className="language-info">
                <h3>{language.nativeName}</h3>
                <p className="language-name-en">{language.name}</p>
                <p className="language-description">
                  Learn the Ditema script for {language.name}
                </p>
              </div>
              
              <div className="language-preview">
                <div className="sample-symbols">
                  <span className="vowel-symbol">△</span>
                  <span className="vowel-symbol">▽</span>
                  <span className="vowel-symbol">◁</span>
                  <span className="vowel-symbol">▷</span>
                </div>
                <p className="preview-text">Sample symbols</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cultural-note">
          <h4>About Ditema tsa Dinoko</h4>
          <p>
            This script was developed to represent the sounds of Southern African languages 
            using geometric shapes inspired by traditional litema (wall paintings) and beadwork patterns. 
            Each language has its own phonetic rules and special characters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;