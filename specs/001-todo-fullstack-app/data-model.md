# Data Model: Todo Full-Stack Web Application

**Date**: 2026-01-03
**Feature**: Todo Full-Stack Web Application
**Branch**: 001-todo-fullstack-app

## Overview

This document defines the data models for the Todo Full-Stack Web Application, including entities, relationships, validation rules, and state transitions.

## Entity Definitions

### User
**Description**: Represents a registered user in the system
**Fields**:
- `id` (string): Unique identifier for the user (Primary Key, provided by Better Auth)
- `email` (string): User's email address (Unique, required)
- `name` (string): User's display name (required)
- `created_at` (timestamp): When the user account was created
- `updated_at` (timestamp): When the user account was last updated

**Relationships**:
- One User has many Tasks (one-to-many)

**Validation Rules**:
- Email must be a valid email format
- Email must be unique across all users
- Name must be between 1-100 characters

### Task
**Description**: Represents a todo item created by a user
**Fields**:
- `id` (integer): Unique identifier for the task (Primary Key)
- `user_id` (string): Foreign key referencing the User who owns this task
- `title` (string): Title of the task (required, not null)
- `description` (text): Detailed description of the task (optional, nullable)
- `completed` (boolean): Whether the task is completed (default: false)
- `created_at` (timestamp): When the task was created
- `updated_at` (timestamp): When the task was last updated

**Relationships**:
- Many Tasks belong to one User (many-to-one)

**Validation Rules**:
- Title is required and must be between 1-200 characters
- Description is optional and can be up to 1000 characters
- User_id must reference a valid user
- Completed defaults to false

## Database Schema

### Tables
```sql
-- Table managed by Better Auth
users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table managed by application
tasks (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes
- `tasks.user_id`: Index on user_id for efficient filtering by user
- `tasks.completed`: Index on completed for efficient filtering by status

## API Data Contracts

### Task Creation Request
```json
{
  "title": "string (required, 1-200 characters)",
  "description": "string (optional, 0-1000 characters)"
}
```

### Task Response
```json
{
  "id": "integer",
  "user_id": "string",
  "title": "string",
  "description": "string or null",
  "completed": "boolean",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp"
}
```

### Task Update Request
```json
{
  "title": "string (optional, 1-200 characters)",
  "description": "string (optional, 0-1000 characters)",
  "completed": "boolean (optional)"
}
```

### Task List Response
```json
{
  "tasks": [
    {
      "id": "integer",
      "user_id": "string",
      "title": "string",
      "description": "string or null",
      "completed": "boolean",
      "created_at": "ISO 8601 timestamp",
      "updated_at": "ISO 8601 timestamp"
    }
  ]
}
```

## State Transitions

### Task Completion
- **From**: Pending (completed = false)
- **To**: Completed (completed = true)
- **Trigger**: PATCH /api/tasks/{id}/complete with completed = true
- **Validation**: Task must exist and belong to authenticated user

### Task Reversion
- **From**: Completed (completed = true)
- **To**: Pending (completed = false)
- **Trigger**: PATCH /api/tasks/{id}/complete with completed = false
- **Validation**: Task must exist and belong to authenticated user

## Business Rules

1. **Data Isolation**: Users can only access, modify, or delete tasks that belong to them (user_id must match authenticated user)
2. **Required Fields**: Task title is required for creation
3. **Ownership**: Tasks cannot be transferred between users
4. **Immutability**: User_id cannot be changed after task creation
5. **Audit Trail**: created_at is set on creation, updated_at is updated on any modification

## Validation Summary

### Input Validation
- Task title: 1-200 characters, required
- Task description: 0-1000 characters, optional
- User authentication: Required for all operations
- User authorization: User must own the task being accessed

### Database Constraints
- Foreign key constraint: tasks.user_id references users.id
- Not null constraints: id, user_id, title for tasks
- Unique constraint: email for users
- Default values: completed = false, timestamps auto-generated