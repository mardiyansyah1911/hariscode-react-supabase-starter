# Security Guidelines for hariscode-react-supabase-starter

This document provides a comprehensive set of security controls and best practices tailored to the `hariscode-react-supabase-starter` repository and your planned Node.js/Express/Drizzle/PostgreSQL backend for the **Haris Code** platform. Apply these guidelines throughout design, development, testing, and deployment.

---

## 1. Authentication & Access Control

- Enforce strong password policies:
  - Minimum length 12 characters, require uppercase/lowercase letters, numbers, symbols.
  - Hash passwords with Argon2 or bcrypt using a unique salt per user.
  - Enforce password rotation or re-verification for critical actions.
- Implement JWT-based authentication:
  - Use a secure signing algorithm (RS256 or HS256 with a strong secret).
  - Validate `exp`, `iat`, and `aud` claims server-side.
  - Store secrets in a vault (e.g., AWS Secrets Manager, HashiCorp Vault), never in code or `.env` files.
- Session management:
  - If using cookies, set `HttpOnly`, `Secure`, and `SameSite=Strict` attributes.
  - Enforce idle and absolute timeouts; provide logout endpoint that invalidates tokens or blacklists them.
  - Protect against session fixation by rotating session identifiers on login.
- Role-Based Access Control (RBAC):
  - Define roles (`student`, `admin`, `superadmin`) and associated permissions.
  - Perform server-side authorization checks for every endpoint.
  - Use middleware (e.g., Express.js middleware) to validate roles before business logic.
- Multi-Factor Authentication (MFA):
  - Offer optional TOTP or SMS-based second factor for administrative accounts.

---

## 2. Input Handling & Processing

- **Server-Side Validation**:
  - Use Zod both client- and server-side to validate all incoming JSON payloads, query parameters, and headers.
- **Prevent Injection Attacks**:
  - Use Drizzle ORM’s parameterized queries—never string-concatenate SQL.
  - Sanitize or escape any dynamic SQL fragments.
- **Cross-Site Scripting (XSS) Mitigation**:
  - React by default escapes content; avoid using `dangerouslySetInnerHTML`.
  - Implement a strict Content Security Policy (CSP) to restrict allowable script sources.
- **Prevent CSRF**:
  - If you rely on cookies for authentication, integrate anti-CSRF tokens (synchronizer-token pattern) or use the `double submit cookie` pattern.
- **Secure File Uploads** (if applicable):
  - Validate file type, size, and content by magic numbers.
  - Store outside the webroot or in a separate object storage bucket with least-privilege IAM.
  - Sanitize file names to prevent path traversal.

---

## 3. Data Protection & Privacy

- **Encryption in Transit & At Rest**:
  - Enforce HTTPS/TLS 1.2+ for all client–server and interservice communication.
  - Ensure your PostgreSQL instance uses SSL.
  - Enable full-disk encryption or database-level encryption for sensitive tables.
- **Secrets Management**:
  - Store API keys, database credentials, and JWT secrets in a secure vault.
  - Rotate secrets on a regular schedule.
- **Logging & Monitoring**:
  - Redact or mask PII in logs (emails, code submissions).
  - Do not log JWTs, passwords, or stack traces in production.
- **Data Retention & Deletion**:
  - Implement GDPR/CCPA-compliant mechanisms to delete or anonymize user data on request.

---

## 4. API & Service Security

- **HTTPS Only**:
  - Redirect HTTP → HTTPS at the load balancer or web server.
- **Rate Limiting & Throttling**:
  - Use `express-rate-limit` or an API gateway to throttle requests by IP or user.
- **CORS Policy**:
  - Restrict origins to your production and staging domains only.
  - Set `Access-Control-Allow-Credentials` only if cookies are needed.
- **API Versioning**:
  - Prefix routes with `/api/v1/` to allow safe evolution.
- **Least Privilege on Endpoints**:
  - Return only necessary fields in API responses (avoid exposing internal IDs or SQL errors).

---

## 5. Web Application Security Hygiene

- **Security Headers** (use `helmet` middleware):
  - `Content-Security-Policy`: restrict scripts/styles/images.
  - `Strict-Transport-Security`: `max-age=31536000; includeSubDomains; preload`.
  - `X-Frame-Options`: `DENY` to prevent clickjacking.
  - `X-Content-Type-Options`: `nosniff`.
  - `Referrer-Policy`: `no-referrer-when-downgrade` or stricter.
- **Cookie Security**:
  - Set cookies with `HttpOnly`, `Secure`, `SameSite=Strict`.
- **Subresource Integrity (SRI)**:
  - If loading any third-party scripts/styles from a CDN, include integrity hashes.

---

## 6. Infrastructure & Configuration Management

- **Container Hardening**:
  - Base Docker images on minimal, up-to-date distributions (e.g., `node:18-alpine`).
  - Run processes as non-root users inside containers.
- **Network Security**:
  - Expose only necessary ports (`80/443` on the frontend proxy, `5432` only to the backend container).
  - Use internal Docker networks; do not publish the database port publicly.
- **TLS Termination**:
  - Terminate TLS at a reverse proxy or load balancer (e.g., Nginx, Traefik) with secure cipher suites.
- **Disable Debug in Production**:
  - Ensure `NODE_ENV=production` and disable verbose logging and stack traces.
- **Automated Hardening & Patching**:
  - Scan images for CVEs with tools like Clair or Trivy.
  - Schedule regular OS and dependency updates.

---

## 7. Dependency Management

- **Use Lockfiles**:
  - Commit `package-lock.json` or `yarn.lock` for deterministic installs.
- **Vulnerability Scanning**:
  - Integrate `npm audit`, Snyk, or GitHub Dependabot in CI pipelines.
- **Minimize Footprint**:
  - Audit and remove unused dependencies.
- **Pinned Versions**:
  - Avoid loose semver ranges; pin to exact or caret ranges with known-secure versions.

---

By following these guidelines, you will ensure that **Haris Code** is secure by design, resilient to common web threats, and compliant with data protection standards. Regularly review and update these controls as your platform evolves.