from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chatbot
from database.connection import test_connection
import os

app = FastAPI(
    title="SahayataAI API",
    description="Multilingual Government Schemes Chatbot API",
    version="1.0.0"
)

# CORS - Allow frontend domains
origins = [
    "http://localhost:5173",  # Local dev
    "http://localhost:3000",
    "https://*.vercel.app",   # Vercel preview/production
    "https://sahayataai.vercel.app",  # Your production domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chatbot.router)

@app.on_event("startup")
async def startup_event():
    """Test database connection on startup"""
    test_connection()

@app.get("/")
def root():
    return {
        "message": "SahayataAI API is running",
        "status": "healthy",
        "version": "1.0.0",
        "endpoints": [
            "/api/chatbot/chat",
            "/api/chatbot/health",
            "/docs"
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}
