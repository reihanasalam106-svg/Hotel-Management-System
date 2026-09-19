# 🏨 HotelPro — Enterprise Hotel Management System

A full-stack, enterprise-grade Hotel Management System built with **React 19 + Vite**, **Node.js + Express**, and **PostgreSQL**. Features comprehensive Role-Based Access Control (RBAC), real-time occupancy analytics, room reservations, housekeeping lifecycle synchronization, automated billing with dynamic GST/tax calculation, and multi-format reports.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, React Router v7, Recharts, Lucide Icons, Vanilla CSS Design System |
| **Backend** | Node.js, Express, PostgreSQL Connection Pooling (`pg`), JWT, bcryptjs, Helmet, CORS, Morgan |
| **Database** | PostgreSQL with strict foreign keys, unique constraints, and ACID transactions |
| **Tooling** | Oxlint, Vite Build Engine, Automated Verification Test Suite |

---

## 📁 Project Structure

```
hotel-management-system/
├── dist/                      # Production build assets (generated)
├── public/                    # Static assets & favicon
├── src/                       # Frontend React Application
│   ├── assets/                # Icons & styles
│   ├── components/            # Reusable UI components by feature
│   │   ├── billing/           # Invoices, payments & checkout modal
│   │   ├── common/            # Buttons, modals, badges, tables, drawers
│   │   ├── guests/            # Guest directory & profile cards
│   │   ├── housekeeping/      # Task boards & room assignment
│   │   ├── layout/            # Sidebar, Header, MainLayout
│   │   ├── reservations/      # Booking calendars & form modals
│   │   ├── rooms/             # Room inventory & pricing modals
│   │   ├── settings/          # Hotel profile & tax settings
│   │   └── staff/             # Employee management & shifts
│   ├── context/               # AuthContext & ReservationContext
│   ├── pages/                 # Route views (Dashboard, Rooms, Billing, etc.)
│   ├── routes/                # AppRoutes & protected route layouts
│   ├── services/              # REST API client & HTTP layer
│   └── styles/                # Design tokens & global stylesheets
├── server/                    # Backend REST API Server
│   ├── database/              # Schema migrations & seed datasets
│   │   ├── migrations/        # PostgreSQL SQL migration scripts
│   │   └── seeds/             # Seed data for initial users & inventory
│   ├── src/
│   │   ├── config/            # DB pool, environment & JWT config
│   │   ├── controllers/       # HTTP request handlers
│   │   ├── middleware/        # JWT auth, RBAC authorization, validation, error handler
│   │   ├── repositories/      # SQL data access layer
│   │   ├── routes/            # Express route definitions
│   │   ├── services/          # Core business logic & transaction handling
│   │   ├── utils/             # API error classes & response formatters
│   │   ├── app.js             # Express app setup & middleware
│   │   └── server.js          # Production server entrypoint
│   ├── testSuite.js           # 25-step automated integration test suite
│   ├── package.json           # Backend dependencies & scripts
│   └── .env.example           # Backend environment template
├── .env.example               # Frontend environment template
├── .gitignore                 # Protected secret & build exclusion rules
├── package.json               # Frontend dependencies & scripts
├── vite.config.js             # Vite configuration
└── README.md                  # System documentation & deployment guide
```

---

## 👥 Role-Based Access Control (RBAC) Matrix

| Module / Action | Admin | Manager | Receptionist | Housekeeping | Staff |
|---|:---:|:---:|:---:|:---:|:---:|
| **Dashboard & Analytics** | Full | Full | Read | Read | Read |
| **Reservations CRUD** | Full | Full | Full | Read | Read |
| **Guest Management** | Full | Full | Full | Read | Read |
| **Room Inventory & Pricing** | Full | Full | Read/Status | Read/Status | Read |
| **Housekeeping Task Board** | Full | Full | Read | Full | Read |
| **Billing & Payments** | Full | Full | Create / Pay | ❌ (403) | ❌ (403) |
| **Reports & Financial Export** | Full | Full | ❌ (403) | ❌ (403) | ❌ (403) |
| **Staff Directory & Shifts** | Full | Full | ❌ (403) | ❌ (403) | ❌ (403) |
| **System & Tax Settings** | Full | Full | ❌ (403) | ❌ (403) | ❌ (403) |

---

## ⚙️ Environment Configuration

