# PocketBite — Backend Build Plan

> Stack: Node.js · Express · MongoDB (Mongoose) · JWT Auth
> Use this file as a prompt context when working with an AI tool. Each phase is self-contained and can be handed to you as a task.

---

## Phase 1 — Auth Module

**Goal:** Register, login, logout, and token refresh. JWT in HttpOnly cookies. Role-based access (user / admin / guest).

### Files used

- `middleware/authMiddleware.js` — `authenticate` and `authorize`
- `controllers/authController.js`
- `router/v1/authRouter.js`

### Endpoints

| Method | Route                   | Access | Description                                     |
| ------ | ----------------------- | ------ | ----------------------------------------------- |
| POST   | `/api/v1/auth/register` | Public | Register new user (name, email, password)       |
| POST   | `/api/v1/auth/login`    | Public | Login → set accessToken + refreshToken cookies  |
| POST   | `/api/v1/auth/logout`   | Auth   | Clear cookies, invalidate refreshToken          |
| POST   | `/api/v1/auth/refresh`  | Public | Use refreshToken cookie → issue new accessToken |
| GET    | `/api/v1/auth/me`       | Auth   | Return current user profile                     |

### Notes for AI prompt

- Access token: short-lived (15min), stored in HttpOnly cookie
- Refresh token: long-lived (7d), hashed and stored in User doc, HttpOnly cookie
- On login, save hashed refresh token to `user.refreshToken`
- On refresh, compare token → issue new access token
- On logout, clear `user.refreshToken` in DB

---

## Phase 2 — User Profile Module

**Goal:** Users can view and update their profile and preferences.

### Files to create

- `controllers/userController.js`
- `router/userRouter.js`

### Endpoints

| Method | Route                | Access | Description                                                         |
| ------ | -------------------- | ------ | ------------------------------------------------------------------- |
| GET    | `/api/v1/users/profile` | Auth   | Get own profile                                                     |
| PUT    | `/api/v1/users/profile` | Auth   | Update name, preferences (budgetMin, budgetMax, favoriteCategories) |
| GET    | `/api/v1/users/history` | Auth   | Get user's feedback history                                         |
| GET    | `/api/v1/users/visits`  | Auth   | Get all scheduled visits for logged-in user                         |

### Notes for AI prompt

- `PUT /profile` should only allow safe fields (name, preferences) — never role or password via this route
- History = all Feedback docs where `user === req.user._id`, populated with restaurant name

---

## Phase 3 — Restaurant Module

**Goal:** CRUD for restaurants (admin only for write). Public read with filtering.

### Files to create

- `controllers/restaurantController.js`
- `router/restaurantRouter.js`

### Endpoints

| Method | Route                               | Access | Description                          |
| ------ | ----------------------------------- | ------ | ------------------------------------ |
| GET    | `/api/v1/restaurants`                  | Public | List restaurants with filters        |
| GET    | `/api/v1/restaurants/:id`              | Public | Get single restaurant with full menu |
| POST   | `/api/v1/restaurants`                  | Admin  | Create restaurant                    |
| PUT    | `/api/v1/restaurants/:id`              | Admin  | Update restaurant                    |
| DELETE | `/api/v1/restaurants/:id`              | Admin  | Soft delete (set `isActive: false`)  |
| POST   | `/api/v1/restaurants/:id/menu`         | Admin  | Add menu item                        |
| PUT    | `/api/v1/restaurants/:id/menu/:itemId` | Admin  | Update menu item                     |
| DELETE | `/api/v1/restaurants/:id/menu/:itemId` | Admin  | Remove menu item                     |

### Query Params for GET `/api/v1/restaurants`

```
?category=local         # filter by category
?budgetMin=200          # priceRange.min >= budgetMin
?budgetMax=800          # priceRange.max <= budgetMax
?sortBy=rating          # options: rating | priceAsc | priceDesc
?page=1&limit=10        # pagination
?search=mama            # text search on name
```

### Notes for AI prompt

- Filter logic: `priceRange.min >= budgetMin && priceRange.max <= budgetMax`
- Always filter `isActive: true` for public routes
- Pagination: use `.skip()` and `.limit()` with a `totalCount` in response
- Response shape: `{ data: [...], total, page, limit }`

---

## Phase 4 — Decision Support Engine

**Goal:** The core recommendation logic. Takes user inputs and returns ranked restaurants.

### Files to create

