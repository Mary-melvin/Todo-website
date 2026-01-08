# Quickstart Guide: Todo Full-Stack Web Application

**Date**: 2026-01-03
**Feature**: Todo Full-Stack Web Application
**Branch**: 001-todo-fullstack-app

## Overview

This quickstart guide provides instructions for setting up and running the Todo Full-Stack Web Application locally. The application consists of a Next.js frontend and a FastAPI backend with Neon PostgreSQL database.

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Docker and Docker Compose (for local development)
- A Neon PostgreSQL account (for database)

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hackathon-todo
```

### 2. Set up Environment Variables
Create a `.env` file in the root directory:
```env
# Backend
DATABASE_URL="postgresql://username:password@ep-xxxxxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
BETTER_AUTH_SECRET="your-super-secret-jwt-key-here-make-sure-it-is-at-least-32-characters-long"
BETTER_AUTH_URL="http://localhost:3000"

# Frontend
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

**Important**: The `BETTER_AUTH_SECRET` must be the same for both frontend and backend and should be at least 32 characters long.

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`.

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Set up Python Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Development Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`, with API documentation at `http://localhost:8000/docs`.

## Docker Compose Setup (Recommended)

For easier local development, use Docker Compose to run both services:

### 1. From the root directory, run:
```bash
docker-compose up --build
```

This will start both frontend and backend services, with the frontend at `http://localhost:3000` and backend at `http://localhost:8000`.

## Running the Application

1. Start the backend server first
2. Start the frontend server
3. Access the application at `http://localhost:3000`
4. Sign up for a new account or sign in with existing credentials
5. Create, view, update, and delete tasks as needed

## API Testing

To test the API endpoints directly:

1. First authenticate via the frontend to obtain a JWT token
2. Use the token in the Authorization header for API requests
3. Example curl command:
```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
     http://localhost:8000/api/tasks
```

## Database Migrations

When running the backend for the first time, you may need to run database migrations:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -c "from db import create_db_and_tables; create_db_and_tables()"
```

## Development Commands

### Frontend Commands
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

### Backend Commands
```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload

# Run tests
pytest

# Format code
black .
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**: Make sure ports 3000 (frontend) and 8000 (backend) are available
2. **Database Connection**: Verify your Neon PostgreSQL connection string is correct
3. **JWT Authentication**: Ensure `BETTER_AUTH_SECRET` is the same for both frontend and backend
4. **Environment Variables**: Make sure all required environment variables are set

### Resetting the Development Environment

If you encounter issues, you can reset your development environment:

```bash
# Stop all running services
docker-compose down

# Clean up Docker images (optional)
docker system prune -f

# Rebuild and start
docker-compose up --build
```