import { UserProgress, ModuleStats, Achievement } from '../types/ditema';
import { achievements } from '../data/achievements';

export class ProgressTracker {
  private static STORAGE_KEY = 'ditema_learning_progress';

  /**
   * Initialize user progress for a new user
   */
  static initializeProgress(userId: string, language: string): UserProgress {
    return {
      userId,
      language,
      modules: {
        shapeRecognition: this.createModuleStats(),
        syllableBuilding: this.createModuleStats(),
        wordConstruction: this.createModuleStats(),
        readingPractice: this.createModuleStats()
      },
      stats: {
        totalTimeSpent: 0,
        averageAccuracy: 0,
        exercisesCompleted: 0,
        wordsLearned: 0,
        currentStreak: 0,
        longestStreak: 0
      },
      achievements: [],
      streak: 0,
      totalPoints: 0
    };
  }

  /**
   * Create empty module statistics
   */
  private static createModuleStats(): ModuleStats {
    return {
      completed: false,
      accuracy: 0,
      timeSpent: 0,
      exercisesCompleted: 0,
      mastery: 0
    };
  }

  /**
   * Load user progress from localStorage
   */
  static loadProgress(userId: string): UserProgress | null {
    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
      if (stored) {
        const progress = JSON.parse(stored);
        // Convert date strings back to Date objects
        progress.achievements.forEach((achievement: Achievement) => {
          achievement.unlockedAt = new Date(achievement.unlockedAt);
        });
        return progress;
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
    return null;
  }

  /**
   * Save user progress to localStorage
   */
  static saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(`${this.STORAGE_KEY}_${progress.userId}`, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  /**
   * Update module progress
   */
  static updateModuleProgress(
    progress: UserProgress,
    moduleName: keyof typeof progress.modules,
    updateData: Partial<ModuleStats>
  ): UserProgress {
    const updatedProgress = { ...progress };
    updatedProgress.modules[moduleName] = {
      ...updatedProgress.modules[moduleName],
      ...updateData
    };

    // Calculate mastery based on accuracy and exercises completed
    const module = updatedProgress.modules[moduleName];
    if (module.exercisesCompleted > 0) {
      module.mastery = Math.min(module.accuracy, 100);
    }

    // Mark as completed if mastery reaches 80%
    if (module.mastery >= 80 && !module.completed) {
      module.completed = true;
      this.checkAchievements(updatedProgress);
    }

    // Update overall stats
    this.updateOverallStats(updatedProgress);
    
    this.saveProgress(updatedProgress);
    return updatedProgress;
  }

  /**
   * Add exercise result
   */
  static addExerciseResult(
    progress: UserProgress,
    moduleName: keyof typeof progress.modules,
    isCorrect: boolean,
    timeSpent: number,
    points: number
  ): UserProgress {
    const updatedProgress = { ...progress };
    const module = updatedProgress.modules[moduleName];

    // Update module stats
    module.exercisesCompleted++;
    module.timeSpent += timeSpent;
    
    // Update accuracy (running average)
    const totalExercises = module.exercisesCompleted;
    const currentAccuracy = module.accuracy;
    const newAccuracy = ((currentAccuracy * (totalExercises - 1)) + (isCorrect ? 100 : 0)) / totalExercises;
    module.accuracy = Math.round(newAccuracy);

    // Update points and streak
    updatedProgress.totalPoints += points;
    if (isCorrect) {
      updatedProgress.streak++;
      updatedProgress.stats.currentStreak = updatedProgress.streak;
      updatedProgress.stats.longestStreak = Math.max(
        updatedProgress.stats.longestStreak,
        updatedProgress.streak
      );
    } else {
      updatedProgress.streak = 0;
      updatedProgress.stats.currentStreak = 0;
    }

    // Update overall stats
    this.updateOverallStats(updatedProgress);

    // Check for achievements
    this.checkAchievements(updatedProgress);

    this.saveProgress(updatedProgress);
    return updatedProgress;
  }

  /**
   * Update overall statistics
   */
  private static updateOverallStats(progress: UserProgress): void {
    const modules = Object.values(progress.modules);
    
    // Calculate total time spent
    progress.stats.totalTimeSpent = modules.reduce((total, module) => total + module.timeSpent, 0);
    
    // Calculate average accuracy
    const totalExercises = modules.reduce((total, module) => total + module.exercisesCompleted, 0);
    if (totalExercises > 0) {
      const totalAccuracy = modules.reduce((total, module) => 
        total + (module.accuracy * module.exercisesCompleted), 0
      );
      progress.stats.averageAccuracy = Math.round(totalAccuracy / totalExercises);
    }

    // Calculate total exercises completed
    progress.stats.exercisesCompleted = totalExercises;

    // Calculate words learned (from word construction module)
    progress.stats.wordsLearned = Math.floor(
      progress.modules.wordConstruction.exercisesCompleted / 2
    );
  }

  /**
   * Check for new achievements
   */
  private static checkAchievements(progress: UserProgress): void {
    const newAchievements: Achievement[] = [];

    achievements.forEach(achievement => {
      // Skip if already unlocked
      if (progress.achievements.some(a => a.id === achievement.id)) {
        return;
      }

      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first_vowel':
          shouldUnlock = progress.modules.shapeRecognition.exercisesCompleted >= 1;
          break;
        case 'vowel_master':
          shouldUnlock = progress.modules.shapeRecognition.mastery >= 90;
          break;
        case 'perfect_shape_recognition':
          shouldUnlock = progress.modules.shapeRecognition.accuracy >= 100;
          break;
        case 'first_syllable':
          shouldUnlock = progress.modules.syllableBuilding.exercisesCompleted >= 1;
          break;
        case 'syllable_master':
          shouldUnlock = progress.modules.syllableBuilding.mastery >= 90;
          break;
        case 'perfect_syllable_building':
          shouldUnlock = progress.modules.syllableBuilding.accuracy >= 100;
          break;
        case 'first_word':
          shouldUnlock = progress.modules.wordConstruction.exercisesCompleted >= 1;
          break;
        case 'vocabulary_builder':
          shouldUnlock = progress.stats.wordsLearned >= 10;
          break;
        case 'word_master':
          shouldUnlock = progress.stats.wordsLearned >= 50;
          break;
        case 'perfect_word_construction':
          shouldUnlock = progress.modules.wordConstruction.accuracy >= 100;
          break;
        case 'first_story':
          shouldUnlock = progress.modules.readingPractice.exercisesCompleted >= 1;
          break;
        case 'perfect_reading_practice':
          shouldUnlock = progress.modules.readingPractice.accuracy >= 100;
          break;
        case 'streak_3':
          shouldUnlock = progress.streak >= 3;
          break;
        case 'streak_7':
          shouldUnlock = progress.streak >= 7;
          break;
        case 'streak_14':
          shouldUnlock = progress.streak >= 14;
          break;
        case 'streak_30':
          shouldUnlock = progress.streak >= 30;
          break;
        case 'all_modules_complete':
          shouldUnlock = Object.values(progress.modules).every(module => module.completed);
          break;
        case 'perfect_all_modules':
          shouldUnlock = Object.values(progress.modules).every(module => module.accuracy >= 100);
          break;
        case 'persistent_learner':
          shouldUnlock = progress.stats.exercisesCompleted >= 100;
          break;
        case 'cultural_explorer':
          shouldUnlock = progress.modules.readingPractice.exercisesCompleted >= 10;
          break;
      }

      if (shouldUnlock) {
        newAchievements.push({
          ...achievement,
          unlockedAt: new Date()
        });
      }
    });

    // Add new achievements to progress
    if (newAchievements.length > 0) {
      progress.achievements.push(...newAchievements);
      // You could trigger a notification here
      console.log('New achievements unlocked:', newAchievements);
    }
  }

  /**
   * Get progress summary
   */
  static getProgressSummary(progress: UserProgress): {
    totalModules: number;
    completedModules: number;
    totalAchievements: number;
    unlockedAchievements: number;
    overallMastery: number;
    nextAchievement: Achievement | null;
  } {
    const completedModules = Object.values(progress.modules).filter(module => module.completed).length;
    const totalModules = Object.keys(progress.modules).length;
    
    const overallMastery = Object.values(progress.modules).reduce((total, module) => 
      total + module.mastery, 0
    ) / totalModules;

    // Find next achievement to unlock
    const nextAchievement = achievements.find(achievement => 
      !progress.achievements.some(a => a.id === achievement.id)
    );

    return {
      totalModules,
      completedModules,
      totalAchievements: achievements.length,
      unlockedAchievements: progress.achievements.length,
      overallMastery: Math.round(overallMastery),
      nextAchievement: nextAchievement || null
    };
  }

  /**
   * Get learning streak information
   */
  static getStreakInfo(progress: UserProgress): {
    currentStreak: number;
    longestStreak: number;
    streakLevel: string;
    nextMilestone: number;
  } {
    const streak = progress.streak;
    let streakLevel = 'Beginner';
    let nextMilestone = 3;

    if (streak >= 30) {
      streakLevel = 'Legendary';
      nextMilestone = streak + 1;
    } else if (streak >= 14) {
      streakLevel = 'Expert';
      nextMilestone = 30;
    } else if (streak >= 7) {
      streakLevel = 'Advanced';
      nextMilestone = 14;
    } else if (streak >= 3) {
      streakLevel = 'Intermediate';
      nextMilestone = 7;
    } else {
      nextMilestone = 3;
    }

    return {
      currentStreak: streak,
      longestStreak: progress.stats.longestStreak,
      streakLevel,
      nextMilestone
    };
  }

  /**
   * Reset progress (for testing or user request)
   */
  static resetProgress(userId: string): void {
    localStorage.removeItem(`${this.STORAGE_KEY}_${userId}`);
  }

  /**
   * Export progress data
   */
  static exportProgress(progress: UserProgress): string {
    return JSON.stringify(progress, null, 2);
  }

  /**
   * Import progress data
   */
  static importProgress(userId: string, data: string): UserProgress | null {
    try {
      const progress = JSON.parse(data);
      progress.userId = userId;
      
      // Convert date strings back to Date objects
      progress.achievements.forEach((achievement: Achievement) => {
        achievement.unlockedAt = new Date(achievement.unlockedAt);
      });

      this.saveProgress(progress);
      return progress;
    } catch (error) {
      console.error('Error importing progress:', error);
      return null;
    }
  }
}