# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Full-Stack Monorepo Architecture
All code must be organized in a single monorepo structure with clear separation between frontend and backend concerns. The project follows a monorepo approach with `/frontend` for Next.js application and `/backend` for FastAPI services, managed by Spec-Kit Plus specifications.
<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries -->

### II. Spec-Driven Development
All development must follow the Agentic Dev Stack workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code. No manual coding is allowed without corresponding specifications in the `/specs` directory.
<!-- Example: Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats -->

### III. JWT-Based Authentication (NON-NEGOTIABLE)
All API endpoints must require JWT token authentication using Better Auth for user management. Each user's data must be isolated and accessible only to the authenticated user.
<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->

### IV. RESTful API Design
Backend services must implement RESTful API endpoints following standard HTTP methods and status codes. All endpoints must be secured and properly documented.
<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

### V. Type Safety and Validation
All code must enforce type safety (TypeScript for frontend, Pydantic for backend) and implement proper input validation at all boundaries.
<!-- Example: Text I/O ensures debuggability; Structured logging required; Or: MAJOR.MINOR.BUILD format; Or: Start simple, YAGNI principles -->

### VI. Responsive Web Design

All frontend components must be responsive and accessible across different device sizes, using Tailwind CSS for consistent styling.

## Additional Constraints
<!-- Example: Additional Constraints, Security Requirements, Performance Standards, etc. -->

Technology stack requirements: Frontend: Next.js 16+ (App Router), TypeScript, Tailwind CSS; Backend: Python FastAPI, SQLModel ORM; Database: Neon Serverless PostgreSQL; Authentication: Better Auth with JWT tokens; Development: Claude Code + Spec-Kit Plus. All API endpoints must follow the specified contract: GET /api/{user_id}/tasks, POST /api/{user_id}/tasks, GET /api/{user_id}/tasks/{id}, PUT /api/{user_id}/tasks/{id}, DELETE /api/{user_id}/tasks/{id}, PATCH /api/{user_id}/tasks/{id}/complete.
<!-- Example: Technology stack requirements, compliance standards, deployment policies, etc. -->

## Development Workflow
<!-- Example: Development Workflow, Review Process, Quality Gates, etc. -->

Development workflow: 1) Write/update specs in `/specs/` directory following Spec-Kit conventions, 2) Generate implementation plan using Claude Code, 3) Create actionable tasks from the plan, 4) Execute tasks using Claude Code referencing specs with @specs/path/to/file.md, 5) Test and validate implementation, 6) Iterate as needed with spec updates.
<!-- Example: Code review requirements, testing gates, deployment approval process, etc. -->

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

This constitution supersedes all other development practices for this project. All implementation must comply with these principles. Amendments require clear justification, impact assessment, and approval from project stakeholders. All pull requests must verify compliance with constitutional principles. Spec-Kit Plus specifications must be updated when requirements change.
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: 1.0.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-01-03
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->
