import { UserRole, ProgrammingLanguage, DifficultyLevel } from './common';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface UserStatistics {
  userId: string;
  totalSubmissions: number;
  successfulSubmissions: number;
  totalAttempts: number;
  averageAttempts: number;
  totalPoints: number;
  globalRank: number;
  winRate: number;
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
  skillsByLanguage: Record<ProgrammingLanguage, LanguageSkill>;
  problemsByDifficulty: Record<DifficultyLevel, DifficultyStats>;
  achievementsUnlocked: number;
  hintsUsed: number;
  totalTimeSpent: number; // in minutes
}

export interface LanguageSkill {
  language: ProgrammingLanguage;
  problemsSolved: number;
  totalProblems: number;
  points: number;
  rank: number;
  skillLevel: number; // 1-100
  accuracy: number;
  averageTime: number; // in minutes
}

export interface DifficultyStats {
  difficulty: DifficultyLevel;
  problemsSolved: number;
  totalProblems: number;
  accuracy: number;
  averageAttempts: number;
  bestTime: number; // in minutes
  averageTime: number; // in minutes
}

export interface UserPreferences {
  userId: string;
  preferredLanguage: ProgrammingLanguage;
  theme: 'light' | 'dark' | 'auto';
  language: 'en' | 'id';
  notifications: {
    email: boolean;
    push: boolean;
    achievements: boolean;
    leaderboard: boolean;
    newProblems: boolean;
  };
  editorSettings: {
    fontSize: number;
    tabSize: number;
    wordWrap: boolean;
    minimap: boolean;
    theme: string;
  };
}

export interface UserProgress {
  userId: string;
  currentLevel: number;
  currentExp: number;
  expToNextLevel: number;
  totalExp: number;
  levelProgress: number; // percentage
  unlockedLanguages: ProgrammingLanguage[];
  unlockedDifficulties: DifficultyLevel[];
  completedProblems: string[];
  inProgressProblems: string[];
  bookmarkedProblems: string[];
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementType: string;
  title: string;
  description: string;
  badgeUrl: string;
  unlockedAt: Date;
  progress: number;
  isUnlocked: boolean;
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
  createdAt: Date;
  isActive: boolean;
}