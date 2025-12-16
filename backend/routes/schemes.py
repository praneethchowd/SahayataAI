from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from database.connection import get_db
from sqlalchemy import text

router = APIRouter(prefix="/api/schemes", tags=["Schemes"])

# Response models
class SchemeBasic(BaseModel):
    id: int
    scheme_name_en: str
    scheme_name_te: str
    scheme_name_hi: str
    category: str
    scheme_type: str
    official_link: str

class SchemeDetail(BaseModel):
    id: int
    scheme_name_en: str
    scheme_name_te: str
    scheme_name_hi: str
    description_en: str
    description_te: str
    description_hi: str
    eligibility_en: str
    eligibility_te: str
    eligibility_hi: str
    benefits_en: str
    benefits_te: str
    benefits_hi: str
    application_process_en: str
    application_process_te: str
    application_process_hi: str
    official_link: str
    beneficiary_tags: str
    scheme_type: str
    category: str

class StatisticsResponse(BaseModel):
    total_schemes: int
    ap_schemes: int
    central_schemes: int
    categories: List[dict]

class EligibilityRequest(BaseModel):
    gender: Optional[str] = None
    age: Optional[int] = None
    occupation: Optional[str] = None
    location: Optional[str] = None
    caste: Optional[str] = None
    disability: Optional[bool] = None
    minority: Optional[bool] = None
    annual_income: Optional[int] = None

# Helper function to calculate relevance score
def calculate_relevance(beneficiary_tags: str, criteria: EligibilityRequest) -> int:
    """Calculate how relevant a scheme is to the user's profile"""
    score = 0
    tags_lower = beneficiary_tags.lower()
    
    # Gender match
    if criteria.gender and criteria.gender.lower() in tags_lower:
        score += 20
    
    # Age-based matching
    if criteria.age:
        if criteria.age < 18 and any(word in tags_lower for word in ['child', 'student', 'minor']):
            score += 25
        elif 18 <= criteria.age <= 35 and any(word in tags_lower for word in ['youth', 'young']):
            score += 25
        elif criteria.age >= 60 and any(word in tags_lower for word in ['senior', 'elderly']):
            score += 25
    
    # Occupation match
    if criteria.occupation and criteria.occupation.lower() in tags_lower:
        score += 30
    
    # Location match
    if criteria.location and criteria.location.lower() in tags_lower:
        score += 15
    
    # Category match
    if criteria.caste and criteria.caste.lower() in tags_lower:
        score += 20
    
    # Disability match
    if criteria.disability and any(word in tags_lower for word in ['disability', 'divyang']):
        score += 30
    
    # Minority match
    if criteria.minority and 'minority' in tags_lower:
        score += 30
    
    # Income-based match
    if criteria.annual_income is not None:
        if criteria.annual_income < 100000 and any(word in tags_lower for word in ['bpl', 'poor']):
            score += 25
        elif criteria.annual_income < 300000 and 'ews' in tags_lower:
            score += 25
    
    # Bonus for "All" beneficiaries (universal schemes)
    if 'all' in tags_lower:
        score += 5
    
    return score

