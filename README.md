# PocketBite

PocketBite is a full-stack restaurant discovery and visit scheduling platform. It allows users to browse restaurants, schedule visits, and manage their profile, while providing an admin dashboard for platform monitoring.

## Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (TypeScript), [Tailwind CSS 4](https://tailwindcss.com/), [React Query](https://tanstack.com/query/latest), [Phosphor Icons](https://phosphoricons.com/)
- **Backend:** [Express](https://expressjs.com/) (Node.js), [Mongoose](https://mongoosejs.com/) (MongoDB), [Express Validator](https://express-validator.github.io/docs/)
- **Authentication:** JWT (JSON Web Tokens) with HttpOnly cookies
- **Package Manager:** [pnpm](https://pnpm.io/)

## Project Structure

```text
pocketbite/
├── client/          # Next.js frontend
└── server/          # Express backend
```

## Prerequisites

- **Node.js:** v20 or higher
- **pnpm:** v9 or higher
- **MongoDB:** A running MongoDB instance (local or Atlas)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mryan-3/pocket.git pocketbite
cd pocketbite
```

### 2. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env` file in the `server` directory and configure the following variables:
   ```env
   SERVER_PORT=8001
   JWT_SECRET=your_super_secret_key
   MONGO_URI=mongodb://localhost:27017/pocketbite
   UPLOAD_DIR=uploads
   NODE_ENV=development
   COOKIE_DOMAIN=localhost
   FRONTEND_URL=http://localhost:3000
   ```

5. (Optional) Seed the database with sample data:
   ```bash
   pnpm seed
   ```

6. Start the development server:
   ```bash
   pnpm dev
   ```

   > **Note:** If you seeded the database, you can log in as an admin using:
   > - **Email:** `admin@pocketbite.com`
   > - **Password:** `password123`

### 3. Frontend Setup

1. Navigate to the client directory (from the root):
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file in the `client` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

## Running the Application

Once both servers are running:
- The frontend will be available at `http://localhost:3000`
- The backend API will be available at `http://localhost:8001/api/v1`

## Scripts

### Client
- `pnpm dev`: Start the development server
- `pnpm build`: Build the application for production
- `pnpm start`: Start the production server
- `pnpm lint`: Run ESLint

### Server
- `pnpm dev`: Start the development server with auto-reload
- `pnpm seed`: Seed the database with sample data
- `pnpm test`: Run tests (not yet implemented)
