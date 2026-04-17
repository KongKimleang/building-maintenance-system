# Building Maintenance Management System

A full-stack web application that streamlines maintenance request management for residential apartment buildings. This project was developed as a Final Year Project using React.js, Node.js, Express.js, and MongoDB.

![Project Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🌐 Live Demo

| Service        | URL                                                          |
| -------------- | ------------------------------------------------------------ |
| 🎨 Frontend    | [https://your-app.vercel.app](https://your-app.vercel.app)   |
| ⚙️ Backend API | [https://your-app.railway.app](https://your-app.railway.app) |

> Replace these placeholder URLs with your actual deployed frontend and backend URLs.

---

## 👥 Team Members

| Name                | Role                                   | Student ID |
| ------------------- | -------------------------------------- | ---------- |
| Kong Kimleang       | Frontend Developer & Integration Lead  | 2023491    |
| Phann Chanthariroza | Backend Developer & Database Architect | 2023430    |

**Instructor:** Chandan Mukherjee
**Course:** FYP 401 001 - Final Year Project I

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [User Roles](#user-roles)
- [CI Pipeline](#ci-pipeline)
- [Git Workflow](#git-workflow---daily-workflow)
- [Acknowledgements](#acknowledgements)

---

## 📖 About

The Building Maintenance Management System is a comprehensive web-based application designed to streamline and digitize the maintenance request and management process for residential apartment buildings.

### Problem Statement

Traditional maintenance management relies on manual processes such as phone calls, paper forms, or verbal complaints. These methods lead to lost requests, delayed responses, and lack of transparency.

### Solution

A centralized digital platform that connects residents, administrators, and technicians through a transparent and efficient maintenance workflow.

---

## ✨ Features

### 👤 Authentication & Authorization

- Secure login with JWT tokens
- Role-based access control (Admin, Resident, Staff, Technician)
- Password hashing with bcrypt
- First-login password change requirement
- Forgot-password guidance flow with admin contact popup

### 🔧 Maintenance Requests

- Submit requests with title, description, category, priority, and location
- Auto-generated unique request IDs (#001, #002...)
- Photo upload support
- Complete request timeline tracking
- Filter and search by status, priority, category

### 👑 Admin Features

- View all maintenance requests
- Assign technicians to requests
- Create and manage user accounts
- View system statistics and analytics
- Manage buildings and units

### 🏠 Resident Features

- Submit maintenance requests
- View personal request history
- Track request status in real-time
- Edit pending requests
- Replace existing request photo or remove photo
- Submit feedback and ratings

### 👷 Technician Features

- View assigned tasks
- Update request status (In Progress, Completed)
- Add work notes and timeline updates
- View resident contact information

### 🔔 Notifications

- Real-time notifications for status updates
- Notification bell with unread count
- Mark as read / mark all as read

---

## 🛠️ Tech Stack

### Frontend

| Technology   | Purpose      |
| ------------ | ------------ |
| React.js     | UI framework |
| Tailwind CSS | Styling      |
| React Router | Navigation   |
| Axios        | API calls    |

### Backend

| Technology         | Purpose                |
| ------------------ | ---------------------- |
| Node.js            | Runtime environment    |
| Express.js         | Web framework          |
| JWT                | Authentication         |
| Bcrypt.js          | Password hashing       |
| Multer             | File uploads           |
| Helmet             | Security headers       |
| Express Rate Limit | Brute force protection |

### Database

| Technology    | Purpose        |
| ------------- | -------------- |
| MongoDB Atlas | Cloud database |
| Mongoose      | ODM            |

### Deployment

| Service       | Purpose          |
| ------------- | ---------------- |
| Vercel        | Frontend hosting |
| Railway       | Backend hosting  |
| MongoDB Atlas | Database hosting |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB Atlas account
- Git

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/KongKimleang/building-maintenance-system.git
cd building-maintenance-system
```

**2. Setup Backend**

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
# Optional: multiple frontend origins (comma-separated)
# FRONTEND_URLS=http://localhost:3000,https://your-frontend-domain.com
```

Start backend server:

```bash
npm run dev
```

**3. Setup Frontend**

```bash
cd Frontend
npm install
```

Create a `.env` file in `Frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start frontend application:

```bash
npm start
```

**4. Open in browser**

```
http://localhost:3000
```

---

## 📁 Project Structure

```
building-maintenance-system/
│
├── Backend/
│   ├── config/               # Database connection
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth, role checks, uploads
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   └── server.js             # Express app entry point
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Shared UI components
│   │   ├── context/          # React context providers
│   │   ├── pages/            # Role-based pages (admin/resident/technician/auth)
│   │   ├── services/         # API layer
│   │   └── utils/            # Frontend utilities
│   └── tests/                # Playwright end-to-end tests
│
└── README.md
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected routes require:

```
Authorization: Bearer <token>
```

### Endpoints

#### 🔐 Auth

| Method | Endpoint                | Description      | Access  |
| ------ | ----------------------- | ---------------- | ------- |
| POST   | `/auth/login`           | Login user       | Public  |
| POST   | `/auth/register`        | Register user    | Admin   |
| GET    | `/auth/me`              | Get current user | Private |
| POST   | `/auth/change-password` | Change password  | Private |

#### 👤 Users

| Method | Endpoint                    | Description     | Access |
| ------ | --------------------------- | --------------- | ------ |
| GET    | `/users`                    | Get all users   | Admin  |
| POST   | `/users`                    | Create user     | Admin  |
| GET    | `/users/:id`                | Get single user | Admin  |
| PUT    | `/users/:id`                | Update user     | Admin  |
| DELETE | `/users/:id`                | Delete user     | Admin  |
| GET    | `/users/technicians`        | Get technicians | Admin  |
| PUT    | `/users/:id/reset-password` | Reset password  | Admin  |

#### 🔧 Requests

| Method | Endpoint                | Description        | Access            |
| ------ | ----------------------- | ------------------ | ----------------- |
| GET    | `/requests`             | Get all requests   | Admin, Technician |
| POST   | `/requests`             | Create request     | Resident, Staff   |
| GET    | `/requests/stats`       | Get statistics     | Private           |
| GET    | `/requests/my-requests` | Get my requests    | Resident, Staff   |
| GET    | `/requests/my-tasks`    | Get my tasks       | Technician        |
| GET    | `/requests/:id`         | Get single request | Private           |
| PUT    | `/requests/:id`         | Update own pending request | Resident, Staff   |
| PUT    | `/requests/:id/assign`  | Assign technician  | Admin             |
| PUT    | `/requests/:id/status`  | Update status      | Admin, Technician |
| POST   | `/requests/:id/comment` | Add comment        | Private           |

#### 🔔 Notifications

| Method | Endpoint                  | Description          | Access  |
| ------ | ------------------------- | -------------------- | ------- |
| GET    | `/notifications`          | Get my notifications | Private |
| PUT    | `/notifications/read-all` | Mark all read        | Private |
| PUT    | `/notifications/:id/read` | Mark one read        | Private |
| DELETE | `/notifications/:id`      | Delete notification  | Private |

#### 🏢 Buildings

| Method | Endpoint               | Description         | Access  |
| ------ | ---------------------- | ------------------- | ------- |
| GET    | `/buildings`           | Get all buildings   | Private |
| POST   | `/buildings`           | Create building     | Admin   |
| GET    | `/buildings/:id`       | Get single building | Private |
| PUT    | `/buildings/:id`       | Update building     | Admin   |
| DELETE | `/buildings/:id`       | Delete building     | Admin   |
| GET    | `/buildings/:id/units` | Get units           | Private |
| POST   | `/buildings/:id/units` | Create unit         | Admin   |

#### ⭐ Feedback

| Method | Endpoint               | Description          | Access   |
| ------ | ---------------------- | -------------------- | -------- |
| POST   | `/feedback`            | Submit feedback      | Resident |
| GET    | `/feedback`            | Get all feedback     | Admin    |
| GET    | `/feedback/:requestId` | Get request feedback | Private  |

---

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- HTTP security headers (Helmet)
- Rate limiting (100 req/15min, 10 login attempts/15min)
- NoSQL injection prevention (mongo-sanitize)
- XSS attack prevention (xss-clean)
- CORS protection with environment-based allowlist
- Request body size limit (10kb)

---

## ⚙️ CI Pipeline

This project uses a lightweight GitHub Actions workflow in `.github/workflows/ci.yml`:

- Workflow name: `Easy CI`
- Trigger: push and pull request to `main`
- Checks:
	- Install backend dependencies
	- Install frontend dependencies
	- Build frontend
	- Run frontend tests

### Notes

- The workflow uses `npm install` (not `npm ci`) to avoid lockfile mismatch failures during active development.
- If CI fails on GitHub, open **Actions** tab and inspect the failed step logs first.
- For stable CI in production, consider returning to `npm ci` after lockfiles are fully synchronized.

---

## 👥 User Roles

| Role           | Permissions                                                     |
| -------------- | --------------------------------------------------------------- |
| **Admin**      | Full access — manage users, buildings, requests, view analytics |
| **Resident**   | Submit requests, view own requests, submit feedback             |
| **Staff**      | Same as resident                                                |
| **Technician** | View assigned tasks, update status, add notes                   |

---

## 📊 Database Schema

### Collections

- **users** — User accounts with role-based fields
- **requests** — Maintenance requests with timeline
- **notifications** — User notifications
- **buildings** — Building information
- **units** — Units/rooms within buildings
- **feedbacks** — Resident ratings and comments

---

## 🎯 Project Status

| Feature              | Status         |
| -------------------- | -------------- |
| Authentication       | ✅ Complete    |
| User Management      | ✅ Complete    |
| Request Submission   | ✅ Complete    |
| Request Workflow     | ✅ Complete    |
| Notifications        | ✅ Complete    |
| Buildings Management | ✅ Complete    |
| Feedback System      | ✅ Complete    |
| Security             | ✅ Complete    |
| Frontend UI          | 🔄 In Progress |
| Deployment           | 🔄 In Progress |
| Documentation        | 🔄 In Progress |

---

## 📝 License

This project is for academic purposes — Final Year Project at AUPP.

---

## 🌿 Git Workflow — Daily Workflow

### First Time Setup

```bash
# Clone the project
git clone https://github.com/KongKimleang/building-maintenance-system.git

# Go into the project
cd building-maintenance-system

# Check everything is connected
git status
```

---

### Every Day Workflow

```bash
# Step 1 — Always pull latest code first before starting work
git pull origin main

# Step 2 — Check what files you changed
git status

# Step 3 — Stage all changed files
git add .

# OR add specific file only
git add Backend/controllers/requestController.js

# Step 4 — Commit with a clear message
git commit -m "Add filter to getAllRequests"

# Step 5 — Push to GitHub
git push origin main
```

---

### Good Commit Message Examples

```bash
# Good examples (clear and specific)
git commit -m "Fix submit request bug in requestController"
git commit -m "Add notification bell component"
git commit -m "Connect login page to backend API"
git commit -m "Add security middleware to server.js"
git commit -m "Update README with API documentation"

# Bad examples (too vague)
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
```

---

### Check History

```bash
# See all commits
git log

# See short commit history
git log --oneline

# See what changed in a file
git diff Backend/server.js
```

---

### Undo Mistakes

```bash
# Undo changes in a file (before commit)
git restore filename.js

# Unstage a file (after git add but before commit)
git reset HEAD filename.js

# See what branch you are on
git branch
```

---

## Acknowledgements

- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