# Get statistics
@router.get("/statistics", response_model=StatisticsResponse)
def get_statistics(db: Session = Depends(get_db)):
    try:
        # Total schemes
        total = db.execute(text("SELECT COUNT(*) as count FROM schemes")).fetchone()
        
        # Check for AP schemes
        ap_count = db.execute(
            text("""
                SELECT COUNT(*) as count 
                FROM schemes 
                WHERE scheme_type ILIKE '%Andhra Pradesh%' 
                   OR scheme_type ILIKE '%AP State%'
                   OR scheme_type ILIKE '%State Scheme%'
                   OR scheme_type ILIKE '%State Agency%'
                   OR scheme_type ILIKE '%State Policy%'
                   OR scheme_type ILIKE '%State-Implemented Scheme%'
                   OR scheme_name_en ILIKE '%Andhra Pradesh%'
                   OR scheme_name_en ILIKE '%AP%'
                   OR scheme_name_en ILIKE '%State Scheme%'
                   OR scheme_name_en ILIKE '%State Agency%'
                   OR scheme_name_en ILIKE '%State Policy%'
            """)
        ).fetchone()
        
        # Central schemes
        central_count = total.count - ap_count.count
        
        # Categories with counts
        categories = db.execute(
            text("""
                SELECT category, COUNT(*) as count 
                FROM schemes 
                WHERE category IS NOT NULL AND category != ''
                GROUP BY category 
                ORDER BY count DESC
            """)
        ).fetchall()
        
        categories_list = [
            {"name": cat.category, "count": cat.count}
            for cat in categories
        ]
        
        return StatisticsResponse(
            total_schemes=total.count,
            ap_schemes=ap_count.count,
            central_schemes=central_count,
            categories=categories_list
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching statistics: {str(e)}")

# Search schemes
@router.get("/search")
def search_schemes(
    query: str = Query(..., min_length=2),
    language: str = Query("en", regex="^(en|te|hi)$"),
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db)
):
    try:
        search_term = f"%{query}%"
        
        if language == "en":
            results = db.execute(
                text("""
                    SELECT id, scheme_name_en, scheme_name_te, scheme_name_hi, 
                           category, scheme_type, official_link
                    FROM schemes
                    WHERE scheme_name_en ILIKE :search 
                       OR description_en ILIKE :search
                       OR beneficiary_tags ILIKE :search
                    LIMIT :limit
                """),
                {"search": search_term, "limit": limit}
            ).fetchall()
        elif language == "te":
            results = db.execute(
                text("""
                    SELECT id, scheme_name_en, scheme_name_te, scheme_name_hi, 
                           category, scheme_type, official_link
                    FROM schemes
                    WHERE scheme_name_te ILIKE :search 
                       OR description_te ILIKE :search
                    LIMIT :limit
                """),
                {"search": search_term, "limit": limit}
            ).fetchall()
        else:  # hindi
            results = db.execute(
                text("""
                    SELECT id, scheme_name_en, scheme_name_te, scheme_name_hi, 
                           category, scheme_type, official_link
                    FROM schemes
                    WHERE scheme_name_hi ILIKE :search 
                       OR description_hi ILIKE :search
                    LIMIT :limit
                """),
                {"search": search_term, "limit": limit}
            ).fetchall()
        
        schemes = [
            {
                "id": row.id,
                "scheme_name_en": row.scheme_name_en,
                "scheme_name_te": row.scheme_name_te,
                "scheme_name_hi": row.scheme_name_hi,
                "category": row.category,
                "scheme_type": row.scheme_type,
                "official_link": row.official_link
            }
            for row in results
        ]
        
        return {
            "success": True,
            "count": len(schemes),
            "schemes": schemes
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

# Get schemes by category
@router.get("/category/{category_name}")
def get_by_category(
    category_name: str,
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db)
):
    try:
        results = db.execute(
            text("""
                SELECT id, scheme_name_en, scheme_name_te, scheme_name_hi, 
                       category, scheme_type, official_link
                FROM schemes
                WHERE category ILIKE :category
                LIMIT :limit
            """),
            {"category": f"%{category_name}%", "limit": limit}
        ).fetchall()
        
        schemes = [
            {
                "id": row.id,
                "scheme_name_en": row.scheme_name_en,
                "scheme_name_te": row.scheme_name_te,
                "scheme_name_hi": row.scheme_name_hi,
                "category": row.category,
                "scheme_type": row.scheme_type,
                "official_link": row.official_link
            }
            for row in results
        ]
        
        return {
            "success": True,
            "category": category_name,
            "count": len(schemes),
            "schemes": schemes
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# Get scheme detail by ID
@router.get("/{scheme_id}")
def get_scheme_detail(scheme_id: int, db: Session = Depends(get_db)):
    try:
        result = db.execute(
            text("SELECT * FROM schemes WHERE id = :id"),
            {"id": scheme_id}
        ).fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="Scheme not found")
        
        return {
            "success": True,
            "scheme": {
                "id": result.id,
                "scheme_name_en": result.scheme_name_en,
                "scheme_name_te": result.scheme_name_te,
                "scheme_name_hi": result.scheme_name_hi,
                "description_en": result.description_en,
                "description_te": result.description_te,
                "description_hi": result.description_hi,
                "eligibility_en": result.eligibility_en,
                "eligibility_te": result.eligibility_te,
                "eligibility_hi": result.eligibility_hi,
                "benefits_en": result.benefits_en,
                "benefits_te": result.benefits_te,
                "benefits_hi": result.benefits_hi,
                "application_process_en": result.application_process_en,
                "application_process_te": result.application_process_te,
                "application_process_hi": result.application_process_hi,
                "official_link": result.official_link,
                "beneficiary_tags": result.beneficiary_tags,
                "scheme_type": result.scheme_type,
                "category": result.category
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# Check eligibility
@router.post("/check-eligibility")
def check_eligibility(request: EligibilityRequest, db: Session = Depends(get_db)):
    try:
        # Build intelligent filters based on user profile
        filters = []
        params = {}
        filter_index = 0
        
        # Gender-based filtering
        if request.gender:
            gender_lower = request.gender.lower()
            filters.append(f"(beneficiary_tags ILIKE :filter{filter_index} OR beneficiary_tags ILIKE '%All%')")
            params[f"filter{filter_index}"] = f"%{gender_lower}%"
            filter_index += 1
        
        # Age-based filtering
        if request.age:
            age = request.age
            # Child schemes (0-18)
            if age < 18:
                filters.append(f"(beneficiary_tags ILIKE :filter{filter_index}1 OR beneficiary_tags ILIKE :filter{filter_index}2 OR beneficiary_tags ILIKE :filter{filter_index}3)")
                params[f"filter{filter_index}1"] = "%Child%"
                params[f"filter{filter_index}2"] = "%Student%"
                params[f"filter{filter_index}3"] = "%Minor%"
                filter_index += 1
            # Youth schemes (18-35)
            elif age >= 18 and age <= 35:
                filters.append(f"(beneficiary_tags ILIKE :filter{filter_index}1 OR beneficiary_tags ILIKE :filter{filter_index}2)")
                params[f"filter{filter_index}1"] = "%Youth%"
                params[f"filter{filter_index}2"] = "%Young%"
                filter_index += 1
            # Senior citizen schemes (60+)
            elif age >= 60:
                filters.append(f"(beneficiary_tags ILIKE :filter{filter_index}1 OR beneficiary_tags ILIKE :filter{filter_index}2)")
                params[f"filter{filter_index}1"] = "%Senior%"
                params[f"filter{filter_index}2"] = "%Elderly%"
                filter_index += 1
        
        # Occupation-based filtering
        if request.occupation and request.occupation != "Other":
            occupation_lower = request.occupation.lower()
            filters.append(f"beneficiary_tags ILIKE :filter{filter_index}")
            params[f"filter{filter_index}"] = f"%{occupation_lower}%"
            filter_index += 1
        
        # Location-based filtering
        if request.location:
            location_lower = request.location.lower()
            filters.append(f"(beneficiary_tags ILIKE :filter{filter_index} OR beneficiary_tags ILIKE '%All%')")
            params[f"filter{filter_index}"] = f"%{location_lower}%"
            filter_index += 1
        
        # Caste/Category-based filtering
        if request.caste and request.caste != "General":
            caste_lower = request.caste
            filters.append(f"(beneficiary_tags ILIKE :filter{filter_index}1 OR beneficiary_tags ILIKE :filter{filter_index}2)")
            params[f"filter{filter_index}1"] = f"%{caste_lower}%"
            params[f"filter{filter_index}2"] = "%Backward%"
            filter_index += 1
        
        # Disability-based filtering
        if request.disability:
            filters.append(f"(beneficiary_tags ILIKE :filter{filter_index}1 OR beneficiary_tags ILIKE :filter{filter_index}2)")
            params[f"filter{filter_index}1"] = "%Disability%"
            params[f"filter{filter_index}2"] = "%Divyang%"
            filter_index += 1
        
        # Minority-based filtering
        if request.minority:
            filters.append(f"beneficiary_tags ILIKE :filter{filter_index}")
            params[f"filter{filter_index}"] = "%Minority%"
            filter_index += 1
        
        # Income-based filtering
        if request.annual_income is not None:
            if request.annual_income < 100000:
                filters.append(f"(beneficiary_tags ILIKE :filter{filter_index}1 OR beneficiary_tags ILIKE :filter{filter_index}2)")
                params[f"filter{filter_index}1"] = "%BPL%"
                params[f"filter{filter_index}2"] = "%Poor%"
                filter_index += 1
            elif request.annual_income < 300000:
                filters.append(f"beneficiary_tags ILIKE :filter{filter_index}")
                params[f"filter{filter_index}"] = "%EWS%"
                filter_index += 1
        
        # If no specific filters, return schemes for "All" beneficiaries
        if not filters:
            query = text("""
                SELECT id, scheme_name_en, scheme_name_te, scheme_name_hi,
                       category, scheme_type, official_link, beneficiary_tags
                FROM schemes
                WHERE beneficiary_tags ILIKE '%All%'
                LIMIT 50
            """)
            results = db.execute(query).fetchall()
        else:
            # Use AND logic for more precise matching
            conditions = " AND ".join([f"({f})" for f in filters])
            query_str = f"""
                SELECT id, scheme_name_en, scheme_name_te, scheme_name_hi,
                       category, scheme_type, official_link, beneficiary_tags
                FROM schemes
                WHERE {conditions}
                ORDER BY id
                LIMIT 50
            """
            results = db.execute(text(query_str), params).fetchall()
            
            # If no results with AND, try OR for broader matches
            if len(results) == 0:
                conditions = " OR ".join([f"({f})" for f in filters])
                query_str = f"""
                    SELECT id, scheme_name_en, scheme_name_te, scheme_name_hi,
                           category, scheme_type, official_link, beneficiary_tags
                    FROM schemes
                    WHERE {conditions}
                    ORDER BY id
                    LIMIT 50
                """
                results = db.execute(text(query_str), params).fetchall()
        
        schemes = [
            {
                "id": row.id,
                "scheme_name_en": row.scheme_name_en,
                "scheme_name_te": row.scheme_name_te,
                "scheme_name_hi": row.scheme_name_hi,
                "category": row.category,
                "scheme_type": row.scheme_type,
                "official_link": row.official_link,
                "beneficiary_tags": row.beneficiary_tags,
                "relevance_score": calculate_relevance(row.beneficiary_tags, request)
            }
            for row in results
        ]
        
        # Sort by relevance score (highest first)
        schemes.sort(key=lambda x: x["relevance_score"], reverse=True)
        
        return {
            "success": True,
            "count": len(schemes),
            "eligible_schemes": schemes[:20]  # Return top 20 most relevant
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
