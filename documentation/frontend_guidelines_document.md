# Frontend Guideline Document

This document explains the frontend setup for the **Haris Code** learning platform, built on the `hariscode-react-supabase-starter` template. It covers architecture, design principles, styling, component organization, state management, routing, performance, testing, and more. Use this as a reference to understand and extend the frontend without any gaps.

## 1. Frontend Architecture

**Frameworks and Libraries**
- **React 18**: Core UI library for building components.
- **Vite**: Development server and build tool for fast reloads and optimized production bundles.
- **TypeScript**: Adds type safety across the entire codebase.
- **Tailwind CSS**: Utility-first styling framework.
- **Radix UI & Shadcn UI**: Accessible, pre-built components (buttons, dialogs, inputs).
- **Framer Motion**: Smooth animations and transitions.
- **Lucide React & Sonner**: Iconography and toast notifications.
- **TanStack Query (React Query)**: Data fetching, caching, and server-state management.
- **React Hook Form + Zod**: Form building and validation with type safety.

**Scalability, Maintainability, Performance**
- **Modular setup**: Feature-driven folders let you add new capabilities without clutter.
- **Type-safe APIs**: TypeScript and Zod reduce runtime errors and speed refactors.
- **Utility-first CSS**: Tailwind minimizes custom CSS and makes design consistent.
- **Client-heavy rendering**: Offloads UI work to the browser, making interactions snappy.
- **Caching and queries**: TanStack Query minimizes redundant network calls and handles stale data automatically.

## 2. Design Principles

**Usability**
- **Clear feedback**: Buttons, forms, and toasts guide users through actions like submitting code or saving settings.
- **Intuitive layouts**: Consistent spacing, alignment, and labeling across pages.

**Accessibility**
- **ARIA attributes**: Provided by Radix UI for dialogs, tooltips, and form controls.
- **Keyboard navigation**: Focus traps in modals, skip links, and logical tab order.
- **Color contrast**: Meets WCAG AA standards for text and interface elements.

**Responsiveness**
- **Mobile-first**: Tailwind’s responsive utilities ensure layouts adapt from phones to desktops.
- **Fluid grids**: Components expand or contract based on screen size.

These principles are applied to every page and component. For example, challenge screens resize gracefully, and leaderboards remain readable on small screens.

## 3. Styling and Theming

**Styling Approach**
- **Tailwind CSS**: Utility classes (e.g., `px-4`, `text-gray-900`, `bg-blue-500`) handle most styling.
- **No BEM/SMACSS**: We rely on Tailwind’s consistency rather than custom naming conventions.
- **PostCSS**: Built into Vite for processing Tailwind directives.

**Theming**
- **Light & Dark modes**: Configured in `tailwind.config.js` under `darkMode: 'class'`.
- **Theme toggler**: A simple React Context switches the `className` on `<html>` to `dark` or `light`.

**Visual Style**
- **Core style**: Modern, flat design with subtle glassmorphism on cards and modals (semi-transparent backgrounds with soft blur).
- **Animations**: Framer Motion adds smooth hover effects and page transitions.

**Color Palette**
- **Primary**: #1D4ED8 (Blue-700)
- **Primary Light**: #3B82F6 (Blue-500)
- **Secondary**: #10B981 (Emerald-500)
- **Accent**: #F59E0B (Amber-500)
- **Background**: #F3F4F6 (Gray-100)
- **Surface**: #FFFFFF (White)
- **Text Primary**: #111827 (Gray-900)
- **Text Secondary**: #6B7280 (Gray-500)
- **Error**: #EF4444 (Red-500)
- **Success**: #10B981 (Emerald-500)

**Font**
- **Inter**: Main font for a clean, modern look. Imported via Google Fonts or a local asset.

## 4. Component Structure

**Folder Organization**
```
src/
 ├─ features/        # Major functionality (auth, challenges, dashboard, admin, etc.)
 │    ├─ auth/
 │    ├─ challenges/
 │    ├─ dashboard/
 │    └─ admin/
 ├─ components/      # Shared UI pieces (cards, layouts)
 ├─ hooks/           # Custom hooks (useUser, useChallenge)
 ├─ lib/             # Utilities (api-client, cn)
 └─ App.tsx          # Entry point with routes
```

