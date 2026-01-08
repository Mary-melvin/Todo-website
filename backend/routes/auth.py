from fastapi import APIRouter, Request, HTTPException, status, Depends
from sqlmodel import Session, select
from db import get_db_session
from models import User
import uuid
from auth import create_access_token, verify_password, hash_password

router = APIRouter()

@router.get("/api/auth/token")
async def get_jwt_token(request: Request):
    """
    Endpoint for frontend to get a JWT token after successful Better Auth session.
    This endpoint should be called after the user has been authenticated via Better Auth cookies.
    For this implementation, we'll check for a mock session header to simulate Better Auth validation.
    """
    # In a real Better Auth integration, we would verify the Better Auth session cookie
    # For this demo, we'll check for a mock header that would represent a validated session
    better_auth_session = request.headers.get("better-auth-session")

    if not better_auth_session:
        # In a real implementation, this would mean the user doesn't have a valid Better Auth session
        # and shouldn't be able to get an API JWT token
        raise HTTPException(status_code=401, detail="No valid Better Auth session found")

    # Extract user ID from the session (in a real implementation, Better Auth would provide this)
    # For demo purposes, we'll extract it from the mock header
    user_id = better_auth_session  # In real implementation, this would be parsed from the session

    # Create a new JWT token for API access
    jwt_token = create_access_token(data={"sub": user_id})

    return {"jwt": jwt_token}

@router.post("/api/auth/login")
async def login_user(
    request: Request,
    session: Session = Depends(get_db_session)
):
    """
    Login endpoint that authenticates user and returns a JWT token
    """
    try:
        # Get email and password from request body
        body = await request.json()
        email = body.get('email')
        password = body.get('password')

        if not email or not password:
            raise HTTPException(status_code=400, detail="Email and password are required")

        # Check if user exists
        existing_user = session.exec(select(User).where(User.email == email)).first()

        if not existing_user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Verify password
        if not verify_password(password, existing_user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Create and return JWT token
        jwt_token = create_access_token(data={"sub": existing_user.id, "email": existing_user.email})
        return {"jwt": jwt_token}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


@router.post("/api/auth/register")
async def register_user(
    request: Request,
    session: Session = Depends(get_db_session)
):
    """
    Register endpoint that creates a user and returns a JWT token
    """
    try:
        # Get user details from request body
        body = await request.json()
        name = body.get('name')
        email = body.get('email')
        password = body.get('password')

        if not email or not name or not password:
            raise HTTPException(status_code=400, detail="Name, email, and password are required")

        # Check if user already exists
        existing_user = session.exec(select(User).where(User.email == email)).first()

        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")

        # Hash the password before storing
        hashed_password = hash_password(password)

        # Create new user
        new_user = User(
            email=email,
            name=name,
            password=hashed_password,
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        # Create and return JWT token
        jwt_token = create_access_token(data={"sub": new_user.id, "email": new_user.email})
        return {"jwt": jwt_token}

    except Exception as e:
        import traceback
        error_msg = f"Registration failed: {str(e)}, Details: {traceback.format_exc()}"
        print(error_msg)  # Log the full error for debugging
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@router.get("/.well-known/jwks.json")
async def get_jwks():
    """
    Endpoint to expose public keys for JWT verification
    This is a simplified version - in production, you'd want to properly manage public/private keys
    """
    # This is a placeholder - in a real implementation, you'd return the actual JWKS
    # For symmetric keys (HS256), this might just be documentation
    return {
        "keys": [
            {
                "kty": "oct",  # Octet sequence (used for symmetric keys like HS256)
                "use": "sig",  # Signature
                "kid": "default",  # Key ID
                "k": "TODO_ACTUAL_KEY_WILL_BE_HERE"  # This would be the actual key in production
            }
        ]
    }