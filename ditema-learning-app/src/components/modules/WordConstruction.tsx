import React, { useState, useEffect } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { useLanguage } from '../../context/AppContext';
import { DitemaRenderer } from '../../utils/DitemaRenderer';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import { sampleWords } from '../../data/ditemaData';
import './WordConstruction.css';

const WordConstruction: React.FC = () => {
  const { selectedLanguage } = useLanguage();
  const [renderer, setRenderer] = useState<DitemaRenderer | null>(null);
  const [excalidrawElements, setExcalidrawElements] = useState<ExcalidrawElement[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());

  const availableWords = sampleWords.filter(word => 
    word.difficulty <= (completedWords.size < 2 ? 2 : 4)
  );

  useEffect(() => {
    if (selectedLanguage) {
      const ditemaRenderer = new DitemaRenderer(selectedLanguage);
      setRenderer(ditemaRenderer);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (inputText && renderer) {
      const syllables = renderer.parseSyllables(inputText);
      const elements = renderer.renderSyllables(syllables);
      setExcalidrawElements(elements);
    }
  }, [inputText, renderer]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value.toLowerCase());
  };

  const handleSubmit = () => {
    const currentWord = availableWords[currentWordIndex];
    if (inputText.trim() === currentWord.latin) {
      setScore(prev => prev + 20);
      setStreak(prev => prev + 1);
      setCompletedWords(prev => new Set([...prev, currentWordIndex]));
      
      // Move to next word
      if (currentWordIndex < availableWords.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setInputText('');
        setExcalidrawElements([]);
      } else {
        console.log('All words completed!');
      }
    } else {
      setStreak(0);
      setShowHint(true);
      setTimeout(() => setShowHint(false), 3000);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleHint = () => {
    const currentWord = availableWords[currentWordIndex];
    setInputText(currentWord.latin);
  };

  const handleSkip = () => {
    setCurrentWordIndex(prev => prev + 1);
    setInputText('');
    setExcalidrawElements([]);
    setStreak(0);
  };

  const playAudio = (word: string) => {
    console.log(`Playing audio for ${word}`);
  };

  const currentWord = availableWords[currentWordIndex];

  if (!currentWord) {
    return (
      <div className="word-construction">
        <div className="module-complete">
          <h2>🎉 Congratulations!</h2>
          <p>You've completed all available words in this module!</p>
          <div className="final-stats">
            <div className="stat">
              <span className="stat-value">{score}</span>
              <span className="stat-label">Total Score</span>
            </div>
            <div className="stat">
              <span className="stat-value">{completedWords.size}</span>
              <span className="stat-label">Words Learned</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="word-construction">
      <div className="module-header">
        <h2>Word Construction</h2>
        <div className="module-stats">
          <span className="stat">Score: {score}</span>
          <span className="stat">Streak: {streak}</span>
          <span className="stat">Words: {completedWords.size}/{availableWords.length}</span>
        </div>
      </div>

      <div className="exercise-container">
        <div className="exercise-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentWordIndex + 1) / availableWords.length) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">
            Word {currentWordIndex + 1} of {availableWords.length}
          </span>
        </div>

        <div className="exercise-content">
          <div className="word-info">
            <div className="word-details">
              <h3>Translate this word to Ditema</h3>
              <div className="target-word">
                <span className="word-latin">{currentWord.latin}</span>
                <button 
                  className="audio-btn"
                  onClick={() => playAudio(currentWord.latin)}
                >
                  🔊
                </button>
              </div>
              <p className="word-meaning">{currentWord.meaning}</p>
              {currentWord.culturalContext && (
                <p className="cultural-context">{currentWord.culturalContext}</p>
              )}
            </div>

            <div className="difficulty-badge">
              <span className={`difficulty ${currentWord.difficulty === 1 ? 'easy' : 
                currentWord.difficulty === 2 ? 'medium' : 'hard'}`}>
                {currentWord.difficulty === 1 ? 'Easy' : 
                 currentWord.difficulty === 2 ? 'Medium' : 'Hard'}
              </span>
            </div>
          </div>

          <div className="input-section">
            <div className="input-container">
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type the word in Latin script..."
                className="word-input"
              />
              <button 
                className="submit-btn"
                onClick={handleSubmit}
                disabled={!inputText.trim()}
              >
                Submit
              </button>
            </div>

            <div className="action-buttons">
              <button 
                className="hint-btn"
                onClick={handleHint}
              >
                💡 Hint
              </button>
              <button 
                className="skip-btn"
                onClick={handleSkip}
              >
                ⏭️ Skip
              </button>
            </div>
          </div>

          <div className="visualization-area">
            <div className="ditema-display">
              <h4>Your Ditema Script</h4>
              <div className="drawing-area">
                <Excalidraw
                  initialElements={excalidrawElements}
                  onChange={(elements) => setExcalidrawElements(elements)}
                  viewModeEnabled={false}
                  zenModeEnabled={false}
                  gridModeEnabled={true}
                  theme="light"
                />
              </div>
            </div>

            <div className="syllable-breakdown">
              <h4>Syllable Breakdown</h4>
              <div className="syllables">
                {currentWord.syllables.map((syllable, index) => (
                  <div key={index} className="syllable-item">
                    <span className="syllable-text">{syllable}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {showHint && (
            <div className="feedback incorrect">
              <div className="feedback-icon">💡</div>
              <div className="feedback-text">
                <p className="feedback-result">Hint: Try typing "{currentWord.latin}"</p>
                <p className="feedback-explanation">
                  Look at the syllable breakdown above to help you spell the word correctly.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="cultural-note">
        <h4>Cultural Context</h4>
        <p>
          Each word in Ditema tsa Dinoko carries cultural significance. The script 
          not only represents sounds but also connects learners to the rich 
          traditions and values embedded in Southern African languages.
        </p>
      </div>
    </div>
  );
};

export default WordConstruction;