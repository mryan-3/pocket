high-level flow of how the system operates:

1. The Entry Point (app.js)
   Everything starts here. The server initializes global security and utility middlewares:

- Security: helmet for headers, cors for cross-origin access, and cookieParser for handling JWTs securely.
- Observability: Borgen for request logging and compression for performance.
- Routing: It hands off all requests starting with /api to the main router.
- Startup: It connects to MongoDB first; once the connection is established, it starts the HTTP server and triggers the Background Scheduler.

2. The Routing Tree (router/)
   I've implemented a nested routing architecture to ensure the app can scale:

- router.js: The "traffic controller" that mounts versioned routes (e.g., /v1).
- v1/index.js: The "registry" that imports and mounts specialized routers for each feature (Auth, Users, Restaurants, etc.). This makes the codebase extremely easy to navigate.

3. Authentication & Security (middleware/authMiddleware.js)
   Security is built into the request lifecycle:

- The Token System: We use a "Short-lived Access / Long-lived Refresh" pattern. The accessToken (15 mins) is checked on every protected request. If it expires, the client hits the /refresh
  endpoint to exchange a secure refreshToken (7 days) for a new one.
- RBAC (Role-Based Access Control): The authorize('admin') middleware allows us to lock down specific routes (like creating restaurants or viewing system stats) to specific user roles
  effortlessly.

4. Feature Modules (Controllers)
   Each feature follows a Controller-Service-Model logic:

- Auth Module: Handles the complexity of hashing passwords, generating JWTs, and managing secure HttpOnly cookies.
- Restaurant Module: Provides filtered searching (by budget, category, or rating) and full CRUD for admins.
- Decision Engine (rankingEngine.js): This is the "brain." It calculates a 0-100 score for restaurants by weighting their average rating (60%), popularity/feedback count (25%), and price
  affordability (15%).
- Visit & Feedback Loop: When a user schedules a visit, it's marked as upcoming. Once the date passes, the Scheduler flips it to pending_feedback. When the user submits feedback, a Database
  Transaction is used to atomically update the restaurant's average rating and mark the visit as completed.

5. Background Processes (utils/scheduler.js)
   Instead of waiting for user interaction, the server is "proactive." Every hour, a cron job scans the database for past-due visits and automatically generates Notification documents for users,
   prompting them to leave feedback.

6. The "Safety Net" (middleware/errorHandler.js)
   I've centralized error handling. Instead of scattered try/catch blocks sending random responses:

- Any error (validation, database, or unauthorized access) is funneled into a global errorHandler.
- It formats every error into a consistent JSON structure: { success: false, message: "...", errors: [] }. This makes the frontend implementation much smoother because the response shape is
  always predictable.

7. Database & Seeding (database/)
   The models use Mongoose with strictly defined schemas and indexes (especially on priceRange and category) to ensure high-performance queries as the data grows. The seed.js script provides a
   "one-command" setup to get a fully populated environment for development.
