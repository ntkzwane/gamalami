import { Achievement } from '../types/ditema';

export const achievements: Achievement[] = [
  // Shape Recognition Achievements
  {
    id: 'first_vowel',
    name: 'First Steps',
    description: 'Recognize your first vowel triangle',
    icon: '🔺',
    unlockedAt: new Date(),
    category: 'module'
  },
  {
    id: 'vowel_master',
    name: 'Vowel Master',
    description: 'Master all vowel triangles',
    icon: '⭐',
    unlockedAt: new Date(),
    category: 'module'
  },
  {
    id: 'perfect_shape_recognition',
    name: 'Perfect Vision',
    description: 'Complete Shape Recognition with 100% accuracy',
    icon: '👁️',
    unlockedAt: new Date(),
    category: 'accuracy'
  },

  // Syllable Building Achievements
  {
    id: 'first_syllable',
    name: 'Word Builder',
    description: 'Build your first syllable',
    icon: '🔗',
    unlockedAt: new Date(),
    category: 'module'
  },
  {
    id: 'syllable_master',
    name: 'Syllable Master',
    description: 'Master all syllable combinations',
    icon: '🏗️',
    unlockedAt: new Date(),
    category: 'module'
  },
  {
    id: 'perfect_syllable_building',
    name: 'Architect',
    description: 'Complete Syllable Building with 100% accuracy',
    icon: '🏛️',
    unlockedAt: new Date(),
    category: 'accuracy'
  },

  // Word Construction Achievements
  {
    id: 'first_word',
    name: 'Word Smith',
    description: 'Construct your first word',
    icon: '📝',
    unlockedAt: new Date(),
    category: 'module'
  },
  {
    id: 'vocabulary_builder',
    name: 'Vocabulary Builder',
    description: 'Learn 10 words',
    icon: '📚',
    unlockedAt: new Date(),
    category: 'module'
  },
  {
    id: 'word_master',
    name: 'Word Master',
    description: 'Learn 50 words',
    icon: '🎓',
    unlockedAt: new Date(),
    category: 'module'
  },
  {
    id: 'perfect_word_construction',
    name: 'Linguist',
    description: 'Complete Word Construction with 100% accuracy',
    icon: '🧠',
    unlockedAt: new Date(),
    category: 'accuracy'
  },

  // Reading Practice Achievements
  {
    id: 'first_story',
    name: 'Story Reader',
    description: 'Read your first story',
    icon: '📖',
    unlockedAt: new Date(),
    category: 'module'
  },
  {
    id: 'cultural_reader',
    name: 'Cultural Reader',
    description: 'Read 5 cultural stories',
    icon: '🌍',
    unlockedAt: new Date(),
    category: 'cultural'
  },
  {
    id: 'perfect_reading_practice',
    name: 'Scholar',
    description: 'Complete Reading Practice with 100% accuracy',
    icon: '🎖️',
    unlockedAt: new Date(),
    category: 'accuracy'
  },

  // Streak Achievements
  {
    id: 'streak_3',
    name: 'Getting Started',
    description: 'Maintain a 3-day learning streak',
    icon: '🔥',
    unlockedAt: new Date(),
    category: 'streak'
  },
  {
    id: 'streak_7',
    name: 'Consistent Learner',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥🔥',
    unlockedAt: new Date(),
    category: 'streak'
  },
  {
    id: 'streak_14',
    name: 'Dedicated Student',
    description: 'Maintain a 14-day learning streak',
    icon: '🔥🔥🔥',
    unlockedAt: new Date(),
    category: 'streak'
  },
  {
    id: 'streak_30',
    name: 'Master Learner',
    description: 'Maintain a 30-day learning streak',
    icon: '🔥🔥🔥🔥',
    unlockedAt: new Date(),
    category: 'streak'
  },

  // Cultural Achievements
  {
    id: 'cultural_explorer',
    name: 'Cultural Explorer',
    description: 'Explore 10 cultural contexts',
    icon: '🗺️',
    unlockedAt: new Date(),
    category: 'cultural'
  },
  {
    id: 'tradition_keeper',
    name: 'Tradition Keeper',
    description: 'Learn about traditional arts and beadwork',
    icon: '🎨',
    unlockedAt: new Date(),
    category: 'cultural'
  },
  {
    id: 'language_guardian',
    name: 'Language Guardian',
    description: 'Learn about language preservation',
    icon: '🛡️',
    unlockedAt: new Date(),
    category: 'cultural'
  },

  // Social Achievements
  {
    id: 'first_share',
    name: 'Community Member',
    description: 'Share your first achievement',
    icon: '🤝',
    unlockedAt: new Date(),
    category: 'social'
  },
  {
    id: 'mentor',
    name: 'Mentor',
    description: 'Help another learner',
    icon: '👨‍🏫',
    unlockedAt: new Date(),
    category: 'social'
  },

  // Special Achievements
  {
    id: 'all_modules_complete',
    name: 'Ditema Scholar',
    description: 'Complete all learning modules',
    icon: '🎓',
    unlockedAt: new Date(),
    category: 'module'
  },
  {
    id: 'perfect_all_modules',
    name: 'Ditema Master',
    description: 'Complete all modules with 100% accuracy',
    icon: '👑',
    unlockedAt: new Date(),
    category: 'accuracy'
  },
  {
    id: 'speed_learner',
    name: 'Speed Learner',
    description: 'Complete a module in record time',
    icon: '⚡',
    unlockedAt: new Date(),
    category: 'module'
  },
  {
    id: 'persistent_learner',
    name: 'Persistent Learner',
    description: 'Complete 100 exercises',
    icon: '💪',
    unlockedAt: new Date(),
    category: 'module'
  },
  {
    id: 'language_switcher',
    name: 'Polyglot',
    description: 'Learn Ditema in multiple languages',
    icon: '🌐',
    unlockedAt: new Date(),
    category: 'cultural'
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Learn after midnight',
    icon: '🦉',
    unlockedAt: new Date(),
    category: 'social'
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Learn before sunrise',
    icon: '🐦',
    unlockedAt: new Date(),
    category: 'social'
  }
];

