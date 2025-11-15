# Project Requirements Document (PRD)

## 1. Project Overview
**Haris Code** is an interactive coding education platform designed to help students learn programming by solving real-world coding challenges. This project uses the `hariscode-react-supabase-starter` as a modern, type-safe front-end boilerplate so we can focus on building core learning features—coding challenges, progress tracking, leaderboards and an admin panel—instead of reinventing the UI and state-management wheel.

The primary goal is to accelerate development of the full-stack “Haris Code” platform. By leveraging React 18, Vite, TypeScript, Tailwind CSS, Radix UI/Shadcn UI components and TanStack Query for server state, we ensure a fast, accessible, and scalable user experience. Success will be measured by delivering a fully functional v1 with user registration, challenge submission workflows, progress dashboards, a basic leaderboard and an administrative interface for managing problems.

## 2. In-Scope vs. Out-of-Scope

### In-Scope (v1)
- Frontend foundation using React 18 + Vite + TypeScript.  
- Authentication (email/password) with JWT-based sessions.  
- User flows: registration, login, password reset.  
- User dashboard showing progress, completed challenges, and recommended problems.  
- Coding challenge listing by level and language.  
- Integrated code editor component (e.g., CodeMirror) for writing solutions.  
- Submission pipeline: POST solution → secure sandbox execution → pass/fail result.  
- Real-time or near-real-time leaderboard (global + by category).  
- User profile page with stats and submission history.  
- Admin panel for CRUD operations on challenges (title, description, test cases, difficulty).  
- Notifications via toast messages (submission feedback, errors).  
- Basic internationalization (English/Indonesian).  
- Responsive, accessible UI (WCAG 2.1 standards).

### Out-of-Scope (v1)
- Social logins (OAuth with Google/GitHub).  
- Mobile-native or React Native app.  
- Peer-to-peer chat or discussion forum.  
- Gamification beyond points/leaderboard (badges, streaks).  
- Analytics dashboard or BI reporting.  
- Third-party integrations (Slack, Discord).  
- Advanced code languages support beyond initial set (e.g., Python, JavaScript only to start).  
- AI-driven hints or auto-grader explanations.

## 3. User Flow

**Learner Journey:** A new learner visits the site, signs up with email and password, and is directed to their personal dashboard. The dashboard displays their current level, number of solved challenges, and recommendations. They click “Start Challenge,” pick a difficulty or language, and land on the challenge page. Here they see the problem statement, test case details, and a built-in code editor. After writing code, they click "Submit". The front-end sends the code to the backend, which runs it in a secure sandbox. Within seconds, the result (pass/fail) and any error messages appear in a toast notification and on the page. Their progress metrics and the global leaderboard update automatically.

**Admin Journey:** An admin logs in via the same authentication flow but gains access to an “Admin Panel” link. They land on a form-driven interface where they can create new coding problems by filling in a title, description, input/output samples, test cases (JSON array), difficulty level, and programming language tags. Upon saving, the new challenge becomes available to learners. Admins can also edit or delete existing problems and review recent submissions in a tabular view.

## 4. Core Features

- **Authentication & Authorization**  
  • Email/password sign-up, login, logout, password reset  
  • JWT-based session management, route protection  
- **User Dashboard**  
  • Progress overview (completed vs. remaining)  
  • Recommended challenges by skill level  
- **Challenge Explorer**  
  • Filter by difficulty, programming language  
  • Pagination or infinite scroll for challenge lists  
- **Code Editor & Submission**  
  • Embedded code editor with syntax highlighting  
  • Submit button triggers secure sandbox execution  
  • Display pass/fail results and execution logs  
- **Leaderboard**  
  • Global and category-specific rankings  
  • Live updates when users solve challenges  
- **User Profile**  
  • Detailed stats (total points, average submission time)  
  • History of past submissions  
- **Admin Panel**  
  • CRUD interface for challenges with type-safe form validation  
  • Submission log view with filtering  
