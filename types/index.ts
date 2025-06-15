// types/index.ts
export type DifficultyLevel = 'veryEasy' | 'easy' | 'medium' | 'hard' | 'veryHard';

export interface LearningOutcome {
  id: string;
  description: string;
  achieved: boolean;
  category: 'vocabulary' | 'grammar' | 'conversation' | 'cultural' | 'pronunciation';
}

export interface Step {
  id: string;
  title: string;
  description: string;
  type: 'introduction' | 'vocabulary' | 'interaction' | 'review' | 'assessment';
  completed: boolean;
  difficulty: DifficultyLevel;
  vocabularyWords: string[];
  estimatedDuration: number; // in minutes
  interactionCount: number;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  setting: string;
  narrativeHook: string;
  duration: number; // in minutes
  type: 'standard' | 'weekend_special';
  steps: Step[];
  completed: boolean;
  locked: boolean;
  difficulty: DifficultyLevel;
  vocabularyFocus: string[];
  learningOutcomes: string[];
  completionRate: number; // 0-100
  lastPlayed?: string;
}

export interface Season {
  id: string;
  number: number;
  title: string;
  theme: string;
  setting: string;
  characterRole: string;
  narrativeHook: string;
  description: string;
  learningFocus: string[];
  learningOutcomes: LearningOutcome[];
  episodes: Episode[];
  completed: boolean;
  locked: boolean;
  totalDuration: number; // calculated from episodes
  progressPercentage: number; // 0-100
}

export interface ProficiencyMetrics {
  vocabularyMastery: {
    learning: number;
    reviewing: number;
    mastered: number;
    total: number;
  };
  pronunciationAccuracy: number; // 0-100
  responseAppropriatenesss: number; // 0-100
  engagementLevel: number; // 0-100
  overallProficiency: DifficultyLevel;
  lastAssessment: string;
}

export interface ProgressStats {
  totalSeasons: number;
  completedSeasons: number;
  totalEpisodes: number;
  completedEpisodes: number;
  totalSteps: number;
  completedSteps: number;
  totalTimeSpent: number; // in minutes
  lastSessionDate: string;
  currentStreak: number; // days
  proficiency: ProficiencyMetrics;
  weeklyGoalMinutes: number;
  weeklyCompletedMinutes: number;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatarUrl?: string;
  languages: string[];
  preferredDifficulty: DifficultyLevel;
  adaptiveSettings: {
    responseTimeExtension: number; // seconds
    repetitionCount: number;
    vocabularyPerEpisode: number;
    visualAidsEnabled: boolean;
  };
  goals: {
    dailyMinutes: number;
    weeklyEpisodes: number;
    focusAreas: string[];
  };
  wordsLearned: number;
  topicsMastered: number;
  learningStreak: number;
  totalLearningTime: number;
}

export interface TeddyBear {
  id: string;
  name: string;
  appearance: {
    color: string;
    accessories: string[];
    outfit: string;
  };
  connected: boolean;
  batteryLevel: number;
  lastSyncDate: string;
  mood: 'happy' | 'excited' | 'thinking' | 'sleepy' | 'encouraging';
}

export interface InteractionData {
  stepId: string;
  timestamp: string;
  responseTime: number; // seconds
  accuracy: number; // 0-100
  completed: boolean;
  attemptCount: number;
  hints_used: number;
}

export interface SessionData {
  id: string;
  episodeId: string;
  startTime: string;
  endTime?: string;
  completionRate: number; // 0-100
  interactions: InteractionData[];
  enjoymentRating?: number; // 1-5 or 1-10
  notes?: string;
}