**Component Reuse**
- Build small, focused components (e.g., `Button`, `Dialog`, `Table`).
- Compose larger screens by combining these primitives.
- Passing props for customization rather than copy-pasting code.

**Benefits**
- **Maintainability**: Fix or update a single component affects all its uses.
- **Consistency**: Shared components follow the same style and behavior.
- **Onboarding**: New developers understand patterns quickly.

## 5. State Management

**Server State**
- **TanStack Query** handles fetching, caching, and updating data from the backend.
- Use `useQuery` for read operations (e.g., fetching questions, user stats).
- Use `useMutation` for writes (e.g., submitting a solution, updating profiles).
- Invalidate and refetch queries on successful mutations for fresh data.

**Client/UI State**
- **React Context** for global UI settings (theme, language).
- **Zustand** (optional) for more complex client-only state (e.g., code editor settings).

**Pattern**
- Encapsulate logic in custom hooks (`useLeaderboard`, `useSubmitSolution`) that wrap TanStack Query.
- Avoid prop-drilling by exposing context providers at the root.

## 6. Routing and Navigation

**Library**
- **react-router-dom** for declarative routing.

**Structure**
```jsx
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
    <Route path="/challenges/:id" element={<ChallengePage />} />
    <Route path="/leaderboard" element={<Leaderboard />} />
    <Route path="/profile/:userId" element={<Profile />} />
    <Route path="/admin/*" element={<AdminLayout />} />
  </Routes>
</BrowserRouter>
```
- **Protected Routes**: HOC or wrapper redirects unauthenticated users.
- **Nested Layouts**: Shared headers/sidebars for dashboard vs. admin panel.

**Navigation**
- Side menu or top nav linking to main sections.
- Breadcrumbs or progress indicators for multi-step flows in the Admin Panel.

## 7. Performance Optimization

**Build-time**
- **Vite**: Fast cold starts and production builds.
- **Tree-shaking**: Removes unused code automatically.

**Runtime**
- **Code Splitting & Lazy Loading**: Dynamic `import()` for rarely used routes (e.g., Admin Panel).
- **Image Optimization**: Serve compressed, appropriately sized assets.
- **Pre-fetching**: Use TanStack Query’s `prefetchQuery` for likely-next pages.
- **Memoization**: `React.memo` and `useMemo` for expensive calculations or pure components.

## 8. Testing and Quality Assurance

**Unit Tests**
- **Vitest**: Fast test runner integrated with Vite.
- **React Testing Library**: Render components and assert user-facing behavior.

**Integration Tests**
- Test hooks and utility functions (e.g., Zod schemas, API client).
- Mock TanStack Query and verify loading/error/success states.

**End-to-End Tests**
- **Cypress** or **Playwright**: Automate key user flows (login, challenge submission, admin question creation).

**Linting & Formatting**
- **ESLint** with TypeScript rules and plugin for React.
- **Prettier** for consistent code style.
- **Git Hooks**: `husky` to run lint and tests before commits.

## 9. Conclusion and Overall Frontend Summary

This guideline outlines a solid, scalable frontend for **Haris Code**. By leveraging React 18, TypeScript, Vite, Tailwind CSS, Radix UI, and TanStack Query, you get a high-performance, maintainable codebase with a modern, accessible UI. Feature-driven folders, shared components, and clear patterns for state and routing ensure that new features—like the Admin Panel or a secure code sandbox—can be added with minimal friction. Testing tools and performance strategies keep your app reliable and fast.

Unique strengths include:
- A turnkey UI component library with accessibility baked in.
- Robust server-state management via TanStack Query.
- Type-safe forms with React Hook Form and Zod.
- Utility-first styling that stays consistent across the entire app.

With these guidelines, any developer—technical or not—can understand the architecture, contribute features, and maintain a consistent user experience throughout the **Haris Code** platform.