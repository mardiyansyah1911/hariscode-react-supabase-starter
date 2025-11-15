import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const difficultyLevelEnum = pgEnum('difficulty_level', ['1', '2', '3', '4', '5', '6']);
export const programmingLanguageEnum = pgEnum('programming_language', [
  'javascript',
  'python',
  'php',
  'html',
  'css',
  'java',
  'cpp',
  'csharp',
  'ruby',
  'go',
  'rust',
  'typescript',
]);
export const submissionStatusEnum = pgEnum('submission_status', [
  'pending',
  'running',
  'accepted',
  'wrong_answer',
  'time_limit_exceeded',
  'memory_limit_exceeded',
  'compilation_error',
  'runtime_error',
  'system_error',
]);
export const problemTypeEnum = pgEnum('problem_type', [
  'debugging',
  'code_completion',
  'error_fixing',
  'algorithm_implementation',
  'code_refactoring',
]);

// Users table
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    firstName: varchar('first_name', { length: 100 }),
    lastName: varchar('last_name', { length: 100 }),
    avatar: varchar('avatar', { length: 500 }),
    bio: text('bio'),
    role: userRoleEnum('role').default('user'),
    isActive: boolean('is_active').default(true),
    isEmailVerified: boolean('is_email_verified').default(false),
    emailVerificationToken: varchar('email_verification_token', { length: 255 }),
    passwordResetToken: varchar('password_reset_token', { length: 255 }),
    passwordResetExpires: timestamp('password_reset_expires'),
    lastLoginAt: timestamp('last_login_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    usernameIdx: index('idx_users_username').on(table.username),
    emailIdx: index('idx_users_email').on(table.email),
  })
);

// User Statistics table
export const userStatistics = pgTable(
  'user_statistics',
  {
    userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
    totalSubmissions: integer('total_submissions').default(0),
    successfulSubmissions: integer('successful_submissions').default(0),
    totalAttempts: integer('total_attempts').default(0),
    averageAttempts: decimal('average_attempts', { precision: 5, scale: 2 }).default('0.00'),
    totalPoints: integer('total_points').default(0),
    globalRank: integer('global_rank'),
    winRate: decimal('win_rate', { precision: 5, scale: 2 }).default('0.00'),
    accuracy: decimal('accuracy', { precision: 5, scale: 2 }).default('0.00'),
    currentStreak: integer('current_streak').default(0),
    longestStreak: integer('longest_streak').default(0),
    skillsByLanguage: jsonb('skills_by_language').$type<Record<string, any>>(),
    problemsByDifficulty: jsonb('problems_by_difficulty').$type<Record<string, any>>(),
    achievementsUnlocked: integer('achievements_unlocked').default(0),
    hintsUsed: integer('hints_used').default(0),
    totalTimeSpent: integer('total_time_spent').default(0), // in minutes
    lastUpdated: timestamp('last_updated').defaultNow(),
  }
);

// User Progress table
export const userProgress = pgTable(
  'user_progress',
  {
    userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
    currentLevel: integer('current_level').default(1),
    currentExp: integer('current_exp').default(0),
    expToNextLevel: integer('exp_to_next_level').default(100),
    totalExp: integer('total_exp').default(0),
    levelProgress: integer('level_progress').default(0), // percentage
    unlockedLanguages: jsonb('unlocked_languages').$type<string[]>().default('[]'),
    unlockedDifficulties: jsonb('unlocked_difficulties').$type<string[]>().default('["1"]'),
    completedProblems: jsonb('completed_problems').$type<string[]>().default('[]'),
    inProgressProblems: jsonb('in_progress_problems').$type<string[]>().default('[]'),
    bookmarkedProblems: jsonb('bookmarked_problems').$type<string[]>().default('[]'),
    lastUpdated: timestamp('last_updated').defaultNow(),
  }
);

// User Preferences table
export const userPreferences = pgTable(
  'user_preferences',
  {
    userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
    preferredLanguage: programmingLanguageEnum('preferred_language').default('javascript'),
    theme: varchar('theme', { length: 20 }).default('light'),
    language: varchar('language', { length: 5 }).default('en'),
    notifications: jsonb('notifications').$type<Record<string, boolean>>(),
    editorSettings: jsonb('editor_settings').$type<Record<string, any>>(),
    lastUpdated: timestamp('last_updated').defaultNow(),
  }
);

// Problems table
export const problems = pgTable(
  'problems',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    difficulty: difficultyLevelEnum('difficulty').notNull(),
    language: programmingLanguageEnum('language').notNull(),
    category: varchar('category', { length: 100 }).notNull(),
    type: problemTypeEnum('type').notNull(),
    points: integer('points').notNull().default(100),
    timeLimit: integer('time_limit').notNull().default(5000), // in milliseconds
    memoryLimit: integer('memory_limit').notNull().default(128000000), // in bytes
    inputFormat: text('input_format'),
    outputFormat: text('output_format'),
    constraints: text('constraints'),
    sampleInput: text('sample_input'),
    sampleOutput: text('sample_output'),
    explanation: text('explanation'),
    hints: jsonb('hints').$type<string[]>().default('[]'),
    maxHints: integer('max_hints').default(5),
    starterCode: jsonb('starter_code').$type<Record<string, string>>(),
    solutionCode: jsonb('solution_code').$type<Record<string, string>>(),
    authorId: uuid('author_id').references(() => users.id),
    isPublished: boolean('is_published').default(false),
    tags: jsonb('tags').$type<string[]>().default('[]'),
    submissionCount: integer('submission_count').default(0),
    successRate: decimal('success_rate', { precision: 5, scale: 2 }).default('0.00'),
    averageAttempts: decimal('average_attempts', { precision: 5, scale: 2 }).default('0.00'),
    bestTime: integer('best_time'), // in minutes
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    difficultyIdx: index('idx_problems_difficulty').on(table.difficulty),
    languageIdx: index('idx_problems_language').on(table.language),
    categoryIdx: index('idx_problems_category').on(table.category),
    publishedIdx: index('idx_problems_published').on(table.isPublished),
  })
);

