from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, validator
from datetime import datetime, date
import bcrypt
import re

# We'll import from our create_tables since models don't work
import sys
sys.path.append('..')
from database.connection import get_db
from sqlalchemy import text

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Pydantic models for request/response
class SignupRequest(BaseModel):
    name: str
    mobile: str
    dob: str  # Format: YYYY-MM-DD
    gender: str
    username: str
    password: str
    
    @validator('mobile')
    def validate_mobile(cls, v):
        if not re.match(r'^[6-9]\d{9}$', v):
            raise ValueError('Invalid mobile number. Must be 10 digits starting with 6-9')
        return v
    
    @validator('username')
    def validate_username(cls, v):
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters')
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username can only contain letters, numbers, and underscores')
        return v
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v

class LoginRequest(BaseModel):
    username: str
    password: str

class AuthResponse(BaseModel):
    success: bool
    message: str
    user: dict = None

# Signup endpoint
@router.post("/signup", response_model=AuthResponse)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    try:
        # Check if username already exists
        check_username = db.execute(
            text("SELECT id FROM users WHERE username = :username"),
            {"username": request.username}
        ).fetchone()
        
        if check_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists"
            )
        
        # Check if mobile already exists
        check_mobile = db.execute(
            text("SELECT id FROM users WHERE mobile = :mobile"),
            {"mobile": request.mobile}
        ).fetchone()
        
        if check_mobile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mobile number already registered"
            )
        
        # Hash password
        password_hash = bcrypt.hashpw(request.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Parse date
        dob = datetime.strptime(request.dob, '%Y-%m-%d').date()
        
        # Insert user
        db.execute(
            text("""
                INSERT INTO users (name, mobile, dob, gender, username, password_hash)
                VALUES (:name, :mobile, :dob, :gender, :username, :password_hash)
            """),
            {
                "name": request.name,
                "mobile": request.mobile,
                "dob": dob,
                "gender": request.gender,
                "username": request.username,
                "password_hash": password_hash
            }
        )
        db.commit()
        
        return AuthResponse(
            success=True,
            message="Account created successfully!",
            user={
                "username": request.username,
                "name": request.name,
                "mobile": request.mobile
            }
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating account: {str(e)}"
        )

# Login endpoint
@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    try:
        # Get user by username
        user = db.execute(
            text("""
                SELECT id, name, mobile, username, password_hash
                FROM users
                WHERE username = :username
            """),
            {"username": request.username}
        ).fetchone()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        
        # Verify password
        password_match = bcrypt.checkpw(
            request.password.encode('utf-8'),
            user.password_hash.encode('utf-8')
        )
        
        if not password_match:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        
        return AuthResponse(
            success=True,
            message="Login successful!",
            user={
                "id": user.id,
                "username": user.username,
                "name": user.name,
                "mobile": user.mobile
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during login: {str(e)}"
        )
