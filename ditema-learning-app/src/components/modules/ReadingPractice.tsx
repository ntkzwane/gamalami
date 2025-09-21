import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/AppContext';
import { DitemaRenderer } from '../../utils/DitemaRenderer';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import './ReadingPractice.css';

const ReadingPractice: React.FC = () => {
  const { selectedLanguage } = useLanguage();
  const [renderer, setRenderer] = useState<DitemaRenderer | null>(null);
  const [currentStory, setCurrentStory] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completedStories, setCompletedStories] = useState<Set<number>>(new Set());

  const stories = [
    {
      id: 1,
      title: 'Ubuntu - A Story of Humanity',
      ditemaText: 'ubuntu', // This would be rendered as Ditema
      latinText: 'ubuntu',
      translation: 'humanity, compassion',
      culturalContext: 'Ubuntu is a fundamental concept in African philosophy meaning "I am because we are"',
      difficulty: 2
    },
    {
      id: 2,
      title: 'The Family',
      ditemaText: 'umama nobaba',
      latinText: 'umama nobaba',
      translation: 'mother and father',
      culturalContext: 'Family is central to African culture, with deep respect for parents and elders',
      difficulty: 3
    },
    {
      id: 3,
      title: 'Traditional Greeting',
      ditemaText: 'sawubona',
      latinText: 'sawubona',
      translation: 'I see you (traditional greeting)',
      culturalContext: 'This greeting acknowledges the person\'s humanity and presence',
      difficulty: 3
    }
  ];

  useEffect(() => {
    if (selectedLanguage) {
      const ditemaRenderer = new DitemaRenderer(selectedLanguage);
      setRenderer(ditemaRenderer);
    }
  }, [selectedLanguage]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value.toLowerCase().trim());
  };

  const handleSubmit = () => {
    const currentStoryData = stories[currentStory];
    if (userInput === currentStoryData.latinText.toLowerCase()) {
      setScore(prev => prev + 30);
      setStreak(prev => prev + 1);
      setCompletedStories(prev => new Set([...prev, currentStory]));
      
      // Move to next story
      if (currentStory < stories.length - 1) {
        setCurrentStory(prev => prev + 1);
        setUserInput('');
      } else {
        console.log('All stories completed!');
      }
    } else {
      setStreak(0);
      setShowHint(true);
      setTimeout(() => setShowHint(false), 4000);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleHint = () => {
    const currentStoryData = stories[currentStory];
    setUserInput(currentStoryData.latinText.toLowerCase());
  };

  const handleSkip = () => {
    setCurrentStory(prev => prev + 1);
    setUserInput('');
    setStreak(0);
  };

  const playAudio = (text: string) => {
    console.log(`Playing audio for ${text}`);
  };

  const currentStoryData = stories[currentStory];

  if (!currentStoryData) {
    return (
      <div className="reading-practice">
        <div className="module-complete">
          <h2>🎉 Congratulations!</h2>
          <p>You've completed all reading practice stories!</p>
          <div className="final-stats">
            <div className="stat">
              <span className="stat-value">{score}</span>
              <span className="stat-label">Total Score</span>
            </div>
            <div className="stat">
              <span className="stat-value">{completedStories.size}</span>
              <span className="stat-label">Stories Read</span>
            </div>
            <div className="stat">
              <span className="stat-value">{streak}</span>
              <span className="stat-label">Current Streak</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reading-practice">
      <div className="module-header">
        <h2>Reading Practice</h2>
        <div className="module-stats">
          <span className="stat">Score: {score}</span>
          <span className="stat">Streak: {streak}</span>
          <span className="stat">Stories: {completedStories.size}/{stories.length}</span>
        </div>
      </div>

      <div className="exercise-container">
        <div className="exercise-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentStory + 1) / stories.length) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">
            Story {currentStory + 1} of {stories.length}
          </span>
        </div>

        <div className="exercise-content">
          <div className="story-header">
            <h3>{currentStoryData.title}</h3>
            <div className="story-meta">
              <span className={`difficulty ${currentStoryData.difficulty === 1 ? 'easy' : 
                currentStoryData.difficulty === 2 ? 'medium' : 'hard'}`}>
                {currentStoryData.difficulty === 1 ? 'Easy' : 
                 currentStoryData.difficulty === 2 ? 'Medium' : 'Hard'}
              </span>
              <button 
                className="audio-btn"
                onClick={() => playAudio(currentStoryData.latinText)}
              >
                🔊 Listen
              </button>
            </div>
          </div>

          <div className="reading-area">
            <div className="ditema-text-display">
              <h4>Read this Ditema text:</h4>
              <div className="ditema-visual">
                {/* This would show the actual Ditema rendering */}
                <div className="ditema-placeholder">
                  {currentStoryData.ditemaText.split('').map((char, index) => (
                    <span key={index} className="ditema-char">{char}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="translation-area">
              <h4>Type the Latin translation:</h4>
              <div className="input-section">
                <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type the Latin text..."
                  className="translation-input"
                />
                <button 
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={!userInput.trim()}
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
          </div>

          <div className="cultural-context">
            <h4>Cultural Context</h4>
            <p className="translation-meaning">
              <strong>Translation:</strong> {currentStoryData.translation}
            </p>
            <p className="cultural-explanation">
              {currentStoryData.culturalContext}
            </p>
          </div>

          {showHint && (
            <div className="feedback incorrect">
              <div className="feedback-icon">💡</div>
              <div className="feedback-text">
                <p className="feedback-result">Hint: The Latin text is "{currentStoryData.latinText}"</p>
                <p className="feedback-explanation">
                  Try to match the Ditema symbols to their Latin equivalents.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="cultural-note">
        <h4>About Reading Practice</h4>
        <p>
          Reading practice helps you develop fluency in recognizing Ditema symbols 
          and connecting them to their meanings. Each story carries cultural 
          significance and helps you understand the deeper context of the language.
        </p>
      </div>
    </div>
  );
};

export default ReadingPractice;