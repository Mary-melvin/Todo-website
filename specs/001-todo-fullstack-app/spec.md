# Feature Specification: Todo Full-Stack Web Application

**Feature Branch**: `001-todo-fullstack-app`
**Created**: 2026-01-03
**Status**: Draft
**Input**: User description: "You are Claude Code, following a spec-driven workflow with Spec-Kit Plus. No manual coding — implement via specs and iterations.

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

Implement the complete Phase II app now, starting with specs generation, then plan, tasks, and code."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Authentication (Priority: P1)

A new user can sign up with email and password, and existing users can sign in to access their todo lists. After authentication, users can securely access their personal data.

**Why this priority**: Authentication is the foundation for user data isolation and security. Without authentication, users cannot have personalized todo lists that are isolated from other users.

**Independent Test**: Can be fully tested by completing the sign up and sign in flows independently and verifying that users can access their authenticated session.

**Acceptance Scenarios**:

1. **Given** a user is on the sign up page, **When** they enter a valid email and password and submit, **Then** they are registered and redirected to their dashboard
2. **Given** a user has an account, **When** they enter their credentials on the sign in page, **Then** they are authenticated and can access their todo lists
3. **Given** a user is signed in, **When** they attempt to access protected routes, **Then** they are granted access to their personal data only

---

### User Story 2 - Task Management (Priority: P1)

Authenticated users can create, read, update, and delete their personal tasks. They can also mark tasks as complete or incomplete.

**Why this priority**: This is the core functionality of a todo application - users need to be able to manage their tasks to derive value from the application.

**Independent Test**: Can be fully tested by creating, viewing, updating, and deleting tasks independently, verifying that the core CRUD functionality works for authenticated users.

**Acceptance Scenarios**:

1. **Given** a user is authenticated, **When** they create a new task with a title, **Then** the task appears in their task list
2. **Given** a user has tasks in their list, **When** they view the task list, **Then** they see all their tasks with titles and completion status
3. **Given** a user has a task, **When** they update the task details, **Then** the changes are saved and reflected in the task list
4. **Given** a user has a task, **When** they delete the task, **Then** it is removed from their task list permanently
5. **Given** a user has a pending task, **When** they mark it as complete, **Then** its status updates to completed and vice versa

---

### User Story 3 - Task Filtering and Sorting (Priority: P2)

Authenticated users can filter their tasks by status (all, pending, completed) and sort them by creation date or title.

**Why this priority**: This enhances the user experience by allowing users to organize and find their tasks more efficiently, but the core functionality works without it.

**Independent Test**: Can be fully tested by applying different filters and sorting options independently and verifying that the task list updates accordingly.

**Acceptance Scenarios**:

1. **Given** a user has tasks with different completion statuses, **When** they apply a status filter, **Then** only tasks matching that status are displayed
2. **Given** a user has multiple tasks, **When** they apply a sorting option, **Then** tasks are displayed in the specified order (by title or creation date)

---

### User Story 4 - Responsive UI (Priority: P2)

The application provides a responsive user interface that works well on different device sizes, allowing users to manage their tasks from desktop, tablet, or mobile devices.

**Why this priority**: This ensures accessibility and usability across different devices, which is important for a modern web application, but doesn't affect core functionality.

**Independent Test**: Can be fully tested by accessing the application on different screen sizes and verifying that the UI adapts appropriately.

**Acceptance Scenarios**:

1. **Given** a user accesses the application on a mobile device, **When** they interact with the UI, **Then** the interface is usable and properly formatted for small screens
2. **Given** a user accesses the application on a desktop device, **When** they interact with the UI, **Then** the interface is properly formatted for larger screens

---

### Edge Cases

- What happens when a user tries to access another user's tasks? (System should prevent access to unauthorized data)
- How does the system handle invalid JWT tokens? (System should return 401 Unauthorized)
- What happens when a user tries to create a task without a title? (System should validate and show appropriate error)
- How does the system handle database connection failures? (System should show appropriate error messages)
- What happens when a user's session expires during usage? (System should redirect to login page)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create accounts with email and password
- **FR-002**: System MUST allow users to sign in with their credentials
- **FR-003**: System MUST generate and verify JWT tokens for API authentication
- **FR-004**: System MUST ensure user data isolation (users can only access their own tasks)
- **FR-005**: System MUST allow authenticated users to create tasks with title and optional description
- **FR-006**: System MUST allow authenticated users to view their task lists
- **FR-007**: System MUST allow authenticated users to update their tasks
- **FR-008**: System MUST allow authenticated users to delete their tasks
- **FR-009**: System MUST allow authenticated users to toggle task completion status
- **FR-010**: System MUST allow users to filter tasks by status (all, pending, completed)
- **FR-011**: System MUST allow users to sort tasks by creation date or title
- **FR-012**: System MUST provide a responsive user interface that works on different device sizes
- **FR-013**: System MUST return appropriate error responses (401 for unauthorized access)
- **FR-014**: System MUST store user and task data persistently in a database
- **FR-015**: System MUST validate required fields (e.g., task title is required)

### Key Entities *(include if feature involves data)*

- **User**: Represents a registered user with authentication credentials; has a unique identifier, email, and name; owns multiple tasks
- **Task**: Represents a todo item with a title (required), optional description, completion status (boolean), and timestamps; belongs to a single user

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete account creation in under 2 minutes with a success rate of 95%
- **SC-002**: Users can create, read, update, and delete tasks with 99% success rate
- **SC-003**: 90% of users successfully complete the primary task management workflow on first attempt
- **SC-004**: System handles 100 concurrent users without performance degradation
- **SC-005**: Task filtering and sorting operations complete in under 1 second with 95% of queries
- **SC-006**: UI responds to user interactions in under 300ms for 95% of actions
- **SC-007**: Authentication and authorization failures result in appropriate error responses 100% of the time
- **SC-008**: User data isolation is maintained with 100% accuracy (users cannot access other users' data)
