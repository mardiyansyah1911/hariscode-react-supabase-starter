# Backend Structure Document

This document outlines the backend architecture, database design, API endpoints, hosting, infrastructure, security, and maintenance strategy for the “Haris Code” platform. It’s written in everyday language so anyone can follow along.

## 1. Backend Architecture

Overall, the backend is built with Node.js and Express.js, following a clear layered approach:

- **Framework & Patterns**
  - **Express.js** for routing and middleware.
  - **Layered (Service–Controller–Model)** pattern:
    - **Controllers** receive HTTP requests, call services, and return responses.
    - **Services** contain business logic (user management, scoring, sandboxing code execution).
    - **Models/Repositories** use Drizzle ORM to talk to PostgreSQL.
- **Scalability**
  - The backend is **stateless** (no sticky sessions), so you can spin up multiple instances behind a load balancer.
  - Heavy tasks (running user code) are offloaded to a **job queue** or separate “sandbox” service.
- **Maintainability**
  - Clear separation of concerns keeps files organized and tests easy to write.
  - TypeScript + Drizzle ORM ensures type safety from code to database.
- **Performance**
  - Connection pooling to the database.
  - Caching (with Redis) for frequent reads like leaderboards or question lists.

## 2. Database Management

We use **PostgreSQL** for structured, relational data:

- **Type**: Relational (SQL)
- **Hosting**: Local development via Docker Compose; production on a managed cloud database (e.g., AWS RDS or DigitalOcean Managed Database).
- **ORM**: Drizzle ORM
- **Connection Pooling**: Built into the ORM or via a pooler like PgBouncer
- **Migrations**: Version-controlled SQL scripts to evolve the schema safely
- **Backups**: Regular automated snapshots managed by the cloud provider

## 3. Database Schema

Below is a human-readable summary of the main tables. Following that is the actual SQL schema.

Human-readable overview:
- **users**: Stores every user’s email, password hash, username, role (student or admin), and timestamps.
- **questions**: Holds coding challenge metadata (title, description, difficulty, language).
- **test_cases**: Linked to questions; each row is one input/output pair.
- **submissions**: Tracks each user’s submitted code, status (pass/fail), score, and when it was run.
- **leaderboard**: A database **view** that ranks users by total score.

SQL definitions (PostgreSQL):

```sql
-- Users table
drop table if exists users cascade;
create table users (
  id              serial primary key,
  username        varchar(50) not null unique,
  email           varchar(100) not null unique,
  password_hash   varchar(255) not null,
  role            varchar(20) not null default 'student',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Questions table
drop table if exists questions cascade;
create table questions (
  id              serial primary key,
  title           varchar(200) not null,
  description     text not null,
  difficulty      varchar(20) not null,
  language        varchar(20) not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Test cases table
drop table if exists test_cases cascade;
create table test_cases (
  id              serial primary key,
  question_id     integer not null references questions(id) on delete cascade,
  input_data      text not null,
  expected_output text not null,
  created_at      timestamptz not null default now()
);

-- Submissions table
drop table if exists submissions cascade;
create table submissions (
  id              serial primary key,
  user_id         integer not null references users(id) on delete cascade,
  question_id     integer not null references questions(id) on delete cascade,
  code            text not null,
  language        varchar(20) not null,
  status          varchar(10) not null, -- 'pass' or 'fail'
  score           integer not null,
  submitted_at    timestamptz not null default now()
);

-- Leaderboard view
create or replace view leaderboard as
  select u.id as user_id,
         u.username,
         sum(s.score) as total_score,
         rank() over (order by sum(s.score) desc) as position
    from users u
    join submissions s on u.id = s.user_id
   group by u.id, u.username;
```

## 4. API Design and Endpoints

We follow a **RESTful** approach, with clear, predictable URLs and HTTP verbs.

Authentication:
- `POST /api/auth/register` – Create a new user.
- `POST /api/auth/login` – Check credentials, return a JWT.

