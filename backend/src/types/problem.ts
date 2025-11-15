import { DifficultyLevel, ProgrammingLanguage, ProblemType } from './common';

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  language: ProgrammingLanguage;
  category: string;
  type: ProblemType;
  points: number;
  timeLimit: number; // in seconds
  memoryLimit: number; // in bytes
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  sampleInput?: string;
  sampleOutput?: string;
  explanation?: string;
  hints: string[];
  maxHints: number;
  starterCode?: Record<ProgrammingLanguage, string>;
  solutionCode?: Record<ProgrammingLanguage, string>;
  testCases: TestCase[];
  authorId: string;
  isPublished: boolean;
  tags: string[];
  submissionCount: number;
  successRate: number;
  averageAttempts: number;
  bestTime: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

export interface TestCase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  isSample: boolean;
  weight: number; // for scoring weighted test cases
  timeLimit?: number; // override problem time limit
  memoryLimit?: number; // override problem memory limit
  explanation?: string;
}

export interface ProblemSubmission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: ProgrammingLanguage;
  status: string;
  result?: SubmissionResult;
  executionTime?: number; // in milliseconds
  memoryUsage?: number; // in bytes
  compileTime?: number; // in milliseconds
  errorMessage?: string;
  stdout?: string;
  stderr?: string;
  testCasesPassed: number;
  totalTestCases: number;
  attempts: number;
  hintsUsed: number;
  pointsEarned: number;
  timeSpent: number; // in minutes
  ipAddress?: string;
  userAgent?: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubmissionResult {
  status: string;
  message: string;
  score: number;
  maxScore: number;
  testCaseResults: TestCaseResult[];
  metadata: {
    compileTime?: number;
    executionTime: number;
    memoryUsage: number;
    codeLength: number;
    language: ProgrammingLanguage;
  };
}

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  executionTime?: number;
  memoryUsage?: number;
  output?: string;
  expectedOutput?: string;
  error?: string;
}

export interface ProblemTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: DifficultyLevel;
  language: ProgrammingLanguage;
  category: string;
  type: ProblemType;
  templateCode: Record<ProgrammingLanguage, string>;
  testCases: Omit<TestCase, 'id' | 'problemId'>[];
  hints: string[];
  points: number;
  timeLimit: number;
  memoryLimit: number;
}

export interface ProblemFilter {
  difficulty?: DifficultyLevel[];
  language?: ProgrammingLanguage[];
  category?: string[];
  type?: ProblemType[];
  tags?: string[];
  minPoints?: number;
  maxPoints?: number;
  solvedStatus?: 'all' | 'solved' | 'unsolved' | 'attempted';
  search?: string;
}

export interface ProblemListResponse {
  problems: Problem[];
  total: number;
  page: number;
  limit: number;
  filters: ProblemFilter;
}

export interface CodeExecutionRequest {
  code: string;
  language: ProgrammingLanguage;
  input?: string;
  timeLimit?: number;
  memoryLimit?: number;
}

export interface CodeExecutionResponse {
  status: string;
  output?: string;
  error?: string;
  executionTime: number;
  memoryUsage: number;
  compileTime?: number;
  exitCode: number;
}

export interface ProblemHint {
  id: string;
  problemId: string;
  order: number;
  content: string;
  pointPenalty: number;
}

export interface ProblemDiscussion {
  id: string;
  problemId: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  replies: number;
  views: number;
  lastActivityAt: Date;
  createdAt: Date;
  updatedAt: Date;
}