### Frontend Environment (`.env`)
Create a `.env` file in the root directory (based on `.env.example`):
```env
# Frontend REST API URL
VITE_API_URL=http://localhost:5000/api/v1
```

### Backend Environment (`server/.env`)
Create a `.env` file in the `server/` directory (based on `server/.env.example`):
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotel_management
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_SSL=false

# Or Cloud PostgreSQL Connection String (e.g. Render / Neon / Supabase):
# DATABASE_URL=postgresql://user:password@host:port/hotel_management?sslmode=require

# Authentication Secrets
JWT_SECRET=your_super_secret_jwt_random_key_min_32_chars
JWT_EXPIRES_IN=1d
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v14.0 or higher running locally or in cloud

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Run database migrations to create schema
npm run migrate

# Seed database with initial rooms, staff, guests, settings
npm run seed

# Run automated integration test suite (25/25 tests)
npm test

# Start backend server in development mode
npm run dev
# Or for production:
# npm start
```

Backend will run on: `http://localhost:5000`  
Health check endpoint: `http://localhost:5000/api/v1/health`

### 3. Frontend Setup
In a new terminal window:
```bash
# Return to root workspace directory
cd ..

# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🧪 Testing & Verification

Run the automated backend business logic and security test suite:
```bash
cd server
npm test
```

Build the production frontend bundle:
```bash
npm run build
```

---

## 🌐 Production Deployment Guide

This project is architected for seamless cloud deployment:
- **Frontend**: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Backend**: [Render](https://render.com), [Railway](https://railway.app), or [AWS App Runner](https://aws.amazon.com/apprunner/)
- **Database**: Managed PostgreSQL on [Neon](https://neon.tech), [Supabase](https://supabase.com), [Render Postgres](https://render.com), or [AWS RDS](https://aws.amazon.com/rds/)

### Step-by-Step Deployment Instructions

#### Step 1: Provision Managed PostgreSQL Database
1. Create a PostgreSQL instance on Neon, Supabase, Render, or AWS RDS.
2. Note your connection details: `DATABASE_URL` (or Host, Port, Database, User, Password).

#### Step 2: Initialize Database Schema & Seed Data
From your local terminal with the cloud `DATABASE_URL` set in `server/.env`:
```bash
cd server
npm run migrate
npm run seed
```

#### Step 3: Deploy Backend on Render / Railway
1. Connect your Git repository to Render/Railway.
2. Set **Root Directory** to `server`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `npm start`.
5. Configure Environment Variables in the cloud dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave default assigned by provider)
   - `DATABASE_URL`: `postgresql://<user>:<password>@<host>:<port>/<db>?sslmode=require`
   - `DB_SSL`: `true`
   - `JWT_SECRET`: `<generated-secure-random-string>`
   - `JWT_EXPIRES_IN`: `1d`
   - `CLIENT_URL`: `https://your-frontend-app.vercel.app` (update after Step 4)
6. Deploy the service and copy the public service URL (e.g. `https://hotel-management-api.onrender.com`).

#### Step 4: Deploy Frontend on Vercel / Netlify
1. Connect your Git repository to Vercel/Netlify.
2. Set **Root Directory** to `./` (root).
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. Configure Environment Variables in the Vercel dashboard:
   - `VITE_API_URL`: `https://hotel-management-api.onrender.com/api/v1`
6. Deploy and copy your production frontend URL (e.g. `https://hotel-management.vercel.app`).

#### Step 5: Update Backend CORS
1. In the Render backend environment settings, update `CLIENT_URL` to match your Vercel URL (`https://hotel-management.vercel.app`).
2. Trigger a redeployment/restart of the backend.

#### Step 6: Verify Production Operations
1. Navigate to your production frontend URL.
2. Log in using your seeded admin credentials.
3. Test the full workflow: Room search → Reservation creation → Check-In → Service billing → Payment → Check-Out → Housekeeping assignment.

---

## 🔒 Security Best Practices
- **Strict Parameterized Queries**: All database operations use `$1, $2` SQL placeholders to eliminate SQL injection risks.
- **JWT & Password Security**: Standardized bcryptjs hashing with 10 salt rounds; password hashes are stripped before JSON serialization.
- **Zero Exposed Secrets**: `.gitignore` strictly protects `.env`, build artifacts, and private credential files.
- **Safe Error Responses**: Operational error messages are displayed while internal stack traces are redacted in production environments.

---

## 📄 License
ISC License. Built for enterprise hotel operations management.