Users:
- `GET /api/users/:id` – Retrieve user profile and stats (protected).
- `GET /api/users/me` – Shortcut to get the currently logged-in user.

Questions:
- `GET /api/questions` – List all challenges, with optional filters (difficulty, language).
- `GET /api/questions/:id` – Get one challenge, including its test cases.
- `POST /api/questions` – **Admin only**: Create a new question.
- `PUT /api/questions/:id` – **Admin only**: Update a question.
- `DELETE /api/questions/:id` – **Admin only**: Remove a question.

Submissions:
- `POST /api/submissions` – Submit code for a question. Returns pass/fail and score.
- `GET /api/submissions/:id` – View details of one submission (protected).

Leaderboard:
- `GET /api/leaderboard` – Returns ranked list of users by score.

Admin-specific:
- `GET /api/admin/users` – List all users.
- `GET /api/admin/submissions` – View all submissions.

## 5. Hosting Solutions

We recommend a container-based deployment with Docker:

- **Cloud Provider**: AWS (ECS/EKS) or DigitalOcean App Platform
- **Container Registry**: Docker Hub or AWS ECR
- **Database**: Managed PostgreSQL (AWS RDS, DigitalOcean Managed Databases)

Benefits:
- **Reliability**: Managed services offer automatic failover and backups.
- **Scalability**: Easy to add more container instances behind a load balancer.
- **Cost-effectiveness**: Pay for what you use and scale down in off-peak times.

## 6. Infrastructure Components

- **Load Balancer**: Distributes traffic to multiple backend instances (AWS ALB or NGINX).
- **Caching**: Redis for
  - Session storage (if you choose server-side sessions)
  - Caching leaderboard and question lists
- **Message Queue / Job Queue**: Redis or RabbitMQ to offload code execution tasks to sandbox workers
- **CDN**: Cloudflare or AWS CloudFront for static assets (front-end bundle, media)
- **Docker Compose** (development) vs. Kubernetes/ECS (production)

## 7. Security Measures

- **Authentication**: JWT-based tokens stored in secure HTTP-only cookies or local storage.
- **Password Storage**: bcrypt hashing with a strong salt.
- **HTTPS Everywhere**: TLS certificates via Let’s Encrypt or managed provider.
- **Input Validation**: Zod schemas in Express middleware to block invalid data.
- **Rate Limiting**: Prevent brute-force on login and submission endpoints.
- **HTTP Headers**: Helmet to set security headers (CSP, HSTS, XSS protections).
- **CORS**: Restrict origins to known front-end domains.
- **Sandboxing**: Run user-submitted code in an isolated environment (Docker, Judge0).

## 8. Monitoring and Maintenance

- **Logging**: Winston or Pino for structured logs (JSON), shipped to a log management system (e.g., ELK stack).
- **Error Tracking**: Sentry or LogRocket for real-time error alerts.
- **Metrics**: Prometheus + Grafana to monitor CPU, memory, queue lengths, response times.
- **Health Checks**: Endpoints for readiness and liveness probes in Kubernetes/ECS.
- **Backups**: Automated daily snapshots of the database.
- **CI/CD**: GitHub Actions pipeline to run tests, build Docker images, and deploy to staging/production.
- **Dependency Updates**: Dependabot or Renovate to keep modules up-to-date.

## 9. Conclusion and Overall Backend Summary

This backend setup for “Haris Code” is designed to be:

- **Scalable**: Stateless services behind load balancers, managed databases, and job queues.
- **Maintainable**: Clear layered structure, type-safe code, and migration scripts.
- **Performant**: Caching, queuing, connection pooling, and CDN for static assets.
- **Secure**: Best practices in authentication, data validation, and sandboxing untrusted code.

Together, these components form a robust foundation that aligns with the project’s goal of delivering a fast, reliable, and secure coding education platform. If you follow this document, you’ll have a clear roadmap to build, deploy, and operate your backend without ambiguity.