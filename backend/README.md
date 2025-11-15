# Haris Code Backend

**Backend API untuk Haris Code - Platform Pembelajaran Coding**

## 🏗️ Struktur Project Backend

```
backend/
├── src/
│   ├── server.ts                 # Entry point server
│   ├── app.ts                    # Express app configuration
│   ├── config/                   # Configuration files
│   │   ├── database.ts          # Database connection
│   │   ├── env.ts               # Environment variables
│   │   └── jwt.ts               # JWT configuration
│   ├── middleware/              # Custom middleware
│   │   ├── auth.ts              # Authentication middleware
│   │   ├── validation.ts        # Input validation
│   │   ├── errorHandler.ts      # Error handling
│   │   └── rateLimiter.ts       # Rate limiting
│   ├── routes/                   # API routes
│   │   ├── index.ts             # Routes index
│   │   ├── auth.ts              # Authentication routes
│   │   ├── users.ts             # User management
│   │   ├── problems.ts          # Problem management
│   │   ├── submissions.ts       # Code submissions
│   │   ├── rankings.ts          # Leaderboard
│   │   ├── achievements.ts      # User achievements
│   │   └── admin.ts             # Admin operations
│   ├── controllers/              # Route controllers
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── problemController.ts
│   │   ├── submissionController.ts
│   │   ├── rankingController.ts
│   │   ├── achievementController.ts
│   │   └── adminController.ts
│   ├── services/                 # Business logic services
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── problemService.ts
│   │   ├── submissionService.ts
│   │   ├── codeExecutor.ts
│   │   ├── rankingService.ts
│   │   ├── achievementService.ts
│   │   └── antiCheatService.ts
│   ├── models/                   # Database models
│   │   ├── schema.ts            # Drizzle schema
│   │   ├── User.ts
│   │   ├── Problem.ts
│   │   ├── Submission.ts
│   │   ├── Achievement.ts
│   │   └── Leaderboard.ts
│   ├── types/                    # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── problem.ts
│   │   ├── submission.ts
│   │   └── common.ts
│   └── utils/                    # Utility functions
│       ├── logger.ts
│       ├── validation.ts
│       ├── encryption.ts
│       ├── constants.ts
│       └── helpers.ts
├── drizzle.config.ts             # Drizzle ORM configuration
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🚀 Fitur Backend

### **Authentication & Authorization**
- JWT token-based authentication
- Role-based access control (User, Admin)
- Email verification system
- Password reset functionality
- Session management

### **User Management**
- User registration & login
- Profile management
- Skill tracking
- Progress monitoring
- Statistics tracking

### **Problem Management**
- 6 tingkatan difficulty level
- Multi-language support (PHP, HTML, JavaScript, CSS, Python, etc.)
- Problem categorization
- Test case management
- Anti-cheating mechanisms

### **Code Execution**
- Secure sandboxed code execution
- Multi-language compiler support
- Real-time execution feedback
- Performance monitoring
- Resource limiting

### **Submission System**
- Code submission tracking
- Attempt counting
- Point calculation
- Hint system with point deduction
- Auto-grading system

### **Leaderboard & Ranking**
- Global rankings
- Per-language rankings
- Skill level tracking
- Win rate calculation
- Accuracy metrics

### **Admin Panel**
- User management (ban/suspend)
- Problem CRUD operations
- Submission monitoring
- Analytics dashboard
- System configuration

## 🛠️ Technology Stack

- **Framework**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: JWT + bcrypt
- **Validation**: Zod + express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

## 📊 Database Schema

### **Users Table**
- id, username, email, password
- profile information, skill levels
- statistics, achievements
- roles, permissions

### **Problems Table**
- id, title, description, difficulty
- language, category, test cases
- points, hints, time limits
- created_by, created_at

### **Submissions Table**
- id, user_id, problem_id, code
- language, status, result
- execution time, memory usage
- attempts, hints_used, points

### **Achievements Table**
- id, user_id, achievement_type
- title, description, badge_url
- unlocked_at, progress

### **Leaderboard Table**
- id, user_id, language, global_rank
- points, win_rate, accuracy
- total_problems, completed_problems
- last_updated

## 🔐 Security Features

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Password hashing
- JWT token security
- Code execution sandboxing

## 🌐 API Endpoints

### **Authentication**
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

### **Users**
- GET /api/users/profile
- PUT /api/users/profile
- GET /api/users/statistics
- GET /api/users/achievements
- GET /api/users/progress

### **Problems**
- GET /api/problems
- GET /api/problems/:id
- POST /api/problems (Admin)
- PUT /api/problems/:id (Admin)
- DELETE /api/problems/:id (Admin)

### **Submissions**
- POST /api/submissions
- GET /api/submissions/:id
- GET /api/submissions/user/:userId
- GET /api/submissions/problem/:problemId

### **Leaderboard**
- GET /api/leaderboard/global
- GET /api/leaderboard/language/:lang
- GET /api/leaderboard/skills/:userId

### **Admin**
- GET /api/admin/dashboard
- GET /api/admin/users
- PUT /api/admin/users/:userId
- GET /api/admin/submissions
- POST /api/admin/problems
- PUT /api/admin/problems/:id
- DELETE /api/admin/problems/:id

## 🐳 Docker Configuration

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: hariscode
      POSTGRES_USER: hariscode
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://hariscode:${DB_PASSWORD}@postgres:5432/hariscode
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: development
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

## 📝 Environment Variables

```env
# Database
DATABASE_URL=postgresql://hariscode:password@localhost:5432/hariscode
DB_HOST=localhost
DB_PORT=5432
DB_USER=hariscode
DB_PASSWORD=password
DB_NAME=hariscode

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Server
PORT=3000
NODE_ENV=development
API_VERSION=v1

# Code Execution
CODE_EXECUTION_TIMEOUT=30000
MAX_MEMORY_USAGE=128000000
MAX_CPU_TIME=5000

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# External Services
JUDGE0_API_KEY=your-judge0-api-key
JUDGE0_BASE_URL=https://api.judge0.com

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Frontend URL
FRONTEND_URL=http://localhost:5173
```