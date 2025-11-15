export const CONSTANTS = {
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Points system
  BASE_POINTS: {
    1: 10,  // Beginner
    2: 25,  // Elementary
    3: 50,  // Intermediate
    4: 100, // Advanced
    5: 200, // Expert
    6: 500, // Master
  },

  // Hint penalties
  HINT_PENALTY_PERCENTAGE: 10, // 10% points deduction per hint
  MAX_HINTS: 5,

  // Streak system
  STREAK_BONUS_MULTIPLIER: 1.5, // 1.5x points for streak
  MAX_STREAK_DAYS: 30,

  // Level system
  EXP_PER_LEVEL: 100,
  LEVEL_BASE_MULTIPLIER: 1.2,

  // Time limits (in seconds)
  DEFAULT_TIME_LIMIT: 5,
  MAX_TIME_LIMIT: 60,
  MIN_TIME_LIMIT: 1,

  // Memory limits (in bytes)
  DEFAULT_MEMORY_LIMIT: 128 * 1024 * 1024, // 128MB
  MAX_MEMORY_LIMIT: 512 * 1024 * 1024,    // 512MB
  MIN_MEMORY_LIMIT: 16 * 1024 * 1024,     // 16MB

  // Code limits
  MAX_CODE_LENGTH: 10000,
  MIN_CODE_LENGTH: 1,

  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],

  // Rate limiting
  RATE_LIMITS: {
    GENERAL: { windowMs: 15 * 60 * 1000, max: 100 },      // 15 minutes, 100 requests
    AUTH: { windowMs: 15 * 60 * 1000, max: 5 },          // 15 minutes, 5 requests
    SUBMISSION: { windowMs: 1 * 60 * 1000, max: 10 },     // 1 minute, 10 requests
    CODE_EXECUTION: { windowMs: 1 * 60 * 1000, max: 20 }, // 1 minute, 20 requests
    PASSWORD_RESET: { windowMs: 60 * 60 * 1000, max: 3 }, // 1 hour, 3 requests
    UPLOAD: { windowMs: 10 * 60 * 1000, max: 5 },         // 10 minutes, 5 requests
  },

  // JWT
  JWT_ALGORITHM: 'HS256',
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',

  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,
  PASSWORD_REQUIRE_SPECIAL: false,

  // Username requirements
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  USERNAME_PATTERN: /^[a-zA-Z0-9_-]+$/,

  // Email validation
  EMAIL_MAX_LENGTH: 255,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Categories
  PROBLEM_CATEGORIES: [
    'algorithms',
    'data-structures',
    'web-development',
    'mobile-development',
    'game-development',
    'machine-learning',
    'database',
    'security',
    'devops',
    'testing',
    'debugging',
    'optimization',
  ],

  // Tags
  COMMON_TAGS: [
    'arrays',
    'strings',
    'loops',
    'conditionals',
    'functions',
    'recursion',
    'sorting',
    'searching',
    'graph',
    'tree',
    'dynamic-programming',
    'greedy',
    'backtracking',
    'bit-manipulation',
    'math',
    'geometry',
    'string-manipulation',
    'regex',
    'file-handling',
    'api',
    'json',
    'xml',
    'html',
    'css',
    'javascript',
    'python',
    'java',
    'c++',
    'php',
  ],

  // Achievements
  ACHIEVEMENTS: {
    FIRST_PROBLEM: {
      type: 'first_problem',
      name: 'First Steps',
      description: 'Solve your first problem',
      points: 10,
      badgeUrl: '/achievements/first-problem.png',
    },
    STREAK_7: {
      type: 'streak_7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day solving streak',
      points: 50,
      badgeUrl: '/achievements/streak-7.png',
    },
    STREAK_30: {
      type: 'streak_30',
      name: 'Monthly Master',
      description: 'Maintain a 30-day solving streak',
      points: 200,
      badgeUrl: '/achievements/streak-30.png',
    },
    PERFECT_SCORE: {
      type: 'perfect_score',
      name: 'Perfectionist',
      description: 'Solve a problem without any hints or mistakes',
      points: 25,
      badgeUrl: '/achievements/perfect-score.png',
    },
    SPEED_RUNNER: {
      type: 'speed_runner',
      name: 'Speed Demon',
      description: 'Solve a problem in under 2 minutes',
      points: 30,
      badgeUrl: '/achievements/speed-runner.png',
    },
    POLYGLOT: {
      type: 'polyglot',
      name: 'Polyglot Programmer',
      description: 'Solve problems in 5 different programming languages',
      points: 100,
      badgeUrl: '/achievements/polyglot.png',
    },
    HELPER: {
      type: 'helper',
      name: 'Helpful Helper',
      description: 'Use hints effectively to solve 10 problems',
      points: 40,
      badgeUrl: '/achievements/helper.png',
    },
    MASTER_DEBUGGER: {
      type: 'master_debugger',
      name: 'Master Debugger',
      description: 'Solve 20 debugging problems',
      points: 150,
      badgeUrl: '/achievements/master-debugger.png',
    },
  },

  // Problem types
  PROBLEM_TYPES: {
    DEBUGGING: {
      name: 'Debugging',
      description: 'Find and fix errors in existing code',
      icon: 'bug',
    },
    CODE_COMPLETION: {
      name: 'Code Completion',
      description: 'Complete partially written code',
      icon: 'code',
    },
    ERROR_FIXING: {
      name: 'Error Fixing',
      description: 'Fix specific errors in code',
      icon: 'tool',
    },
    ALGORITHM_IMPLEMENTATION: {
      name: 'Algorithm Implementation',
      description: 'Implement algorithms from scratch',
      icon: 'brain',
    },
    CODE_REFACTORING: {
      name: 'Code Refactoring',
      description: 'Improve existing code structure',
      icon: 'refresh-cw',
    },
  },

  // Difficulty levels
  DIFFICULTY_LEVELS: {
    1: {
      name: 'Beginner',
      description: 'Perfect for coding beginners',
      color: '#10b981', // green
      icon: 'star',
    },
    2: {
      name: 'Elementary',
      description: 'Basic programming concepts',
      color: '#22c55e', // light green
      icon: 'star-half',
    },
    3: {
      name: 'Intermediate',
      description: 'Moderate difficulty challenges',
      color: '#f59e0b', // amber
      icon: 'zap',
    },
    4: {
      name: 'Advanced',
      description: 'Complex problem solving',
      color: '#f97316', // orange
      icon: 'flame',
    },
    5: {
      name: 'Expert',
      description: 'Expert-level challenges',
      color: '#ef4444', // red
      icon: 'crown',
    },
    6: {
      name: 'Master',
      description: 'Ultimate programming challenges',
      color: '#dc2626', // dark red
      icon: 'trophy',
    },
  },

  // Programming languages
  PROGRAMMING_LANGUAGES: {
    javascript: {
      name: 'JavaScript',
      extension: 'js',
      compileCommand: 'node',
      runCommand: 'node',
      icon: 'code',
      color: '#f7df1e',
    },
    python: {
      name: 'Python',
      extension: 'py',
      compileCommand: 'python3',
      runCommand: 'python3',
      icon: 'terminal',
      color: '#3776ab',
    },
    php: {
      name: 'PHP',
      extension: 'php',
      compileCommand: 'php',
      runCommand: 'php',
      icon: 'database',
      color: '#777bb4',
    },
    html: {
      name: 'HTML',
      extension: 'html',
      compileCommand: null,
      runCommand: null,
      icon: 'globe',
      color: '#e34c26',
    },
    css: {
      name: 'CSS',
      extension: 'css',
      compileCommand: null,
      runCommand: null,
      icon: 'palette',
      color: '#1572b6',
    },
    java: {
      name: 'Java',
      extension: 'java',
      compileCommand: 'javac',
      runCommand: 'java',
      icon: 'coffee',
      color: '#007396',
    },
    cpp: {
      name: 'C++',
      extension: 'cpp',
      compileCommand: 'g++',
      runCommand: './a.out',
      icon: 'cpu',
      color: '#00599c',
    },
    csharp: {
      name: 'C#',
      extension: 'cs',
      compileCommand: 'csc',
      runCommand: 'dotnet run',
      icon: 'box',
      color: '#239120',
    },
    ruby: {
      name: 'Ruby',
      extension: 'rb',
      compileCommand: 'ruby',
      runCommand: 'ruby',
      icon: 'gem',
      color: '#cc342d',
    },
    go: {
      name: 'Go',
      extension: 'go',
      compileCommand: 'go build',
      runCommand: 'go run',
      icon: 'play',
      color: '#00add8',
    },
    rust: {
      name: 'Rust',
      extension: 'rs',
      compileCommand: 'rustc',
      runCommand: './main',
      icon: 'settings',
      color: '#dea584',
    },
    typescript: {
      name: 'TypeScript',
      extension: 'ts',
      compileCommand: 'tsc',
      runCommand: 'node',
      icon: 'layers',
      color: '#3178c6',
    },
  },

  // Ranking calculations
  RANKING_FORMULA: {
    POINTS_WEIGHT: 0.6,
    ACCURACY_WEIGHT: 0.2,
    WIN_RATE_WEIGHT: 0.15,
    STREAK_WEIGHT: 0.05,
  },

  // Anti-cheat thresholds
  ANTI_CHEAT: {
    SIMILARITY_THRESHOLD: 0.8,      // 80% similarity threshold
    TIME_THRESHOLD: 10,              // 10 seconds for suspicious submissions
    MULTIPLE_SUBMISSIONS: 5,        // 5 submissions in 1 minute is suspicious
    COPY_PASTE_LENGTH: 50,          // 50 identical characters
    VARIABLE_NAME_PATTERN: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
  },
};

export default CONSTANTS;