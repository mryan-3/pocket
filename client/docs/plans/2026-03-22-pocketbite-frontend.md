# PocketBite Frontend Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a modern, functional, and visually striking frontend for PocketBite that connects to the existing Node.js/Express backend.

**Architecture:** Next.js 16 (App Router) with React 19. Clean separation of UI components, feature-specific logic, and API interactions. Axios for HTTP with interceptors for JWT cookie management.

**Tech Stack:** Next.js, React, Tailwind CSS 4, Axios, TanStack Query, React Hook Form, Zod, @phosphor-icons/react.

---

## Phase 1: Foundation & Setup

### Task 1: Basic Dependencies & Configuration
**Files:**
- Modify: `client/package.json`
- Create: `client/lib/utils.ts`
- Create: `client/lib/api-client.ts`
- Create: `client/components/providers/query-provider.tsx`

**Step 1: Install base dependencies**
Run: `pnpm add axios @tanstack/react-query @phosphor-icons/react clsx tailwind-merge zod react-hook-form @hookform/resolvers`

**Step 2: Create utility functions**
Create `client/lib/utils.ts` with `cn` helper.

**Step 3: Setup Axios Client**
Create `client/lib/api-client.ts` with baseURL `/api/v1` and `withCredentials: true`.

**Step 4: Setup TanStack Query Provider**
Create `client/components/providers/query-provider.tsx` to wrap the app.

**Step 5: Commit**
```bash
git add client/package.json client/lib client/components/providers
git commit -m "chore: setup base dependencies, api client, and tanstack query"
```

### Task 2: Design System & Layout
**Files:**
- Modify: `client/app/globals.css`
- Modify: `client/app/layout.tsx`
- Create: `client/components/layout/navbar.tsx`

**Step 1: Update globals.css with Outfit font and theme**
Add Google Font import for 'Outfit'. Set primary colors (avoiding purple). Use a warm orange/amber for 'bite' theme.

**Step 2: Create Navbar**
Minimalist navbar with logo and auth links.

**Step 3: Update Root Layout**
Apply font-family and include Navbar.

**Step 4: Commit**
```bash
git add client/app/globals.css client/app/layout.tsx client/components/layout/navbar.tsx
git commit -m "feat: design system and basic layout"
```

---

## Phase 2: Authentication

### Task 3: Auth Hook & State
**Files:**
- Create: `client/hooks/use-auth.ts`
- Create: `client/components/providers/auth-provider.tsx`

**Step 1: Implement AuthProvider**
Manage user state, login/logout functions.

**Step 2: Implement useAuth hook**
Export context.

**Step 3: Commit**
```bash
git add client/hooks/use-auth.ts client/components/providers/auth-provider.tsx
git commit -m "feat: auth provider and hook"
```

### Task 4: Login & Register Pages
**Files:**
- Create: `client/app/login/page.tsx`
- Create: `client/app/register/page.tsx`
- Create: `client/components/auth/auth-form.tsx`

**Step 1: Create reusable AuthForm**
Support both login and register modes.

**Step 2: Implement Pages**
Connect forms to `useAuth`.

**Step 3: Commit**
```bash
git add client/app/login/page.tsx client/app/register/page.tsx client/components/auth/auth-form.tsx
git commit -m "feat: login and register pages"
```

---

## Phase 3: Core Features

### Task 5: Landing Page
**Files:**
- Modify: `client/app/page.tsx`
- Create: `client/components/landing/hero.tsx`

**Step 1: Build Hero Section**
Catchy headline, "Find your next bite" search bar.

**Step 2: Build Feature Grid**
Showcase Recommendation Engine, Scheduling, and Feedback.

**Step 3: Commit**
```bash
git add client/app/page.tsx client/components/landing
git commit -m "feat: landing page hero and features"
```

### Task 6: Restaurant Discovery
**Files:**
- Create: `client/app/restaurants/page.tsx`
- Create: `client/components/restaurants/restaurant-card.tsx`
- Create: `client/components/restaurants/filter-bar.tsx`

**Step 1: Create RestaurantCard**
High-quality image placeholder, rating, budget, category.

**Step 2: Implement FilterBar**
Budget range, categories, sorting.

**Step 3: Implement Restaurants List Page**
Fetch from `/api/v1/restaurants`.

**Step 4: Commit**
```bash
git add client/app/restaurants/page.tsx client/components/restaurants
git commit -m "feat: restaurant discovery page"
```

### Task 7: Restaurant Detail & Scheduling
**Files:**
- Create: `client/app/restaurants/[id]/page.tsx`
- Create: `client/components/visits/schedule-dialog.tsx`

**Step 1: Detail Page Layout**
Menu items, location, aggregate rating.

**Step 2: Schedule Visit Dialog**
DatePicker and notes.

**Step 3: Commit**
```bash
git add client/app/restaurants/[id]/page.tsx client/components/visits
git commit -m "feat: restaurant details and scheduling"
```

---

## Phase 4: User Dashboard & Feedback

### Task 8: User Dashboard
**Files:**
- Create: `client/app/dashboard/page.tsx`
- Create: `client/components/dashboard/visit-list.tsx`

**Step 1: Build Profile Summary**
Preferences display.

**Step 2: Build Visit List**
Grouped by 'Upcoming' and 'Pending Feedback'.

**Step 3: Commit**
```bash
git add client/app/dashboard/page.tsx client/components/dashboard
git commit -m "feat: user dashboard"
```

### Task 9: Feedback Submission
**Files:**
- Create: `client/components/feedback/feedback-form.tsx`

**Step 1: Build FeedbackForm**
Star rating and comment.

**Step 2: Integrate into Dashboard**
Trigger from 'Pending Feedback' visits.

**Step 3: Commit**
```bash
git add client/components/feedback
git commit -m "feat: feedback submission"
```
