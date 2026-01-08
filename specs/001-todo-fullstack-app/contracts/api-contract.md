# API Contract: Todo Full-Stack Web Application

**Date**: 2026-01-03
**Feature**: Todo Full-Stack Web Application
**Branch**: 001-todo-fullstack-app

## Overview

This document defines the API contracts for the Todo Full-Stack Web Application, specifying the endpoints, request/response formats, authentication requirements, and error handling.

## Base URL and Authentication

**Base URL**: `/api`
**Authentication**: All endpoints require JWT token in Authorization header
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Task Management

#### GET /tasks
**Description**: Retrieve all tasks for the authenticated user
**Authentication**: Required
**Query Parameters**:
- `status` (optional): Filter by completion status ("all", "pending", "completed") - default: "all"
- `sort` (optional): Sort order ("created", "title") - default: "created"

**Response**:
- `200 OK`: Successfully retrieved tasks
```json
{
  "tasks": [
    {
      "id": 1,
      "user_id": "user-uuid",
      "title": "Task title",
      "description": "Task description or null",
      "completed": false,
      "created_at": "2023-12-01T10:00:00Z",
      "updated_at": "2023-12-01T10:00:00Z"
    }
  ]
}
```

- `401 Unauthorized`: Invalid or missing JWT token

#### POST /tasks
**Description**: Create a new task for the authenticated user
**Authentication**: Required
**Request Body**:
```json
{
  "title": "Task title (required, 1-200 chars)",
  "description": "Task description (optional, 0-1000 chars)"
}
```

**Response**:
- `201 Created`: Task successfully created
```json
{
  "id": 1,
  "user_id": "user-uuid",
  "title": "Task title",
  "description": "Task description or null",
  "completed": false,
  "created_at": "2023-12-01T10:00:00Z",
  "updated_at": "2023-12-01T10:00:00Z"
}
```

- `400 Bad Request`: Invalid request body (e.g., title missing or too long)
- `401 Unauthorized`: Invalid or missing JWT token

#### GET /tasks/{id}
**Description**: Retrieve a specific task by ID
**Authentication**: Required
**Path Parameters**:
- `id`: Task ID

**Response**:
- `200 OK`: Task successfully retrieved
```json
{
  "id": 1,
  "user_id": "user-uuid",
  "title": "Task title",
  "description": "Task description or null",
  "completed": false,
  "created_at": "2023-12-01T10:00:00Z",
  "updated_at": "2023-12-01T10:00:00Z"
}
```

- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Task does not exist or does not belong to user

#### PUT /tasks/{id}
**Description**: Update a specific task by ID
**Authentication**: Required
**Path Parameters**:
- `id`: Task ID

**Request Body**:
```json
{
  "title": "Task title (optional, 1-200 chars)",
  "description": "Task description (optional, 0-1000 chars)",
  "completed": false
}
```

**Response**:
- `200 OK`: Task successfully updated
```json
{
  "id": 1,
  "user_id": "user-uuid",
  "title": "Updated task title",
  "description": "Updated task description or null",
  "completed": false,
  "created_at": "2023-12-01T10:00:00Z",
  "updated_at": "2023-12-01T11:00:00Z"
}
```

- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Task does not exist or does not belong to user

#### DELETE /tasks/{id}
**Description**: Delete a specific task by ID
**Authentication**: Required
**Path Parameters**:
- `id`: Task ID

**Response**:
- `204 No Content`: Task successfully deleted
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Task does not exist or does not belong to user

#### PATCH /tasks/{id}/complete
**Description**: Toggle the completion status of a specific task
**Authentication**: Required
**Path Parameters**:
- `id`: Task ID

**Request Body**:
```json
{
  "completed": true
}
```

**Response**:
- `200 OK`: Task completion status successfully updated
```json
{
  "id": 1,
  "user_id": "user-uuid",
  "title": "Task title",
  "description": "Task description or null",
  "completed": true,
  "created_at": "2023-12-01T10:00:00Z",
  "updated_at": "2023-12-01T11:00:00Z"
}
```

- `400 Bad Request`: Invalid request body
- `401 Unauthorized`: Invalid or missing JWT token
- `404 Not Found`: Task does not exist or does not belong to user

## Error Responses

All error responses follow the same format:
```json
{
  "detail": "Error message describing the issue"
}
```

### Common Error Codes
- `400 Bad Request`: Invalid request format or validation failure
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Requested resource does not exist
- `500 Internal Server Error`: Server-side error occurred

## Security Requirements

1. **JWT Token Validation**: All endpoints require a valid JWT token in the Authorization header
2. **User Data Isolation**: Users can only access tasks that belong to them (checked via user_id)
3. **Input Validation**: All inputs must be validated according to the data model specifications
4. **Rate Limiting**: Consider implementing rate limiting to prevent abuse