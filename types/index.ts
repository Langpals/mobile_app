export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'veryHard';

export interface Step {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  difficulty: DifficultyLevel;
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: number; // in minutes
  steps: Step[];
  completed: boolean;
  locked: boolean;
  difficulty: DifficultyLevel;
}

export interface Season {
  id: string;
  number: number;
  title: string;
  description: string;
  learningObjectives: string[];
  episodes: Episode[];
  completed: boolean;
  locked: boolean;
}

export interface ProgressStats {
  totalEpisodes: number;
  completedEpisodes: number;
  totalSteps: number;
  completedSteps: number;
  totalTimeSpent: number; // in minutes
  lastSessionDate: string;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatarUrl?: string;
  languages: string[];
}

export interface TeddyBear {
  id: string;
  name: string;
  connected: boolean;
  batteryLevel: number;
  lastSyncDate: string;
}