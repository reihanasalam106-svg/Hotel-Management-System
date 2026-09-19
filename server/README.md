# Hotel Management System — Backend REST API, PostgreSQL & JWT Authentication

A secure Node.js and Express REST API with PostgreSQL database persistence and Role-Based Access Control (RBAC) powered by JSON Web Tokens (JWT) and bcrypt password encryption.

## Features & Highlights

- **JWT Authentication**: Industry-standard stateless authentication issuing signed JSON Web Tokens (`Bearer <token>`).
- **Role-Based Access Control (RBAC)**: Enforced authorization across module endpoints for roles: `Admin`, `Manager`, `Receptionist`, `Housekeeping`, and `Staff`.
- **Bcrypt Password Security**: Passwords hashed with bcrypt (salt factor 10). Plain-text passwords and password hashes are never exposed.
- **PostgreSQL Database Persistence**: High-performance database operations via PostgreSQL connection pooling (`pg.Pool`).
- **Atomic Multi-Step Transactions**: Transaction isolation for bookings, checkouts, invoice line-items, and payment receipts.
- **Room Availability & Overlap Protection**: Conflict detection prevents overbooking (returns `HTTP 409 Conflict`).
- **Dynamic Database Tax Calculation**: Taxes computed dynamically from `hotel_settings.tax_rate`.
- **Centralized Error & Security Handling**: Helmet HTTP headers, restricted CORS, schema validation, and structured error responses.

---

## Role-Based Permissions Matrix

| Module / Endpoint | Admin | Manager | Receptionist | Housekeeping | Staff |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `GET /api/v1/health` | Public | Public | Public | Public | Public |
| `POST /api/v1/auth/login` | Public | Public | Public | Public | Public |
| `GET /api/v1/auth/me` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `POST /api/v1/auth/logout`| ✓ | ✓ | ✓ | ✓ | ✓ |
| `GET /api/v1/rooms` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `POST / PUT /api/v1/rooms`| ✓ | ✓ | — | — | — |
| `PATCH /api/v1/rooms/:id/status` | ✓ | ✓ | ✓ | ✓ | — |
| `DELETE /api/v1/rooms/:id`| ✓ | — | — | — | — |
| `GET / POST / PUT /api/v1/guests` | ✓ | ✓ | ✓ | — | — |
| `GET / POST / PUT /api/v1/reservations` | ✓ | ✓ | ✓ | — | — |
| `DELETE /api/v1/reservations/:id` | ✓ | ✓ | — | — | — |
| `GET /api/v1/housekeeping/tasks` | ✓ | ✓ | ✓ | ✓ | ✓ |
| `POST / PUT / PATCH /assign /housekeeping` | ✓ | ✓ | — | ✓ | — |
| `PATCH /housekeeping/tasks/:id/status` | ✓ | ✓ | — | ✓ | ✓ |
| `GET / POST / PUT /payments /billing` | ✓ | ✓ | ✓ | — | — |
| `POST /api/v1/billing/:id/cancel` | ✓ | ✓ | — | — | — |
| `GET / POST / PUT /api/v1/staff` | ✓ | ✓ | — | — | — |
| `GET /api/v1/settings` | ✓ | ✓ | ✓ | — | — |
| `PUT /api/v1/settings` | ✓ | ✓ | — | — | — |
| `GET /api/v1/dashboard/summary` | ✓ | ✓ | ✓ | — | — |
| `GET /api/v1/reports/summary` | ✓ | ✓ | — | — | — |

---

## Seeded Demo User Credentials

| Role | Email | Demo Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hotelpro.com` | `Admin@123` | Full access across all modules & settings |
| **Manager** | `manager@hotelpro.com` | `Manager@123` | Operations, staff, reports, room management |
| **Receptionist** | `receptionist@hotelpro.com` | `Reception@123` | Reservations, guests, check-in, billing |
| **Receptionist 2** | `priya.r@hotelpro.com` | `Priya@123` | Reservations, guests, check-in, billing |
| **Housekeeping** | `housekeeping@hotelpro.com` | `House@123` | Task management, room cleaning statuses |
| **Staff** | `staff@hotelpro.com` | `Staff@123` | Room viewing & task status updates |

---

## Prerequisites & Installation

1. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Configure your variables:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173

   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=hotel_management
   DB_USER=postgres
   DB_PASSWORD=your_password

   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   ```

3. **Run Migrations & Seed**:
   ```bash
   npm run migrate
   npm run seed
   ```

4. **Start the API Server**:
   ```bash
   npm run dev    # Development with nodemon
   npm start      # Production start
   ```

---

## Example Requests

### 1. Login & Obtain JWT Token
- **Request**: `POST /api/v1/auth/login`
- **Body**:
  ```json
  {
    "email": "admin@hotelpro.com",
    "password": "Admin@123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": 1,
        "name": "Admin Manager",
        "email": "admin@hotelpro.com",
        "role": "Admin",
        "status": "Active"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "1d"
    }
  }
  ```

### 2. Access Protected Route
Include the Bearer token in the `Authorization` header:
- **Header**: `Authorization: Bearer <token>`
- **Request**: `GET /api/v1/auth/me`
- **Response**:
  ```json
  {
    "success": true,
    "message": "User profile retrieved successfully",
    "data": {
      "id": 1,
      "name": "Admin Manager",
      "email": "admin@hotelpro.com",
      "role": "Admin",
      "status": "Active"
    }
  }
  ```
