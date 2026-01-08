from fastapi import FastAPI, Depends
from db import create_db_and_tables
from routes import tasks, auth
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
from middleware.jwt_middleware import JWTBearer
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    create_db_and_tables()
    yield

# Create FastAPI app with lifespan
app = FastAPI(
    title="Todo API",
    description="A simple todo application API",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, change this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add JWT middleware for protected routes (it will skip excluded paths)
app.add_middleware(JWTBearer)

# Include routers
app.include_router(auth.router, prefix="", tags=["auth"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return {"message": "Favicon not found"}