- **Notifications**  
  • Toasts for success, errors, real-time updates  
- **Internationalization (i18n)**  
  • Switch between English and Indonesian  
- **Responsive & Accessible UI**  
  • WCAG 2.1 AA compliance, mobile-friendly layouts

## 5. Tech Stack & Tools

**Frontend**  
- React 18 + Vite (fast development & build)  
- TypeScript (type safety)  
- Tailwind CSS (utility-first styling)  
- Radix UI & Shadcn UI (accessible components)  
- Framer Motion (animations)  
- Lucide React (icon library)  
- Sonner (toast notifications)  
- React Router DOM (client-side routing)  
- React Hook Form + Zod (form state & validation)  
- TanStack Query (server-state caching, queries/mutations)  
- i18next (internationalization)

**Backend**  
- Node.js (LTS) + Express.js (REST API)  
- JSON Web Tokens (JWT) for auth  
- PostgreSQL (data storage) via Docker Compose  
- Drizzle ORM (type-safe database modeling)  
- Secure code execution engine (Judge0 API or custom Docker sandbox)  
- CORS, Helmet, and rate-limiting middleware for security

**Dev & QA Tools**  
- Docker & Docker Compose (dev environment)  
- Vitest + React Testing Library (unit/integration tests)  
- Cypress or Playwright (E2E testing)  
- ESLint, Prettier (code style)  
- GitHub Actions (CI/CD)

## 6. Non-Functional Requirements

- **Performance:** Page load ≤ 200ms on 3G; API response time ≤ 150ms under typical load.  
- **Scalability:** Support 1,000 concurrent users in v1; horizontal scaling for the backend.  
- **Security:** HTTPS-only; OWASP Top 10 mitigation; input sanitization; JWT expiration and refresh.  
- **Accessibility:** WCAG 2.1 AA compliance; keyboard-navigable; ARIA attributes.  
- **Reliability:** 99.9% uptime goal; automated backups of the PostgreSQL database.  
- **Usability:** Responsive on mobile, tablet, desktop; intuitive navigation; clear error messages.

## 7. Constraints & Assumptions

- **Assumptions:**  
  • Learners use modern evergreen browsers (Chrome, Firefox, Safari).  
  • Developers have Docker installed for local environment.  
  • A secure sandbox or third-party code execution API (e.g., Judge0) will be available.  
  • PostgreSQL runs locally via Docker Compose in dev; production DB credentials supplied separately.

- **Constraints:**  
  • Initial language support limited to JavaScript/TypeScript.  
  • No real-time sockets (WebSocket) in v1—leaderboard updates via polling or query invalidation.  
  • Admin panel and learner UI share the same codebase and authentication service.

## 8. Known Issues & Potential Pitfalls

- **Sandbox Complexity:** Building a secure, isolated code execution environment is challenging.  
  *Mitigation:* Integrate a proven third-party API (Judge0) in v1, then refactor to a custom Docker sandbox later.

- **API Rate Limits:** Third-party code runner services often have rate limits.  
  *Mitigation:* Implement exponential backoff and local caching of results where applicable.

- **CORS & Security Headers:** Misconfiguration can block requests or open vulnerabilities.  
  *Mitigation:* Use Express middleware (Helmet, CORS) with strict policies; test in staging.

- **Type Mismatches:** Frontend and backend data models can drift over time.  
  *Mitigation:* Maintain a shared TypeScript schema (e.g., via a `shared-types` package) and CI checks.

- **i18n Edge Cases:** Missing translation strings can cause untranslated UI elements.  
  *Mitigation:* Enforce keys-check in CI; fallback to default language gracefully.

---
This PRD establishes a clear scope, user journeys, core features, and technology choices for the **Haris Code** platform’s first release. With these requirements, subsequent technical documents—architecture overviews, file structures, API specs—can be generated without ambiguity.