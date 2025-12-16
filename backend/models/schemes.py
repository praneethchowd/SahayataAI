from sqlalchemy import Column, Integer, String, Text
from database.connection import Base

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
    beneficiary_tags = Column(String)  # Stored as comma-separated
    scheme_type = Column(String)  # AP/Central
    category = Column(String, index=True)  # ← MAKE SURE THIS LINE EXISTS