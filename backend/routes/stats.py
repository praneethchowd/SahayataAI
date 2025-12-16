from fastapi import APIRouter
from sqlalchemy import func
from database.connection import SessionLocal
from database.models import Scheme

router = APIRouter()

@router.get("/api/chatbot/stats")
async def get_stats():
    """Get scheme statistics"""
    db = SessionLocal()
    try:
        total = db.query(Scheme).count()
        # You can add AP/Central filtering if you have a column for it
        return {
            "total": total,
            "ap": 24,  # Update with actual query
            "central": 76  # Update with actual query
        }
    finally:
        db.close()