- `controllers/recommendationController.js`
- `router/recommendationRouter.js`
- `utils/rankingEngine.js` — scoring logic lives here (not in controller)

### Endpoints

| Method | Route                  | Access | Description                |
| ------ | ---------------------- | ------ | -------------------------- |
| POST   | `/api/v1/recommendations` | Public | Get ranked restaurant list |

### Request Body

```json
{
  "budgetMin": 200,
  "budgetMax": 800,
  "category": "local",
  "sortBy": "rating" // "rating" | "priceAsc" | "priceDesc" | "popularity"
}
```

### Ranking Logic (in `utils/rankingEngine.js`)

```js
// Score each restaurant 0-100
score =
  (rating.average / 5) * 60 + // 60% weight on rating
  (feedbackCount / maxCount) * 25 + // 25% weight on popularity
  affordabilityBonus * 15 // 15% weight — lower price = higher bonus
```

### Notes for AI prompt

- This is essentially a smarter version of the restaurant filter — build it as a separate route so the logic can evolve independently
- Return top 10 by default, include a `score` field in each result
- Guest users can access this — no auth required

---

## Phase 5 — Scheduled Visits Module

**Goal:** Users schedule a visit to a restaurant. System tracks status.

### Files to create

- `controllers/visitController.js`
- `router/visitRouter.js`

### Endpoints

| Method | Route                    | Access | Description                            |
| ------ | ------------------------ | ------ | -------------------------------------- |
| POST   | `/api/v1/visits`            | Auth   | Schedule a visit                       |
| GET    | `/api/v1/visits`            | Auth   | List own visits (filterable by status) |
| GET    | `/api/v1/visits/:id`        | Auth   | Get single visit                       |
| PATCH  | `/api/v1/visits/:id/cancel` | Auth   | Cancel a visit                         |

### Request Body for POST

```json
{
  "restaurantId": "...",
  "visitDate": "2025-08-15T13:00:00.000Z",
  "notes": "Anniversary dinner"
}
```

### Notes for AI prompt

- On creation, status defaults to `upcoming`
- A cron job (Phase 7) will flip status to `pending_feedback` after `visitDate` passes
- Users can only cancel their own visits (check `visit.user === req.user._id`)

---

## Phase 6 — Feedback Module

**Goal:** Post-visit feedback collection. Linked to a visit or standalone.

### Files to create

- `controllers/feedbackController.js`
- `router/feedbackRouter.js`

### Endpoints

| Method | Route                                    | Access | Description                           |
| ------ | ---------------------------------------- | ------ | ------------------------------------- |
| POST   | `/api/v1/feedback`                          | Auth   | Submit feedback                       |
| GET    | `/api/v1/feedback/restaurant/:restaurantId` | Public | Get all feedback for a restaurant     |
| GET    | `/api/v1/feedback/me`                       | Auth   | Get logged-in user's feedback history |
| DELETE | `/api/v1/feedback/:id`                      | Auth   | Delete own feedback                   |

### Request Body for POST

```json
{
  "restaurantId": "...",
  "scheduledVisitId": "...", // optional
  "rating": 4,
  "comment": "Great ugali, fair price",
  "tags": ["affordable", "good portions"]
}
```

### Post-Submit Side Effects (in controller)

1. Recalculate `restaurant.rating.average` and increment `rating.count`
2. If `scheduledVisitId` is provided → set visit `status: 'completed'` and `isVerifiedVisit: true`
3. Create a notification for the user: "Thanks for your feedback!"

### Notes for AI prompt

- Rating recalculation: `newAvg = ((oldAvg * oldCount) + newRating) / (oldCount + 1)`
- Use a Mongoose session/transaction if you want atomic rating update
- Duplicate feedback prevention: unique index on `{user, restaurant, scheduledVisit}`

---

## Phase 7 — Notification & Scheduler Module

**Goal:** Background job that checks for past-due visits and sends feedback reminders.

### Files to create

- `utils/scheduler.js` — cron job setup
- `controllers/notificationController.js`
- `router/notificationRouter.js`

### Cron Job Logic (runs every hour)

```
1. Find all ScheduledVisits where:
   - visitDate < now
   - status === 'upcoming'
   - notificationSent === false

2. For each visit:
   a. Update status → 'pending_feedback'
   b. Create a Notification doc for the user
   c. Set notificationSent: true
```

### Notification Endpoints

