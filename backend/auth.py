from typing import Optional
import jwt
import hashlib
import os
from fastapi import HTTPException, status, Request
from datetime import datetime, timedelta
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get secret key from environment
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-default-secret-key-change-in-production")
ALGORITHM = "HS256"

class TokenData(BaseModel):
    """Token data model"""
    user_id: str
    email: str
    exp: Optional[int] = None

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create access token with given data and expiration
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)  # Default 15 minutes

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> TokenData:
    """
    Verify and decode token, returning token data
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        exp: int = payload.get("exp")

        if user_id is None or email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )

        # Check if token is expired
        if exp and datetime.utcnow().timestamp() > exp:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )

        return TokenData(user_id=user_id, email=email, exp=exp)
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

def get_current_user(request: Request) -> TokenData:
    """
    Get current user from request token
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing or invalid"
        )

    token = auth_header.split(" ")[1]  # Extract token after "Bearer "
    return verify_token(token)


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt
    """
    import bcrypt
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password
    """
    import bcrypt
    pwd_bytes = plain_password.encode('utf-8')
    hashed_pwd_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hashed_pwd_bytes)