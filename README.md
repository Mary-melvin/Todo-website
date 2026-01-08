# Todo Full-Stack Web Application

A multi-user Todo web application with Next.js frontend and FastAPI backend, using Neon PostgreSQL for persistent storage. The application features user authentication with Better Auth JWT tokens, secure API endpoints with user data isolation, and a responsive UI for task management (CRUD operations with filtering and sorting).

## Tech Stack

- Frontend: Next.js 16+ (App Router), TypeScript, Tailwind CSS
- Backend: Python FastAPI, SQLModel ORM
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT plugin

## Features

- User signup/signin (email/password)
- Task CRUD + toggle completion (per-user isolation)
- Responsive UI: Signup/signin pages, task list (with filters: status, sort), create/edit forms

## Prerequisites

- Node.js 18+
- Python 3.11+
- Docker and Docker Compose

## Setup

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend
DATABASE_URL="postgresql://username:password@localhost:5432/todoapp"
BETTER_AUTH_SECRET="your-super-secret-jwt-key-here-make-sure-it-is-at-least-32-characters-long"
BETTER_AUTH_URL="http://localhost:3000"

# Frontend
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

### Quick Start with Docker

```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend API Docs: http://localhost:8000/docs

### Manual Setup

1. **Backend Setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Endpoints

All API endpoints require JWT authentication in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion status

## Development

### Project Structure

```
hackathon-todo/
├── .spec-kit/              # Spec-Kit configuration
├── specs/                  # Specifications
├── frontend/               # Next.js application
│   ├── CLAUDE.md           # Frontend guidelines
│   ├── package.json
│   ├── src/
│   │   ├── app/            # Pages and layouts
│   │   ├── components/     # Reusable components
│   │   └── lib/            # Utilities
├── backend/                # FastAPI application
│   ├── CLAUDE.md           # Backend guidelines
│   ├── main.py             # FastAPI app entry point
│   ├── models.py           # SQLModel models
│   ├── db.py               # Database connection
│   ├── auth.py             # Authentication utilities
│   ├── middleware/         # Middleware
│   └── routes/             # API routes
├── docker-compose.yml      # Docker configuration
└── README.md
```

## Running Tests

- Backend: `cd backend && pytest`
- Frontend: `cd frontend && npm run test`