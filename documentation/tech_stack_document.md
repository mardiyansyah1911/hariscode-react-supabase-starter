# Tech Stack Document

This document outlines the technology choices for the **Haris Code** platform, explaining each component in everyday language so that non-technical readers can understand why they were selected and how they work together.

## 1. Frontend Technologies

Our frontend (what the user sees and interacts with) is built to be fast, visually appealing, and easy to expand.

### UI Framework & Build Tool
- **React 18 + Vite**  
  React provides a component-based way to build dynamic user interfaces. Vite is the tool that runs and bundles our code extremely quickly, so developers see changes instantly.

### Styling & Design
- **Tailwind CSS**  
  A utility-first approach to styling that lets us compose designs quickly and consistently without writing custom CSS from scratch.
- **Radix UI & Shadcn UI**  
  Ready-made, accessible components (buttons, dialogs, inputs) that follow best practices for usability and keyboard navigation.

### State Management & Data Fetching
- **TanStack Query (React Query)**  
  Automates data loading, caching, and refreshing. For example, fetching the latest leaderboard or user progress and keeping the interface in sync with the server.

### Form Handling & Validation
- **React Hook Form**  
  Efficiently manages form state (like login or question-creation forms) with minimal re-rendering.
- **Zod**  
  Defines clear rules for form data (e.g., “password must be at least 8 characters”), automatically generating error messages and preventing invalid submissions.

### Routing & Navigation
- **React Router DOM**  
  Handles navigation between pages (login, dashboard, challenges, admin panel) and enforces protected routes so only authorized users can access certain areas.

### Animation & Icons
- **Framer Motion**  
  Adds smooth animations and transitions, improving the feel of interactions (for example, sliding in new challenges or fading messages).
- **Lucide React**  
  A collection of clean, scalable icons for buttons, menus, and status indicators.
- **Sonner**  
  Provides toast notifications (e.g., “Correct Answer! +100 points”) that appear and vanish without interrupting the user.

### Language & Type Safety
- **TypeScript**  
  A strict layer over JavaScript that catches many common errors at development time, making the code more reliable and easier to maintain.

### Internationalization (i18n)
- **i18next**  
  Manages translation strings so the platform can switch between Indonesian and English (or any other language) without rewriting components.

## 2. Backend Technologies

The backend (the server side that handles data and business logic) is designed to be modular, secure, and easy to scale.

- **Node.js + Express.js**  
  A popular JavaScript runtime and framework used to create our REST API endpoints (for user management, challenges, submissions, etc.).
- **PostgreSQL (via Docker Compose)**  
  A reliable, open-source database that stores all platform data—users, questions, scores, and more. Docker Compose makes it easy to spin up a local database for development.
- **Drizzle ORM**  
  A type-safe tool that maps database tables to JavaScript objects, so we write less SQL by hand and catch mistakes early.
- **JWT (JSON Web Tokens)**  
  Securely handles user authentication by issuing tokens on login and verifying them on each request.
- **Secure Code Execution Engine**  
  Integrates with a sandboxed service (for example, Judge0 or a Docker-based solution) to safely run student code against test cases without risking server integrity.

## 3. Infrastructure and Deployment

These choices ensure that the platform is available, scalable, and easy to update.

- **Version Control: Git & GitHub**  
  Tracks every change in the codebase and allows multiple developers to collaborate safely.
- **CI/CD: GitHub Actions**  
  Automates checks and deployments: whenever new code is pushed, tests run automatically, and passing builds can deploy to production without manual steps.
- **Hosting Frontend: Vercel or Netlify**  
  Provides fast, global delivery of the static React app, with built-in support for environment variables and previews of pull requests.
- **Hosting Backend: Docker / Cloud VM / Managed Service**  
  The Express API and PostgreSQL database can run in Docker containers or on a managed cloud service (e.g., AWS, DigitalOcean). This makes scaling easier and isolates dependencies.
- **Environment Configuration**  
  Separate development, staging, and production environments ensure safe testing before rolling out changes to real users.

## 4. Third-Party Integrations

We rely on specialized services to save development time and enhance functionality.

- **Judge0 (or equivalent sandbox)**  
  Runs untrusted student code securely, returning pass/fail results and error details.
- **i18next**  
  Manages multilingual content without duplicating code.
- **Sentry (optional)**  
  Tracks errors in production, alerting the team to crashes or performance issues.

## 5. Security and Performance Considerations

### Security Measures
- HTTPS for all network traffic to encrypt data in transit.
- CORS configuration to restrict which domains can call our API.
- Input validation with Zod and server-side checks to prevent injection attacks.
- JWT tokens stored securely (e.g., HttpOnly cookies) to protect user sessions.
- Sandboxed code execution to prevent malicious code from affecting our servers.

### Performance Optimizations
- **Vite’s Hot Module Replacement** speeds up development by updating only changed files.
- **Code Splitting & Lazy Loading** in React ensures users only download what they need for each page.
- **TanStack Query Caching** reduces duplicate network requests and shows instantaneous data when available.
- **Tailwind PurgeCSS** removes unused CSS in production builds, keeping file sizes small.

## 6. Conclusion and Overall Tech Stack Summary

Haris Code’s technology stack was chosen to deliver a modern, fast, and secure learning platform:

- Frontend: React 18 + Vite, TypeScript, Tailwind CSS, Radix UI/Shadcn UI, TanStack Query, React Hook Form + Zod, Framer Motion, React Router, i18next.
- Backend: Node.js + Express.js, PostgreSQL, Drizzle ORM, JWT authentication, secure code execution sandbox.
- Infrastructure: GitHub/GitHub Actions, Vercel/Netlify, Docker Compose, separate environments for dev/staging/prod.
- Integrations: Judge0 (code runner), Sentry (error tracking), i18next (translations).

This combination ensures rapid development, a polished user experience, robust data handling, and strong security. The result is a scalable, maintainable platform tailored to the needs of both learners and administrators of Haris Code.