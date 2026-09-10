# NIRIKSHAN

**Intelligent Project Monitoring & Risk Management Platform**

Smart India Hackathon 2026 Prototype — SIH26103: Web-Based Integrated Project Monitoring Platform

> **Demo Environment** — All data is fictional. Not officially deployed by the Government of India.

---

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`)

### Install & Run

```bash
# From project root
npm run install:all
npm run seed
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5001

### Demo Login Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@nirikshan.demo | Demo@123 |
| Department Officer | officer@nirikshan.demo | Demo@123 |
| Project Manager | manager@nirikshan.demo | Demo@123 |
| Team Member | member@nirikshan.demo | Demo@123 |

---

## Folder Structure

```
nirikshan/
├── client/                 # React + Tailwind frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # All application pages
│   │   ├── services/       # Axios API client
│   │   └── utils/          # Helpers & formatters
│   └── package.json
├── server/                 # Express + MongoDB backend
│   ├── config/             # Database connection
│   ├── middleware/         # JWT auth & authorization
│   ├── models/             # Mongoose schemas
│   ├── routes/             # REST API routes
│   ├── utils/              # Health score, delay prediction, seed
│   └── uploads/            # Document uploads
├── package.json            # Root scripts (concurrently)
└── README.md
```

---

## Environment Variables

### server/.env

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/nirikshan
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### client/.env

```env
VITE_API_URL=http://localhost:5173/api
```

(Vite proxy handles `/api` in dev — see `client/vite.config.js`)

---

## System Architecture

```
┌─────────────┐     REST/JSON      ┌─────────────┐     Mongoose     ┌─────────────┐
│   React     │ ◄──────────────► │   Express   │ ◄──────────────► │   MongoDB   │
│  Frontend   │     JWT Auth       │   Backend   │                  │  Database   │
└─────────────┘                    └─────────────┘                  └─────────────┘
```

- **Frontend:** React 18, React Router, Tailwind CSS, Recharts, Leaflet, Axios
- **Backend:** Node.js, Express.js, JWT + bcrypt authentication
- **Database:** MongoDB with Mongoose ODM
- **Dark Mode:** Toggle in top bar or Settings; persists via localStorage

---

## Database Models

| Model | Description |
|-------|-------------|
| User | Authentication, roles, department assignment |
| Department | Government departments |
| Project | Core project entity with budget, status, risk |
| Task | Assignable work items with comments |
| Milestone | Project phase tracking |
| Budget | Approved/utilized/remaining budget per project |
| Risk | Risk register with probability × impact matrix |
| ProjectUpdate | Progress updates with comments |
| Notification | System-generated alerts |
| Document | File uploads per project |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/auth/me | Current user profile |
| GET | /api/projects | List projects (filtered by role) |
| GET | /api/projects/:id | Project detail with metrics |
| POST | /api/projects | Create project |
| GET | /api/tasks | List tasks |
| GET | /api/analytics/dashboard | Dashboard KPIs |
| GET | /api/analytics/executive | Executive overview |
| GET | /api/analytics/charts | Chart data |
| GET | /api/search?q= | Global search |

All routes except `/api/auth/login` and `/api/health` require `Authorization: Bearer <token>`.

---

## User Roles & Permissions

| Feature | Super Admin | Dept Officer | Project Manager | Team Member |
|---------|:-----------:|:------------:|:---------------:|:-----------:|
| Manage departments | ✓ | — | — | — |
| Manage users | ✓ | ✓ | — | — |
| Create projects | ✓ | ✓ | — | — |
| Manage tasks | ✓ | ✓ | ✓ | Own tasks |
| View analytics | ✓ | ✓ | ✓ | ✓ |
| Upload documents | ✓ | ✓ | ✓ | ✓ |

---

## Prototype Algorithms

### Project Health Score (0–100)

**Not an official government formula.**

```
Health = (Progress×0.25 + Timeline×0.25 + Budget×0.20 + Milestones×0.20 + OverduePenalty×0.10) × RiskPenalty
```

| Score | Label |
|-------|-------|
| 90–100 | Excellent |
| 75–89 | Good |
| 50–74 | At Risk |
| 0–49 | Critical |

### Delay Risk Prediction

Rule-based (not ML). Analyzes:
- Progress vs expected progress gap
- Overdue and blocked tasks
- Budget utilization vs progress
- Milestone delays
- Days remaining

Outputs: LOW / MEDIUM / HIGH delay risk with estimated days and explainable reasons.

---

## Demo Judging Flow

1. **Login** → Use demo account
2. **Dashboard** → View KPIs and project health
3. **Select Project** → Click any project
4. **View Health** → See health score, delay prediction
5. **Tasks/Milestones** → Check progress tabs
6. **Budget** → View utilization and warnings
7. **Risks** → Review risk register
8. **Executive Overview** → Action required panel

---

## Testing

```bash
# Health check
curl http://localhost:5001/api/health

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nirikshan.demo","password":"Demo@123"}'

# Dashboard KPIs (use token from login)
curl http://localhost:5001/api/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install root, server, and client deps |
| `npm run dev` | Start backend + frontend concurrently |
| `npm run seed` | Populate demo data |
| `npm run build` | Build frontend for production |

---

Built for SIH 2026 — Team prototype demonstration.
