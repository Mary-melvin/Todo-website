from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import jwt
import os
from dotenv import load_dotenv
from typing import Optional

# Load environment variables
load_dotenv()

# Get secret key from environment
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-default-secret-key-change-in-production")
ALGORITHM = "HS256"

class JWTBearer(BaseHTTPMiddleware):
    """
    JWT Bearer token middleware for FastAPI
    """
    async def dispatch(self, request: Request, call_next):
        # Check if the request is for an excluded path or is an OPTIONS request
        if self.is_excluded_path(request.url.path) or request.method == "OPTIONS":
            response = await call_next(request)
            return response

        # Extract the authorization header
        authorization = request.headers.get("Authorization")
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization code."
            )

        token = authorization.split(" ")[1]

        if not self.verify_jwt(token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token."
            )

        # Add user info to request state for later use
        user_info = self.decode_token(token)
        request.state.user_id = user_info.get('sub', '')

        response = await call_next(request)
        return response

    def verify_jwt(self, jwt_token: str) -> bool:
        """
        Verify the JWT token
        """
        try:
            payload = self.decode_token(jwt_token)
            return payload is not None
        except Exception:
            return False

    def decode_token(self, jwt_token: str) -> Optional[dict]:
        """
        Decode the JWT token
        """
        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired."
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token."
            )

    def is_excluded_path(self, path: str) -> bool:
        """
        Check if the path should be excluded from JWT verification
        """
        excluded_paths = [
            "/",
            "/docs",
            "/redoc",
            "/openapi.json",
            "/health",
            "/favicon.ico",  # Static asset
            "/api/auth/token",  # Allow JWT token retrieval without existing token
            "/api/auth/login",  # Allow login without existing token
            "/api/auth/register",  # Allow registration without existing token
            "/.well-known/jwks.json"  # Allow public key access
        ]

        return path in excluded_paths