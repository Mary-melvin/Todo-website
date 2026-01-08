from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel import Session, select
from db import get_db_session
from models import Task, User, TaskCreate, TaskUpdate, TaskResponse
from middleware.jwt_middleware import JWTBearer
from typing import List, Optional

router = APIRouter()

# Apply JWT middleware to all routes in this router
# This will require the middleware to be applied in main.py
# and the routes to be under the /api prefix

@router.get("/tasks/analytics")
async def get_task_analytics(
    request: Request,
    session: Session = Depends(get_db_session)
):
    """
    Get task analytics for the authenticated user
    """
    if not hasattr(request.state, 'user_id') or not request.state.user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_id = request.state.user_id

    # Get all tasks for the user
    all_tasks_statement = select(Task).where(Task.user_id == user_id)
    all_tasks = session.exec(all_tasks_statement).all()

    total_tasks = len(all_tasks)
    completed_tasks = sum(1 for task in all_tasks if task.completed)
    pending_tasks = total_tasks - completed_tasks

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "completion_rate": total_tasks > 0 and round(completed_tasks / total_tasks * 100, 2) or 0
    }


@router.get("/tasks", response_model=List[TaskResponse])
async def get_tasks(
    request: Request,
    status_filter: Optional[str] = None,
    sort: Optional[str] = None,
    session: Session = Depends(get_db_session)
):
    """
    Get all tasks for the authenticated user
    """
    # The JWT middleware has already verified the token and added user_id to request.state
    if not hasattr(request.state, 'user_id') or not request.state.user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_id = request.state.user_id

    # Query tasks for the authenticated user
    statement = select(Task).where(Task.user_id == user_id)

    # Apply status filter if provided
    if status_filter and status_filter != 'all':
        if status_filter == 'completed':
            statement = statement.where(Task.completed == True)
        elif status_filter == 'pending':
            statement = statement.where(Task.completed == False)

    # Apply sorting if provided
    if sort == 'title':
        statement = statement.order_by(Task.title)
    elif sort == 'created':
        statement = statement.order_by(Task.created_at.desc())
    else:
        # Default sort by creation date, newest first
        statement = statement.order_by(Task.created_at.desc())

    tasks = session.exec(statement).all()
    return tasks


@router.post("/tasks", response_model=TaskResponse)
async def create_task(
    request: Request,
    task_data: TaskCreate,
    session: Session = Depends(get_db_session)
):
    """
    Create a new task for the authenticated user
    """
    if not hasattr(request.state, 'user_id') or not request.state.user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_id = request.state.user_id

    # Create new task
    new_task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        completed=False  # New tasks are not completed by default
    )

    session.add(new_task)
    session.commit()
    session.refresh(new_task)

    return new_task


@router.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(
    request: Request,
    task_id: int,
    session: Session = Depends(get_db_session)
):
    """
    Get a specific task for the authenticated user
    """
    if not hasattr(request.state, 'user_id') or not request.state.user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_id = request.state.user_id

    # Get the task and ensure it belongs to the authenticated user
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to access this task")

    return task


@router.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    request: Request,
    task_id: int,
    task_data: TaskUpdate,
    session: Session = Depends(get_db_session)
):
    """
    Update a specific task for the authenticated user
    """
    if not hasattr(request.state, 'user_id') or not request.state.user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_id = request.state.user_id

    # Get the task and ensure it belongs to the authenticated user
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")

    # Update task fields if provided
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.completed is not None:
        task.completed = task_data.completed

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.delete("/tasks/{task_id}")
async def delete_task(
    request: Request,
    task_id: int,
    session: Session = Depends(get_db_session)
):
    """
    Delete a specific task for the authenticated user
    """
    if not hasattr(request.state, 'user_id') or not request.state.user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_id = request.state.user_id

    # Get the task and ensure it belongs to the authenticated user
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this task")

    session.delete(task)
    session.commit()

    return {"message": "Task deleted successfully"}


from pydantic import BaseModel

class TaskCompletionUpdate(BaseModel):
    completed: bool

@router.patch("/tasks/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_completion(
    request: Request,
    task_id: int,
    completion_update: TaskCompletionUpdate,
    session: Session = Depends(get_db_session)
):
    """
    Toggle completion status of a specific task for the authenticated user
    """
    if not hasattr(request.state, 'user_id') or not request.state.user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_id = request.state.user_id

    # Get the task and ensure it belongs to the authenticated user
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this task")

    # Update completion status
    task.completed = completion_update.completed

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.get("/tasks/analytics")
async def get_task_analytics(
    request: Request,
    session: Session = Depends(get_db_session)
):
    """
    Get task analytics for the authenticated user
    """
    if not hasattr(request.state, 'user_id') or not request.state.user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_id = request.state.user_id

    # Get all tasks for the user
    all_tasks_statement = select(Task).where(Task.user_id == user_id)
    all_tasks = session.exec(all_tasks_statement).all()

    total_tasks = len(all_tasks)
    completed_tasks = sum(1 for task in all_tasks if task.completed)
    pending_tasks = total_tasks - completed_tasks

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "completion_rate": total_tasks > 0 and round(completed_tasks / total_tasks * 100, 2) or 0
    }