// Test Cases table
export const testCases = pgTable(
  'test_cases',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    problemId: uuid('problem_id').references(() => problems.id, { onDelete: 'cascade' }).notNull(),
    input: text('input').notNull(),
    expectedOutput: text('expected_output').notNull(),
    isHidden: boolean('is_hidden').default(false),
    isSample: boolean('is_sample').default(false),
    weight: integer('weight').default(1),
    timeLimit: integer('time_limit'),
    memoryLimit: integer('memory_limit'),
    explanation: text('explanation'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    problemIdx: index('idx_test_cases_problem').on(table.problemId),
  })
);

// Submissions table
export const submissions = pgTable(
  'submissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    problemId: uuid('problem_id').references(() => problems.id, { onDelete: 'cascade' }).notNull(),
    code: text('code').notNull(),
    language: programmingLanguageEnum('language').notNull(),
    status: submissionStatusEnum('status').notNull().default('pending'),
    result: jsonb('result').$type<Record<string, any>>(),
    executionTime: integer('execution_time'), // in milliseconds
    memoryUsage: integer('memory_usage'), // in bytes
    compileTime: integer('compile_time'), // in milliseconds
    errorMessage: text('error_message'),
    stdout: text('stdout'),
    stderr: text('stderr'),
    testCasesPassed: integer('test_cases_passed').default(0),
    totalTestCases: integer('total_test_cases').default(0),
    attempts: integer('attempts').default(1),
    hintsUsed: integer('hints_used').default(0),
    pointsEarned: integer('points_earned').default(0),
    timeSpent: integer('time_spent').default(0), // in minutes
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),
    submittedAt: timestamp('submitted_at').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    userIdx: index('idx_submissions_user').on(table.userId),
    problemIdx: index('idx_submissions_problem').on(table.problemId),
    statusIdx: index('idx_submissions_status').on(table.status),
    languageIdx: index('idx_submissions_language').on(table.language),
  })
);

// Achievements table
export const achievements = pgTable(
  'achievements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    type: varchar('type', { length: 100 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    badgeUrl: varchar('badge_url', { length: 500 }),
    points: integer('points').default(0),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
  }
);

// User Achievements table (junction table)
export const userAchievements = pgTable(
  'user_achievements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    achievementId: uuid('achievement_id').references(() => achievements.id, { onDelete: 'cascade' }).notNull(),
    unlockedAt: timestamp('unlocked_at').defaultNow(),
    progress: integer('progress').default(0),
  },
  (table) => ({
    userIdx: index('idx_user_achievements_user').on(table.userId),
    achievementIdx: index('idx_user_achievements_achievement').on(table.achievementId),
    uniqueUserAchievement: index('idx_unique_user_achievement').on(table.userId, table.achievementId),
  })
);

// Leaderboard table
export const leaderboard = pgTable(
  'leaderboard',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    language: programmingLanguageEnum('language'),
    globalRank: integer('global_rank'),
    points: integer('points').default(0),
    winRate: decimal('win_rate', { precision: 5, scale: 2 }).default('0.00'),
    accuracy: decimal('accuracy', { precision: 5, scale: 2 }).default('0.00'),
    totalProblems: integer('total_problems').default(0),
    completedProblems: integer('completed_problems').default(0),
    currentStreak: integer('current_streak').default(0),
    lastUpdated: timestamp('last_updated').defaultNow(),
  },
  (table) => ({
    userIdx: index('idx_leaderboard_user').on(table.userId),
    languageIdx: index('idx_leaderboard_language').on(table.language),
    pointsIdx: index('idx_leaderboard_points').on(table.points),
    globalRankIdx: index('idx_leaderboard_global_rank').on(table.globalRank),
    uniqueUserLanguage: index('idx_unique_user_language').on(table.userId, table.language),
  })
);

// User Sessions table
export const userSessions = pgTable(
  'user_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    token: varchar('token', { length: 500 }).notNull(),
    refreshToken: varchar('refresh_token', { length: 500 }).notNull(),
    userAgent: text('user_agent'),
    ipAddress: varchar('ip_address', { length: 45 }),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    isActive: boolean('is_active').default(true),
  },
  (table) => ({
    userIdx: index('idx_user_sessions_user').on(table.userId),
    tokenIdx: index('idx_user_sessions_token').on(table.token),
    refreshTokenIdx: index('idx_user_sessions_refresh_token').on(table.refreshToken),
    expiresAtIdx: index('idx_user_sessions_expires_at').on(table.expiresAt),
  })
);

// Export all tables
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserStatistics = typeof userStatistics.$inferSelect;
export type NewUserStatistics = typeof userStatistics.$inferInsert;

export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;

export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;

export type Problem = typeof problems.$inferSelect;
export type NewProblem = typeof problems.$inferInsert;

export type TestCase = typeof testCases.$inferSelect;
export type NewTestCase = typeof testCases.$inferInsert;

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;

export type Achievement = typeof achievements.$inferSelect;
export type NewAchievement = typeof achievements.$inferInsert;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type NewUserAchievement = typeof userAchievements.$inferInsert;

export type Leaderboard = typeof leaderboard.$inferSelect;
export type NewLeaderboard = typeof leaderboard.$inferInsert;

export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;