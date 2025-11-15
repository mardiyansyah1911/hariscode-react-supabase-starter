export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum DifficultyLevel {
  BEGINNER = 1,
  ELEMENTARY = 2,
  INTERMEDIATE = 3,
  ADVANCED = 4,
  EXPERT = 5,
  MASTER = 6,
}

export enum ProgrammingLanguage {
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  PHP = 'php',
  HTML = 'html',
  CSS = 'css',
  JAVA = 'java',
  CPP = 'cpp',
  CSHARP = 'csharp',
  RUBY = 'ruby',
  GO = 'go',
  RUST = 'rust',
  TYPESCRIPT = 'typescript',
}

export enum SubmissionStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  ACCEPTED = 'accepted',
  WRONG_ANSWER = 'wrong_answer',
  TIME_LIMIT_EXCEEDED = 'time_limit_exceeded',
  MEMORY_LIMIT_EXCEEDED = 'memory_limit_exceeded',
  COMPILATION_ERROR = 'compilation_error',
  RUNTIME_ERROR = 'runtime_error',
  SYSTEM_ERROR = 'system_error',
}

export enum ProblemType {
  DEBUGGING = 'debugging',
  CODE_COMPLETION = 'code_completion',
  ERROR_FIXING = 'error_fixing',
  ALGORITHM_IMPLEMENTATION = 'algorithm_implementation',
  CODE_REFACTORING = 'code_refactoring',
}

export enum AchievementType {
  FIRST_PROBLEM = 'first_problem',
  STREAK_7 = 'streak_7',
  STREAK_30 = 'streak_30',
  PERFECT_SCORE = 'perfect_score',
  SPEED_RUNNER = 'speed_runner',
  POLYGLOT = 'polyglot',
  HELPER = 'helper',
  MASTER_DEBUGGER = 'master_debugger',
}

export interface ErrorCode {
  code: string;
  message: string;
  details?: any;
}