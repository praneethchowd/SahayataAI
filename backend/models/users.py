from sqlalchemy import Column, Integer, String, Date
from database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    mobile = Column(String, unique=True, index=True)
    dob = Column(Date)
    gender = Column(String)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
