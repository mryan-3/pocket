# PocketBite End-to-End Testing Guide

Follow these steps to set up the environment and test the full user and admin journeys.

## 1. Environment Setup

### Backend (Server)
Open a terminal in the `server` directory:
```bash
cd server
pnpm install
# Seed the database with Admin and Test data
node database/seed.js
# Start the server (runs on http://localhost:8001)
pnpm dev
```

### Frontend (Client)
Open a new terminal in the `client` directory:
```bash
cd client
pnpm install
# Start the Next.js development server (runs on http://localhost:3000)
pnpm dev
```

---

## 2. Test Accounts (Seeded)

| Role  | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@pocketbite.com` | `password123` |
| **User** | `john@example.com` | `password123` |

---

## 3. The "User" Journey (Discovery & Scheduling)

1. **Login:** Go to [http://localhost:3000/login](http://localhost:3000/login) and use the **User** credentials.
2. **Explore:** Click **Explore** in the Navbar. You should see "Mama's Kitchen" and "Java House."
3. **Filter:** Use the **Filter Bar** to search for "Mama" or filter by a category like "local."
4. **Schedule:** 
   - Click on a restaurant card.
   - Click **Schedule Visit**.
   - Select a date and time, add a note, and click **Confirm Booking**.
5. **Verify:** Go to your **Dashboard**. Your new visit should appear under **Upcoming Visits**.

---

## 4. The "Admin" Journey (Management & Monitoring)

1. **Admin Login:** Log out and log back in with the **Admin** credentials.
2. **Access Admin Panel:** A new **Admin** link will appear in the Navbar. Click it to enter the **Admin Panel**.
3. **Dashboard:** Verify the **Overview Stats** show the correct counts for users, restaurants, and feedback.
4. **Manage Restaurants:** 
   - Go to the **Restaurants** tab.
   - Click **Add Restaurant** and fill out the form.
   - Click **Create Restaurant**.
   - Go back to the public **Explore** page to verify the new restaurant appears.
5. **Manage Users:**
   - Go to the **Users** tab.
   - Click the **Shield** icon next to "John Doe" to toggle his role between **User** and **Admin**.
6. **Monitoring:**
   - Go to the **Monitoring** tab.
   - Observe the live log of all **Scheduled Visits** and the **Feedback Stream**.

---

## 5. Testing the Feedback Loop

1. **Submit Feedback:** 
   - Log in as the **User** (John Doe).
   - Go to the **Dashboard**.
   - Find the "Pending Feedback" visit (created by the seed script).
   - Click **Leave Feedback**, select a star rating, and write a comment.
2. **Verify Results:**
   - Log back in as **Admin**.
   - Check the **Monitoring** tab; the new feedback should appear at the top of the **Feedback Stream**.
   - Go to the **Explore** page; the restaurant's average rating and count should have updated automatically.
