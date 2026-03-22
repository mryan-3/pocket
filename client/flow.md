# PocketBite — Frontend High-Level Flow

This document explains the architecture and operational flow of the Next.js frontend.

## 1. The Entry Point (`src/app/layout.tsx`)
The root layout serves as the global wrapper. It initializes:
- **Design System**: Loads the 'Outfit' font and applies the Amber-themed `globals.css`.
- **QueryProvider**: Wraps the app in TanStack Query for efficient server-state management.
- **AuthProvider**: Manages the persistent user session, checking `/auth/me` on mount to sync with the backend JWT cookies.
- **Navbar**: A sticky, responsive header that dynamically adjusts based on `isAuthenticated` status.

## 2. Authentication System (`src/hooks/use-auth.ts`)
We use a centralized authentication pattern:
- **State Management**: The `AuthProvider` stores the `user` object and `isAuthenticated` boolean.
- **Secure Requests**: The `api-client.ts` (Axios) is configured with `withCredentials: true`, allowing it to automatically send and receive HttpOnly JWT cookies.
- **Protected Routes**: Pages like `/dashboard` use a `useEffect` hook with `useAuth` to redirect unauthenticated users back to `/login`.

## 3. Data Fetching Strategy (TanStack Query)
Instead of standard `useEffect` fetching, we use TanStack Query hooks across all features:
- **Caching**: Data is cached globally; for example, fetching a restaurant's details once makes it instantly available without re-fetching if the user navigates back.
- **Declarative Loading**: Components like `RestaurantList` react to `isLoading` and `error` states provided by the query hooks, ensuring a smooth UX with themed Spinners.
- **Mutations**: Actions like "Schedule Visit" or "Submit Feedback" use `useMutation`. On success, they automatically "invalidate" relevant queries (e.g., `['visits']`), forcing a background refresh so the UI stays in sync without a page reload.

## 4. Discovery Engine (`src/app/restaurants/page.tsx`)
The exploration flow is optimized for performance:
- **Debounced Search**: As you type in the `FilterBar`, the search is debounced by 500ms before triggering a TanStack Query fetch, preventing API spam.
- **URL Synchronization**: Filters (Category, Budget, Sort) are managed via React state and passed to the API as query parameters.


## 5. Feedback Loop
1. User schedules a visit via `ScheduleDialog`.
2. Backend marks it as `upcoming`.
3. Once the date passes (simulated or real), the dashboard moves it to "Pending Feedback."
4. User clicks "Leave Feedback," opening the `FeedbackDialog` which uses a custom star-rating component.
5. Submission triggers an atomic update on the backend, recalculating the restaurant's rating, which then reflects instantly on the frontend discovery page.
