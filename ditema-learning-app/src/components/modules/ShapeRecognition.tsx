import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/AppContext';
import { VowelSymbol } from '../../types/ditema';
import './ShapeRecognition.css';

const ShapeRecognition: React.FC = () => {
  const { selectedLanguage } = useLanguage();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedVowels, setCompletedVowels] = useState<Set<string>>(new Set());

  const vowels = selectedLanguage ? Object.entries(selectedLanguage.phoneticRules.vowels) : [];
  const exercises = [
    {
      type: 'shape_to_sound',
      question: 'Click the triangle that makes the "i" sound',
      correctAnswer: 'i',
      explanation: 'The upward-pointing triangle (△) represents the "i" sound'
    },
    {
      type: 'sound_to_shape',
      question: 'Listen and select the correct shape',
      correctAnswer: 'a',
      explanation: 'The downward-pointing triangle (▽) represents the "a" sound'
    },
    {
      type: 'shape_recognition',
      question: 'Which direction does this triangle point?',
      correctAnswer: 'u',
      explanation: 'The left-pointing triangle (◁) represents the "u" sound'
    }
  ];

  const handleShapeClick = (vowelKey: string) => {
    if (showFeedback) return;
    
    setSelectedShape(vowelKey);
    const correct = vowelKey === exercises[currentExercise].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      setCompletedVowels(prev => new Set([...prev, vowelKey]));
    } else {
      setStreak(0);
    }
    
    setShowFeedback(true);
    
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedShape(null);
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(prev => prev + 1);
      } else {
        // Module completed
        console.log('Module completed!');
      }
    }, 2000);
  };

  const playAudio = (vowel: VowelSymbol) => {
    // In a real app, this would play the actual audio file
    console.log(`Playing audio for ${vowel.ipa}`);
    // Audio would be played here using Web Audio API
  };

  const currentVowel = vowels.find(([key]) => key === exercises[currentExercise].correctAnswer)?.[1];

  return (
    <div className="shape-recognition">
      <div className="module-header">
        <h2>Shape Recognition</h2>
        <div className="module-stats">
          <span className="stat">Score: {score}</span>
          <span className="stat">Streak: {streak}</span>
        </div>
      </div>

      <div className="exercise-container">
        <div className="exercise-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">
            Exercise {currentExercise + 1} of {exercises.length}
          </span>
        </div>

        <div className="exercise-content">
          <h3 className="exercise-question">
            {exercises[currentExercise].question}
          </h3>

          {exercises[currentExercise].type === 'sound_to_shape' && currentVowel && (
            <button 
              className="audio-button"
              onClick={() => playAudio(currentVowel)}
            >
              🔊 Play Sound
            </button>
          )}

          <div className="vowel-grid">
            {vowels.map(([key, vowel]) => (
              <div
                key={key}
                className={`vowel-card ${
                  selectedShape === key ? 'selected' : ''
                } ${
                  showFeedback && key === exercises[currentExercise].correctAnswer ? 'correct' : ''
                } ${
                  showFeedback && selectedShape === key && key !== exercises[currentExercise].correctAnswer ? 'incorrect' : ''
                } ${
                  completedVowels.has(key) ? 'completed' : ''
                }`}
                onClick={() => handleShapeClick(key)}
              >
                <div className="vowel-symbol">
                  {vowel.symbol}
                </div>
                <div className="vowel-info">
                  <span className="vowel-ipa">/{vowel.ipa}/</span>
                  <span className="vowel-description">{vowel.description}</span>
                </div>
                <button 
                  className="audio-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(vowel);
                  }}
                >
                  🔊
                </button>
              </div>
            ))}
          </div>

          {showFeedback && (
            <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="feedback-icon">
                {isCorrect ? '✅' : '❌'}
              </div>
              <div className="feedback-text">
                <p className="feedback-result">
                  {isCorrect ? 'Correct!' : 'Not quite right.'}
                </p>
                <p className="feedback-explanation">
                  {exercises[currentExercise].explanation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="cultural-note">
        <h4>Cultural Context</h4>
        <p>
          The triangular shapes in Ditema tsa Dinoko are inspired by traditional 
          geometric patterns found in Southern African art, particularly in litema 
          (wall paintings) and beadwork. Each direction carries cultural significance.
        </p>
      </div>
    </div>
  );
};

export default ShapeRecognition;