| Method | Route                         | Access | Description                          |
| ------ | ----------------------------- | ------ | ------------------------------------ |
| GET    | `/api/v1/notifications`          | Auth   | Get own notifications (unread first) |
| PATCH  | `/api/v1/notifications/:id/read` | Auth   | Mark one as read                     |
| PATCH  | `/api/v1/notifications/read-all` | Auth   | Mark all as read                     |

### Notes for AI prompt

- Use `node-cron` package: `cron.schedule('0 * * * *', jobFn)`
- Start the cron in `app.js` after DB connects
- In MVP, "sending a notification" = creating a Notification doc. No email/SMS needed yet.

---

## Phase 8 — Admin Module

**Goal:** Admin-only analytics and management endpoints.

### Files to create

- `controllers/adminController.js`
- `router/adminRouter.js`

### Endpoints

| Method | Route                       | Access | Description                                    |
| ------ | --------------------------- | ------ | ---------------------------------------------- |
| GET    | `/api/v1/admin/stats`          | Admin  | System overview stats                          |
| GET    | `/api/v1/admin/users`          | Admin  | List all users (paginated)                     |
| GET    | `/api/v1/admin/users/:id`      | Admin  | Get single user + their visit/feedback history |
| PATCH  | `/api/v1/admin/users/:id/role` | Admin  | Change user role                               |
| DELETE | `/api/v1/admin/users/:id`      | Admin  | Delete user                                    |
| GET    | `/api/v1/admin/feedback`       | Admin  | All feedback across all restaurants            |
| GET    | `/api/v1/admin/visits`         | Admin  | All scheduled visits                           |

### Stats Response Shape

```json
{
  "totalUsers": 120,
  "totalRestaurants": 45,
  "totalFeedback": 310,
  "averageRating": 3.8,
  "mostVisitedRestaurant": { "name": "...", "visitCount": 28 },
  "feedbackThisMonth": 64
}
```

### Notes for AI prompt

- All routes protected by `authenticate` + `authorize('admin')` middleware
- Stats can use `Model.countDocuments()` and `Model.aggregate()` for averages

---

## Phase 9 — Error Handling & Validation

**Goal:** Consistent error responses and input validation across all routes.

### Files to create

- `middleware/errorHandler.js` — global error middleware
- `middleware/validate.js` — validation middleware wrapper
- `utils/ApiError.js` — custom error class
- `utils/ApiResponse.js` — standard response wrapper

### Standard Response Format

```json
// Success
{ "success": true, "message": "...", "data": { ... } }

// Error
{ "success": false, "message": "...", "errors": [...] }
```

### Notes for AI prompt

- Use `express-validator` for input validation on all POST/PUT routes
- `ApiError` should extend `Error` with a `statusCode` field
- The global error handler catches all thrown `ApiError` instances and formats them
- Add a 404 handler: `app.use((req, res) => res.status(404).json(...))`

---

## Phase 10 — Testing & Seed Data

**Goal:** Verify all endpoints work. Seed the DB for development.

### Files to create

- `database/seed.js` — seed script for restaurants, users, menu items

### What to seed

- 1 admin user (`role: 'admin'`)
- 5–10 restaurants across all categories with menus
- 2–3 regular users with scheduled visits and feedback

### Notes for AI prompt

- Run with `node database/seed.js`
- Use `mongoose.connection.dropDatabase()` at the top of the seed to reset cleanly
- Hash passwords manually before insert (or call `user.save()` to trigger the pre-hook)

---

## Build Order Summary

```
Phase 1  →  Auth (foundation — everything else depends on this)
Phase 2  →  User Profile
Phase 3  →  Restaurant CRUD
Phase 4  →  Decision Support / Recommendations
Phase 5  →  Scheduled Visits
Phase 6  →  Feedback
Phase 7  →  Notifications + Cron
Phase 8  →  Admin
Phase 9  →  Error Handling + Validation (weave in as you go, formalize here)
Phase 10 →  Seed Data + Manual Testing
```

---

## How to Use This Plan with an AI Tool

Paste this file into your context, then give a prompt like:

> "I'm building PocketBite, a Node.js/Express/MongoDB backend. Here's the full plan: [paste plan.md]. Let's implement Phase 1 — the Auth Module. Use ES modules (import/export). My app.js is already set up with CORS, helmet, cookieParser, and express.json(). Start with `middleware/authenticate.js`, then `controllers/authController.js`, then `router/authRouter.js`."

Add the relevant model file(s) to the context for each phase.
