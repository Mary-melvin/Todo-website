---
id: 1
title: Create Todo App Spec
stage: spec
date_iso: 2026-01-03
surface: agent
model: claude-sonnet-4-5-20250929
feature: todo-fullstack-app
branch: 001-todo-fullstack-app
user: USER
command: /sp.specify
labels:
  - spec
  - todo-app
  - authentication
  - crud
files_yaml:
  - specs/001-todo-fullstack-app/spec.md
  - specs/001-todo-fullstack-app/checklists/requirements.md
tests_yaml:
  - spec-validation
spec: specs/001-todo-fullstack-app/spec.md
ticket: null
adr: null
pr: null
---

# Create Todo App Spec

## Prompt Text

```
You are Claude Code, following a spec-driven workflow with Spec-Kit Plus. No manual coding — implement via specs and iterations.

Project: hackathon-todo (monorepo Phase II Todo Full-Stack Web App)

Tech Stack:
- Frontend: Next.js 16+ (App Router, TypeScript, Tailwind CSS)
- Backend: Python FastAPI, SQLModel ORM
- Database: Neon Serverless PostgreSQL (DATABASE_URL env var)
- Auth: Better Auth (latest) with JWT plugin for issuing verifiable JWT tokens to secure FastAPI API calls

Key Features:
- User signup/signin (email/password)
- Task CRUD + toggle completion (per-user isolation)
- Responsive UI: Signup/signin pages, task list (with filters: status, sort), create/edit forms

Authentication Flow (Updated Best Practice):
- Better Auth handles sessions on frontend (cookies).
- Add JWT plugin: Provides /api/auth/token endpoint to fetch JWT (after session) and /.well-known/jwks.json for public keys.
- Frontend: After login, call /api/auth/token to get JWT; attach as Authorization: Bearer <jwt> to all FastAPI requests (via api client in /lib/api.ts).
- FastAPI: Middleware to verify JWT (using PyJWT + fetch JWKS from frontend URL /.well-known/jwks.json or use symmetric if shared BETTER_AUTH_SECRET). Extract user_id from payload; filter all task queries by user_id. Return 401 if invalid/missing.
- Env: BETTER_AUTH_SECRET (shared if symmetric), BETTER_AUTH_URL, DATABASE_URL (Neon).

API Endpoints (Base: /api/tasks, all require JWT auth):
- GET /api/tasks?status=all|pending|completed&sort=created|title
- POST /api/tasks (body: title required, description optional)
- GET /api/tasks/{id}
- PUT /api/tasks/{id} (update)
- DELETE /api/tasks/{id}
- PATCH /api/tasks/{id}/complete (toggle)

Database Schema:
- users: Managed by Better Auth (id: string PK, email, name, etc.)
- tasks: id (int PK), user_id (string FK to users.id), title (str not null), description (text nullable), completed (bool default false), created_at, updated_at
- Indexes: tasks.user_id, tasks.completed

Monorepo Structure:
- /.spec-kit/config.yaml (as in document: name, version, structure dirs, phases including phase2-web with task-crud + authentication)
- /specs/: overview.md, features/task-crud.md (user stories + criteria), features/authentication.md, api/rest-endpoints.md, database/schema.md, ui/components.md, ui/pages.md
- Root CLAUDE.md: Project overview, spec usage (@specs/path), workflow, commands (npm run dev frontend, uvicorn backend, docker-compose)
- /frontend/CLAUDE.md: Server components default, API client /lib/api.ts (attach JWT), Tailwind
- /backend/CLAUDE.md: main.py entry, models.py (SQLModel), routes/, db.py, JWT verification middleware
- docker-compose.yml for both services

Workflow:
1. Generate all /specs/ files based on above (reference document examples).
2. Generate .spec-kit/config.yaml and all CLAUDE.md files.
3. Plan: Setup monorepo → Better Auth config with JWT plugin → DB models/migrations → Backend routes + JWT middleware → Frontend pages/components + api client with JWT → Testing user isolation.
4. Implement step-by-step, referencing specs (@specs/features/task-crud.md etc.).
5. Ensure: Responsive UI, error handling (HTTPException), env vars (BETTER_AUTH_SECRET, DATABASE_URL, BETTER_AUTH_URL=http://localhost:3000).
6. Output: Full file tree + code for key files (auth.ts, main.py, models.py, routes, pages, lib/api.ts, etc.), setup/run instructions.

Implement the complete Phase II app now, starting with specs generation, then plan, tasks, and code.
```

## Response Text

Created a comprehensive feature specification for the Todo Full-Stack Web Application. The specification includes:

- User Scenarios & Testing with 4 prioritized user stories covering authentication, task management, filtering/sorting, and responsive UI
- Functional Requirements with 15 specific requirements covering authentication, task CRUD operations, data isolation, and UI responsiveness
- Key Entities defining User and Task data models
- Success Criteria with 8 measurable outcomes including user success rates, performance metrics, and data isolation accuracy

The specification follows the template structure and captures all the key requirements from the user's feature description, including JWT-based authentication, user data isolation, and the core task management functionality.

## Outcome

Successfully created a complete feature specification that captures all requirements for the Todo Full-Stack Web Application, including authentication, task CRUD operations, filtering/sorting, and responsive UI. The spec is ready for the planning phase.

## Evaluation

The specification is comprehensive, testable, and technology-agnostic where appropriate. It includes clear acceptance scenarios, edge cases, and measurable success criteria that will guide the implementation process.