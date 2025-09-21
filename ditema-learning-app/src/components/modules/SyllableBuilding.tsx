import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/AppContext';
import { DitemaRenderer } from '../../utils/DitemaRenderer';
import { DitemaElement } from '../../types/ditema';
import DitemaCanvas from '../DitemaCanvas';
import './SyllableBuilding.css';

const SyllableBuilding: React.FC = () => {
  const { selectedLanguage } = useLanguage();
  const [renderer, setRenderer] = useState<DitemaRenderer | null>(null);
  const [ditemaElements, setDitemaElements] = useState<DitemaElement[]>([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedConsonant, setSelectedConsonant] = useState<string | null>(null);
  const [selectedVowel, setSelectedVowel] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const exercises = [
    {
      target: 'ma',
      consonant: 'm',
      vowel: 'a',
      explanation: 'The "m" consonant mark goes inside the downward-pointing triangle for "a"'
    },
    {
      target: 'ni',
      consonant: 'n',
      vowel: 'i',
      explanation: 'The "n" consonant mark goes inside the upward-pointing triangle for "i"'
    },
    {
      target: 'tu',
      consonant: 't',
      vowel: 'u',
      explanation: 'The "t" consonant mark goes on the edge of the left-pointing triangle for "u"'
    },
    {
      target: 'ko',
      consonant: 'k',
      vowel: 'o',
      explanation: 'The "k" consonant mark goes outside the right-pointing triangle for "o"'
    }
  ];

  const consonants = selectedLanguage ? Object.entries(selectedLanguage.phoneticRules.consonants).slice(0, 8) : [];
  const vowels = selectedLanguage ? Object.entries(selectedLanguage.phoneticRules.vowels) : [];

  useEffect(() => {
    if (selectedLanguage) {
      const ditemaRenderer = new DitemaRenderer(selectedLanguage);
      setRenderer(ditemaRenderer);
    }
  }, [selectedLanguage]);

  const handleConsonantSelect = (consonantKey: string) => {
    setSelectedConsonant(consonantKey);
  };

  const handleVowelSelect = (vowelKey: string) => {
    setSelectedVowel(vowelKey);
    
    if (selectedConsonant) {
      const targetConsonant = exercises[currentExercise].consonant;
      const targetVowel = exercises[currentExercise].vowel;
      
      const correct = vowelKey === targetVowel && selectedConsonant === targetConsonant;
      setIsCorrect(correct);
      setShowFeedback(true);
      
      if (correct) {
        setScore(prev => prev + 15);
        setStreak(prev => prev + 1);
        
        // Render the syllable
        if (renderer) {
          const syllables = renderer.parseSyllables(exercises[currentExercise].target);
          const elements = renderer.renderSyllables(syllables);
          setDitemaElements(elements);
        }
      } else {
        setStreak(0);
      }
      
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedConsonant(null);
        setSelectedVowel(null);
        if (currentExercise < exercises.length - 1) {
        setCurrentExercise(prev => prev + 1);
        setDitemaElements([]);
        } else {
          console.log('Module completed!');
        }
      }, 3000);
    }
  };

  const playAudio = (sound: string) => {
    console.log(`Playing audio for ${sound}`);
  };

  const currentExerciseData = exercises[currentExercise];

  return (
    <div className="syllable-building">
      <div className="module-header">
        <h2>Syllable Building</h2>
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
          <div className="exercise-instruction">
            <h3>Build the syllable: <span className="target-syllable">{currentExerciseData.target}</span></h3>
            <p>Drag a consonant mark onto a vowel triangle to create the syllable</p>
          </div>

          <div className="building-area">
            <div className="consonant-toolbar">
              <h4>Consonants</h4>
              <div className="consonant-grid">
                {consonants.map(([key, consonant]) => (
                  <div
                    key={key}
                    className={`consonant-item ${
                      selectedConsonant === key ? 'selected' : ''
                    } ${
                      key === currentExerciseData.consonant ? 'target' : ''
                    }`}
                    onClick={() => handleConsonantSelect(key)}
                  >
                    <div className="consonant-symbol">
                      {consonant.symbol}
                    </div>
                    <span className="consonant-label">{key}</span>
                    <button 
                      className="audio-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(key);
                      }}
                    >
                      🔊
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="canvas-area">
              <div className="vowel-canvas">
                <h4>Vowel Triangles</h4>
                <div className="vowel-grid">
                  {vowels.map(([key, vowel]) => (
                    <div
                      key={key}
                      className={`vowel-drop-zone ${
                        selectedVowel === key ? 'selected' : ''
                      } ${
                        key === currentExerciseData.vowel ? 'target' : ''
                      }`}
                      onClick={() => handleVowelSelect(key)}
                    >
                      <div className="vowel-symbol">{vowel.symbol}</div>
                      <span className="vowel-label">/{vowel.ipa}/</span>
                      <button 
                        className="audio-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(vowel.ipa);
                        }}
                      >
                        🔊
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ditema-container">
                <h4>Your Syllable</h4>
                <div className="drawing-area">
                  <DitemaCanvas elements={ditemaElements} width={300} height={200} />
                </div>
              </div>
            </div>
          </div>

          {showFeedback && (
            <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="feedback-icon">
                {isCorrect ? '✅' : '❌'}
              </div>
              <div className="feedback-text">
                <p className="feedback-result">
                  {isCorrect ? 'Excellent! You built the syllable correctly!' : 'Not quite right. Try again!'}
                </p>
                <p className="feedback-explanation">
                  {currentExerciseData.explanation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="cultural-note">
        <h4>Cultural Context</h4>
        <p>
          The combination of consonant marks and vowel triangles reflects the 
          syllabic structure of Southern African languages. This system allows 
          for the precise representation of the complex sound patterns found 
          in these languages.
        </p>
      </div>
    </div>
  );
};

export default SyllableBuilding;