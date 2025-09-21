// Ditema tsa Dinoko Script Types and Interfaces

export interface Language {
  id: string;
  name: string;
  nativeName: string;
  code: string;
  phoneticRules: PhoneticRules;
}

export interface PhoneticRules {
  vowels: VowelMap;
  consonants: ConsonantMap;
  digraphs: DigraphMap;
  specialRules: SpecialRule[];
}

export interface VowelMap {
  [latin: string]: VowelSymbol;
}

export interface ConsonantMap {
  [latin: string]: ConsonantSymbol;
}

export interface DigraphMap {
  [latin: string]: ConsonantSymbol;
}

export interface VowelSymbol {
  symbol: string;
  triangle: TriangleDirection;
  ipa: string;
  description: string;
}

export interface ConsonantSymbol {
  symbol: string;
  mark: ConsonantMark;
  ipa: string;
  description: string;
  category: ConsonantCategory;
}

export type TriangleDirection = 'up' | 'down' | 'left' | 'right';

export interface ConsonantMark {
  type: 'circle' | 'dot' | 'line' | 'curve';
  position: 'inside' | 'outside' | 'edge';
  size: 'small' | 'medium' | 'large';
}

export type ConsonantCategory = 'plosive' | 'fricative' | 'nasal' | 'liquid' | 'click';

export interface SpecialRule {
  pattern: string;
  replacement: string;
  description: string;
}

export interface Syllable {
  consonant?: ConsonantSymbol;
  vowel: VowelSymbol;
  tone?: Tone;
}

export interface Tone {
  level: 1 | 2 | 3 | 4 | 5;
  mark: string;
}

export interface Word {
  latin: string;
  ditema: DitemaElement[];
  syllables: Syllable[];
  meaning: string;
  culturalContext?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface DitemaElement {
  type: 'triangle' | 'circle' | 'dot' | 'line' | 'curve';
  position: Position;
  properties: ElementProperties;
}

export interface Position {
  x: number;
  y: number;
}

export interface ElementProperties {
  size: number;
  color: string;
  rotation?: number;
  opacity?: number;
}

// User Progress and Gamification
export interface UserProgress {
  userId: string;
  language: string;
  modules: ModuleProgress;
  stats: UserStats;
  achievements: Achievement[];
  streak: number;
  totalPoints: number;
}

export interface ModuleProgress {
  shapeRecognition: ModuleStats;
  syllableBuilding: ModuleStats;
  wordConstruction: ModuleStats;
  readingPractice: ModuleStats;
}

export interface ModuleStats {
  completed: boolean;
  accuracy: number;
  timeSpent: number;
  exercisesCompleted: number;
  mastery: number; // 0-100
}

export interface UserStats {
  totalTimeSpent: number;
  averageAccuracy: number;
  exercisesCompleted: number;
  wordsLearned: number;
  currentStreak: number;
  longestStreak: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'module' | 'accuracy' | 'streak' | 'cultural' | 'social';
}

// Exercise Types
export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: number;
  timeLimit?: number;
  points: number;
}

export type ExerciseType = 
  | 'vowel_recognition'
  | 'consonant_recognition' 
  | 'syllable_building'
  | 'word_construction'
  | 'reading_practice'
  | 'audio_matching'
  | 'drag_drop';

// Audio System
export interface AudioFile {
  id: string;
  url: string;
  type: 'phoneme' | 'syllable' | 'word' | 'phrase';
  language: string;
  phonetic: string;
  duration: number;
}

// Cultural Content
export interface CulturalContent {
  id: string;
  type: 'history' | 'art' | 'story' | 'proverb' | 'song';
  title: string;
  content: string;
  images?: string[];
  audio?: string;
  language: string;
  relatedWords: string[];
}