import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/AppContext';
import './ModuleSelector.css';

const ModuleSelector: React.FC = () => {
  const navigate = useNavigate();
  const { selectedLanguage } = useLanguage();

  const modules = [
    {
      id: 'shape-recognition',
      title: 'Shape Recognition',
      subtitle: 'Master vowel triangles and basic consonant marks',
      description: 'Learn to recognize and distinguish between different vowel triangles and consonant marks. Build the foundation of your Ditema knowledge.',
      icon: '🔺',
      difficulty: 'Beginner',
      estimatedTime: '15-20 min',
      progress: 0, // This would come from user progress
      unlocked: true,
    },
    {
      id: 'syllable-building',
      title: 'Syllable Building',
      subtitle: 'Combine consonants with vowels',
      description: 'Practice building syllables by combining consonant marks with vowel triangles. Learn the rules of syllable construction.',
      icon: '🔗',
      difficulty: 'Beginner',
      estimatedTime: '20-25 min',
      progress: 0,
      unlocked: true, // Would depend on shape recognition completion
    },
    {
      id: 'word-construction',
      title: 'Word Construction',
      subtitle: 'Build complete words from syllables',
      description: 'Create meaningful words by combining syllables. Learn vocabulary while mastering the script.',
      icon: '📝',
      difficulty: 'Intermediate',
      estimatedTime: '25-30 min',
      progress: 0,
      unlocked: true,
    },
    {
      id: 'reading-practice',
      title: 'Reading Practice',
      subtitle: 'Read Ditema text fluently',
      description: 'Practice reading complete texts in Ditema. Test your comprehension with stories and cultural content.',
      icon: '📖',
      difficulty: 'Advanced',
      estimatedTime: '30-40 min',
      progress: 0,
      unlocked: true,
    },
  ];

  const handleModuleSelect = (moduleId: string) => {
    navigate(`/${moduleId}`);
  };

  return (
    <div className="module-selector">
      <div className="selector-container">
        <div className="header-section">
          <h2>Learning Modules</h2>
          <p>Choose a module to continue your journey with {selectedLanguage?.nativeName}</p>
        </div>

        <div className="modules-grid">
          {modules.map((module) => (
            <div 
              key={module.id}
              className={`module-card ${module.unlocked ? 'unlocked' : 'locked'}`}
              onClick={() => module.unlocked && handleModuleSelect(module.id)}
            >
              <div className="module-icon">
                <span className="icon">{module.icon}</span>
                {!module.unlocked && <span className="lock-icon">🔒</span>}
              </div>
              
              <div className="module-content">
                <div className="module-header">
                  <h3>{module.title}</h3>
                  <span className={`difficulty-badge ${module.difficulty.toLowerCase()}`}>
                    {module.difficulty}
                  </span>
                </div>
                
                <p className="module-subtitle">{module.subtitle}</p>
                <p className="module-description">{module.description}</p>
                
                <div className="module-meta">
                  <span className="time-estimate">⏱️ {module.estimatedTime}</span>
                  {module.progress > 0 && (
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="learning-path">
          <h4>Learning Path</h4>
          <div className="path-visualization">
            {modules.map((module, index) => (
              <div key={module.id} className="path-step">
                <div className={`step-circle ${module.unlocked ? 'completed' : 'pending'}`}>
                  {index + 1}
                </div>
                <span className="step-title">{module.title}</span>
                {index < modules.length - 1 && <div className="path-line"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleSelector;