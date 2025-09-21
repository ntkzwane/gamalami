import React, { useState } from 'react';
import { useProgress } from '../context/AppContext';
import './ProgressTracker.css';

const ProgressTracker: React.FC = () => {
  const { userProgress } = useProgress();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!userProgress) return null;

  const modules = [
    { key: 'shapeRecognition', name: 'Shape Recognition' },
    { key: 'syllableBuilding', name: 'Syllable Building' },
    { key: 'wordConstruction', name: 'Word Construction' },
    { key: 'readingPractice', name: 'Reading Practice' },
  ];

  return (
    <div className={`progress-tracker ${isExpanded ? 'expanded' : ''}`}>
      <button 
        className="progress-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="progress-icon">📊</span>
        <span className="progress-text">Progress</span>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="progress-content">
          <div className="stats-overview">
            <div className="stat-item">
              <span className="stat-value">{userProgress.totalPoints}</span>
              <span className="stat-label">Points</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userProgress.streak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userProgress.stats.exercisesCompleted}</span>
              <span className="stat-label">Exercises</span>
            </div>
          </div>

          <div className="modules-progress">
            <h4>Module Progress</h4>
            {modules.map((module) => {
              const moduleStats = userProgress.modules[module.key as keyof typeof userProgress.modules];
              return (
                <div key={module.key} className="module-progress-item">
                  <div className="module-info">
                    <span className="module-name">{module.name}</span>
                    <span className="module-mastery">{moduleStats.mastery}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${moduleStats.mastery}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="recent-achievements">
            <h4>Recent Achievements</h4>
            {userProgress.achievements.slice(-3).map((achievement) => (
              <div key={achievement.id} className="achievement-item">
                <span className="achievement-icon">{achievement.icon}</span>
                <div className="achievement-info">
                  <span className="achievement-name">{achievement.name}</span>
                  <span className="achievement-date">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;