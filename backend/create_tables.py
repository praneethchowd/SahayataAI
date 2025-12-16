import sys
from sqlalchemy import Column, Integer, String, Text, Date, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load environment
load_dotenv()

# Create Base
Base = declarative_base()

# Define Scheme Model HERE
class Scheme(Base):
    __tablename__ = "schemes"
    
    id = Column(Integer, primary_key=True, index=True)
    scheme_name_en = Column(String, index=True)
    scheme_name_te = Column(String)
    scheme_name_hi = Column(String)
    description_en = Column(Text)
    description_te = Column(Text)
    description_hi = Column(Text)
    eligibility_en = Column(Text)
    eligibility_te = Column(Text)
    eligibility_hi = Column(Text)
    benefits_en = Column(Text)
    benefits_te = Column(Text)
    benefits_hi = Column(Text)
    application_process_en = Column(Text)
    application_process_te = Column(Text)
    application_process_hi = Column(Text)
    official_link = Column(String)
    beneficiary_tags = Column(String)
    scheme_type = Column(String)
    category = Column(String, index=True)

# Define User Model HERE
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    mobile = Column(String, unique=True, index=True)
    dob = Column(Date)
    gender = Column(String)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)

# Create tables
if __name__ == "__main__":
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    if not DATABASE_URL:
        print("❌ Error: DATABASE_URL not found in .env file")
        sys.exit(1)
    
    print(f"🔗 Connecting to: {DATABASE_URL}")
    
    # Create engine
    engine = create_engine(DATABASE_URL, echo=True)
    
    print("\n🚀 Creating tables...")
    
    # Drop all tables first
    Base.metadata.drop_all(bind=engine)
    print("🗑️  Dropped existing tables")
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    print("\n✅ Tables created successfully!")
    print("📊 Tables created: schemes, users")
