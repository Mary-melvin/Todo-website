from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime, timezone
import uuid

if TYPE_CHECKING:
    pass


class User(SQLModel, table=True):
    """
    User model representing a registered user in the system.
    This model is managed by Better Auth, but we define it here for reference.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, nullable=False)
    name: str = Field(nullable=False)
    password: str = Field(max_length=255, nullable=False)  # Hashed password (increased limit for bcrypt)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationship to tasks
    tasks: list["Task"] = Relationship(back_populates="user")


class Task(SQLModel, table=True):
    """
    Task model representing a todo item created by a user.
    """
    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(nullable=False, foreign_key="user.id")  # Foreign key to User
    title: str = Field(nullable=False, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationship to user
    user: Optional["User"] = Relationship()


class TaskCreate(SQLModel):
    """Schema for creating a new task"""
    title: str
    description: Optional[str] = None


class TaskUpdate(SQLModel):
    """Schema for updating an existing task"""
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TaskResponse(SQLModel):
    """Schema for task response"""
    id: int
    user_id: str
    title: str
    description: Optional[str] = None
    completed: bool
    created_at: datetime
    updated_at: datetime