// Achievement categories for filtering
export const achievementCategories = {
  module: 'Module Completion',
  accuracy: 'Perfect Performance', 
  streak: 'Learning Streaks',
  cultural: 'Cultural Knowledge',
  social: 'Community Engagement'
};

// Helper function to get achievements by category
export function getAchievementsByCategory(category: string): Achievement[] {
  return achievements.filter(achievement => achievement.category === category);
}

// Helper function to get achievement by ID
export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find(achievement => achievement.id === id);
}

// Helper function to get recent achievements (last 5)
export function getRecentAchievements(userAchievements: Achievement[]): Achievement[] {
  return userAchievements
    .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime())
    .slice(0, 5);
}

// Helper function to get achievement progress
export function getAchievementProgress(
  userId: string, 
  userProgress: any, 
  achievementId: string
): { unlocked: boolean; progress: number } {
  const achievement = getAchievementById(achievementId);
  if (!achievement) return { unlocked: false, progress: 0 };

  // Check if already unlocked
  const isUnlocked = userProgress.achievements.some(
    (a: Achievement) => a.id === achievementId
  );

  if (isUnlocked) {
    return { unlocked: true, progress: 100 };
  }

  // Calculate progress based on achievement type
  let progress = 0;

  switch (achievementId) {
    case 'first_vowel':
      progress = userProgress.modules.shapeRecognition.exercisesCompleted > 0 ? 100 : 0;
      break;
    case 'vowel_master':
      progress = Math.min((userProgress.modules.shapeRecognition.mastery / 100) * 100, 100);
      break;
    case 'first_syllable':
      progress = userProgress.modules.syllableBuilding.exercisesCompleted > 0 ? 100 : 0;
      break;
    case 'first_word':
      progress = userProgress.modules.wordConstruction.exercisesCompleted > 0 ? 100 : 0;
      break;
    case 'vocabulary_builder':
      progress = Math.min((userProgress.stats.wordsLearned / 10) * 100, 100);
      break;
    case 'streak_3':
      progress = Math.min((userProgress.streak / 3) * 100, 100);
      break;
    case 'streak_7':
      progress = Math.min((userProgress.streak / 7) * 100, 100);
      break;
    case 'all_modules_complete':
      const completedModules = Object.values(userProgress.modules).filter(
        (module: any) => module.completed
      ).length;
      progress = (completedModules / 4) * 100;
      break;
    default:
      progress = 0;
  }

  return { unlocked: false, progress: Math.round(progress) };
}