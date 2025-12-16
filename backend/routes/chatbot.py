from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.connection import get_db
from sqlalchemy import text
from typing import List, Dict, Set
import re

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])

class ChatRequest(BaseModel):
    message: str
    language: str = "en"

class ChatResponse(BaseModel):
    response: str
    schemes: list = []
    language: str

# ============================================================================
# COMPREHENSIVE KEYWORD MAPPING
# ============================================================================

INTENT_KEYWORDS = {
    "en": {
        "education": ["education", "student", "school", "college", "scholarship", "study", "exam", "degree", "university", "learning", "academic"],
        "agriculture": ["agriculture", "farmer", "farming", "crop", "kisan", "agricultural", "harvest", "cultivation", "irrigation", "land"],
        "women": ["women", "woman", "girl", "mother", "pregnant", "maternity", "female", "mahila", "widow", "self help"],
        "health": ["health", "medical", "hospital", "doctor", "medicine", "treatment", "disease", "insurance", "ayushman", "clinic"],
        "pension": ["pension", "senior citizen", "old age", "elderly", "retirement", "aged"],
        "employment": ["employment", "job", "work", "skill", "training", "rozgar", "unemployment", "wage", "labor"],
        "housing": ["housing", "house", "home", "shelter", "awas", "construction", "flat", "apartment"],
        "financial": ["loan", "credit", "bank", "finance", "subsidy", "grant", "money", "fund"],
    },
    "te": {
        "education": ["విద్య", "విద్యార్థి", "స్కూలు", "కళాశాల", "స్కాలర్‌షిప్", "చదువు", "పరీక్ష", "డిగ్రీ"],
        "agriculture": ["వ్యవసాయం", "రైతు", "పంట", "సాగు", "భూమి", "నీటిపారుదల"],
        "women": ["మహిళ", "స్త్రీ", "అమ్మాయి", "తల్లి", "గర్భిణి", "విధవ"],
        "health": ["ఆరోగ్యం", "వైద్యం", "ఆసుపత్రి", "డాక్టర్", "మందులు", "చికిత్స", "బీమా"],
        "pension": ["పెన్షన్", "వృద్ధులు", "వృద్ధాప్యం"],
        "employment": ["ఉద్యోగం", "ఉపాధి", "పని", "నైపుణ్యం", "శిక్షణ"],
        "housing": ["గృహం", "ఇల్లు", "నివాసం", "ఆవాసం", "నిర్మాణం"],
        "financial": ["రుణం", "బ్యాంకు", "సబ్సిడీ", "డబ్బు", "నిధి"],
    },
    "hi": {
        "education": ["शिक्षा", "छात्र", "स्कूल", "कॉलेज", "छात्रवृत्ति", "पढ़ाई", "परीक्षा"],
        "agriculture": ["कृषि", "किसान", "खेती", "फसल", "जमीन", "सिंचाई"],
        "women": ["महिला", "स्त्री", "लड़की", "मां", "गर्भवती", "विधवा"],
        "health": ["स्वास्थ्य", "चिकित्सा", "अस्पताल", "डॉक्टर", "दवा", "बीमा"],
        "pension": ["पेंशन", "वरिष्ठ नागरिक", "वृद्धावस्था"],
        "employment": ["रोजगार", "नौकरी", "काम", "कौशल", "प्रशिक्षण"],
        "housing": ["आवास", "घर", "मकान", "निर्माण"],
        "financial": ["ऋण", "बैंक", "सब्सिडी", "पैसा", "निधि"],
    }
}

# ============================================================================
# KEYWORD EXTRACTION
# ============================================================================

def extract_query_keywords(query: str, language: str) -> Set[str]:
    """Extract relevant keywords from user query"""
    query_lower = query.lower()
    matched_keywords = set()
    
    lang_keywords = INTENT_KEYWORDS.get(language, INTENT_KEYWORDS["en"])
    
    for category, keywords in lang_keywords.items():
        for keyword in keywords:
            if keyword in query_lower:
                matched_keywords.add(keyword)
                # Add category-level boost
                matched_keywords.add(category)
    
    return matched_keywords

# ============================================================================
# ENHANCED DATABASE SEARCH WITH FUZZY MATCHING
# ============================================================================

def search_database(query: str, language: str, db: Session, limit: int = 10) -> List[Dict]:
    """Enhanced search with fuzzy matching and keyword extraction"""
    try:
        # Extract keywords
        keywords = extract_query_keywords(query, language)
        
        # Column names
        name_col = f"scheme_name_{language}"
        desc_col = f"description_{language}"
        elig_col = f"eligibility_{language}"
        benefits_col = f"benefits_{language}"
        apply_col = f"application_process_{language}"
        
        # Clean and prepare search patterns
        query_clean = query.strip().lower()
        like_pattern = f"%{query_clean}%"
        
        # Build dynamic WHERE clause based on extracted keywords
        keyword_conditions = []
        if keywords:
            for kw in keywords:
                keyword_conditions.append(f"LOWER(beneficiary_tags) LIKE '%{kw}%'")
                keyword_conditions.append(f"LOWER(category) LIKE '%{kw}%'")
        
        keyword_clause = " OR ".join(keyword_conditions) if keyword_conditions else "1=0"
        
        sql_query = f"""
            SELECT 
                id,
                {name_col} as scheme_name,
                {desc_col} as description,
                {elig_col} as eligibility,
                {benefits_col} as benefits,
                {apply_col} as application_process,
                scheme_type,
                category,
                official_link,
                beneficiary_tags,
                -- ADVANCED RELEVANCE SCORING
                (
                    -- Exact name match (highest priority)
                    CASE WHEN LOWER({name_col}) LIKE :pattern THEN 100 ELSE 0 END +
                    
                    -- Category match (very high priority)
                    CASE WHEN LOWER(category) LIKE :pattern THEN 90 ELSE 0 END +
                    
                    -- Beneficiary tags match (high priority)
                    CASE WHEN LOWER(beneficiary_tags) LIKE :pattern THEN 80 ELSE 0 END +
                    
                    -- Scheme type match
                    CASE WHEN LOWER(scheme_type) LIKE :pattern THEN 70 ELSE 0 END +
                    
                    -- Description match (medium priority)
                    CASE WHEN LOWER({desc_col}) LIKE :pattern THEN 60 ELSE 0 END +
                    
                    -- Eligibility match
                    CASE WHEN LOWER({elig_col}) LIKE :pattern THEN 40 ELSE 0 END +
                    
                    -- Benefits match
                    CASE WHEN LOWER({benefits_col}) LIKE :pattern THEN 30 ELSE 0 END +
                    
                    -- Application process match
                    CASE WHEN LOWER({apply_col}) LIKE :pattern THEN 20 ELSE 0 END +
                    
                    -- Keyword-based bonus (if keywords extracted)
                    CASE WHEN ({keyword_clause}) THEN 50 ELSE 0 END
                ) as score
            FROM schemes
            WHERE 
                LOWER({name_col}) LIKE :pattern
                OR LOWER({desc_col}) LIKE :pattern
                OR LOWER({elig_col}) LIKE :pattern
                OR LOWER({benefits_col}) LIKE :pattern
                OR LOWER({apply_col}) LIKE :pattern
                OR LOWER(scheme_type) LIKE :pattern
                OR LOWER(category) LIKE :pattern
                OR LOWER(beneficiary_tags) LIKE :pattern
                OR ({keyword_clause})
            ORDER BY score DESC, id ASC 
            LIMIT :limit
        """
        
        result = db.execute(text(sql_query), {"pattern": like_pattern, "limit": limit})
        
        schemes = []
        for row in result:
            desc = row.description or ""
            # Truncate description smartly
            truncated_desc = desc[:180] + "..." if len(desc) > 180 else desc
            
            schemes.append({
                "id": row.id,
                "scheme_name": row.scheme_name or "N/A",
                "description": truncated_desc,
                "eligibility": row.eligibility or "",
                "benefits": row.benefits or "",
                "application_process": row.application_process or "",
                "scheme_type": row.scheme_type or "",
                "category": row.category or "",
                "official_link": row.official_link or "",
                "beneficiary_tags": row.beneficiary_tags or "",
                "score": row.score
            })
        
        print(f"✅ FOUND {len(schemes)} schemes for '{query}' in {language}")
        if schemes:
            print(f"   Top: {schemes[0]['scheme_name']} (Score: {schemes[0]['score']})")
        if keywords:
            print(f"   Extracted keywords: {keywords}")
        
        return schemes
        
    except Exception as e:
        print(f"❌ Search error: {e}")
        import traceback
        traceback.print_exc()
        return []

# ============================================================================
# SMART RESPONSE GENERATOR
# ============================================================================

def generate_response(query: str, schemes: List[Dict], language: str) -> str:
    """Generate smart responses with suggestions"""
    
    if not schemes:
        # NO RESULTS - Provide helpful suggestions
        suggestions = {
            "en": {
                "text": "❌ No schemes found for your query.\n\n💡 **Try these suggestions:**",
                "options": [
                    "\n🎓 Education: 'student scholarship' or 'education'",
                    "🌾 Agriculture: 'farmer loan' or 'agriculture'",
                    "👩 Women: 'women scheme' or 'mahila'",
                    "🏥 Health: 'health insurance' or 'medical'",
                    "💰 Pension: 'pension' or 'senior citizen'",
                    "🏠 Housing: 'housing' or 'awas'",
                    "💼 Employment: 'employment' or 'job training'",
                    "\n🔍 **Or click the category buttons above!**"
                ]
            },
            "te": {
                "text": "❌ మీ ప్రశ్నకు పథకాలు కనుగొనబడలేదు.\n\n💡 **ఈ సూచనలను ప్రయత్నించండి:**",
                "options": [
                    "\n🎓 విద్య: 'విద్యార్థి స్కాలర్‌షిప్' లేదా 'విద్య'",
                    "🌾 వ్యవసాయం: 'రైతు రుణం' లేదా 'వ్యవసాయం'",
                    "👩 మహిళలు: 'మహిళ పథకం' లేదా 'మహిళ'",
                    "🏥 ఆరోగ్యం: 'ఆరోగ్య బీమా' లేదా 'ఆరోగ్యం'",
                    "💰 పెన్షన్: 'పెన్షన్' లేదా 'వృద్ధులు'",
                    "🏠 గృహాలు: 'గృహం' లేదా 'ఇల్లు'",
                    "💼 ఉద్యోగం: 'ఉద్యోగం' లేదా 'పని శిక్షణ'",
                    "\n🔍 **లేదా పైన ఉన్న వర్గం బటన్లను క్లిక్ చేయండి!**"
                ]
            },
            "hi": {
                "text": "❌ आपकी क्वेरी के लिए कोई योजना नहीं मिली.\n\n💡 **ये सुझाव आज़माएं:**",
                "options": [
                    "\n🎓 शिक्षा: 'छात्र छात्रवृत्ति' या 'शिक्षा'",
                    "🌾 कृषि: 'किसान ऋण' या 'कृषि'",
                    "👩 महिला: 'महिला योजना' या 'महिला'",
                    "🏥 स्वास्थ्य: 'स्वास्थ्य बीमा' या 'स्वास्थ्य'",
                    "💰 पेंशन: 'पेंशन' या 'वरिष्ठ नागरिक'",
                    "🏠 आवास: 'आवास' या 'घर'",
                    "💼 रोजगार: 'रोजगार' या 'नौकरी प्रशिक्षण'",
                    "\n🔍 **या ऊपर श्रेणी बटन पर क्लिक करें!**"
                ]
            }
        }
        
        sug = suggestions.get(language, suggestions["en"])
        return sug["text"] + "".join(sug["options"])
    
    # FOUND SCHEMES - Format results
    top = schemes[0]
    count = len(schemes)
    
    if language == "en":
        resp = f"✅ Found {count} relevant scheme(s)!\n\n"
        resp += f"**🎯 {top['scheme_name']}**\n"
        if top['category']:
            resp += f"📂 Category: {top['category']}\n"
        if top['scheme_type']:
            resp += f"🏷️ Type: {top['scheme_type']}\n"
        resp += f"\n{top['description'][:160]}...\n"
        
        if count > 1:
            resp += f"\n➕ **More schemes found:**"
            for i, scheme in enumerate(schemes[1:min(3, count)], 2):
                resp += f"\n{i}. {scheme['scheme_name']}"
        
        resp += "\n\n👇 **Click any scheme below for full details!**"
    
    elif language == "te":
        resp = f"✅ {count} సంబంధిత పథకం(లు) దొరికాయి!\n\n"
        resp += f"**🎯 {top['scheme_name']}**\n"
        if top['category']:
            resp += f"📂 వర్గం: {top['category']}\n"
        if top['scheme_type']:
            resp += f"🏷️ రకం: {top['scheme_type']}\n"
        resp += f"\n{top['description'][:160]}...\n"
        
        if count > 1:
            resp += f"\n➕ **మరిన్ని పథకాలు:**"
            for i, scheme in enumerate(schemes[1:min(3, count)], 2):
                resp += f"\n{i}. {scheme['scheme_name']}"
        
        resp += "\n\n👇 **పూర్తి వివరాల కోసం క్రింద ఏదైనా పథకాన్ని క్లిక్ చేయండి!**"
    
    elif language == "hi":
        resp = f"✅ {count} प्रासंगिक योजना मिली!\n\n"
        resp += f"**🎯 {top['scheme_name']}**\n"
        if top['category']:
            resp += f"📂 श्रेणी: {top['category']}\n"
        if top['scheme_type']:
            resp += f"🏷️ प्रकार: {top['scheme_type']}\n"
        resp += f"\n{top['description'][:160]}...\n"
        
        if count > 1:
            resp += f"\n➕ **और योजनाएं:**"
            for i, scheme in enumerate(schemes[1:min(3, count)], 2):
                resp += f"\n{i}. {scheme['scheme_name']}"
        
        resp += "\n\n👇 **पूर्ण विवरण के लिए नीचे किसी भी योजना पर क्लिक करें!**"
    
    return resp

# ============================================================================
# MAIN CHAT ENDPOINT
# ============================================================================

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    """Main chatbot endpoint with enhanced search"""
    try:
        lang = request.language if request.language in ["en", "te", "hi"] else "en"
        
        # Search database
        schemes = search_database(request.message, lang, db, limit=10)
        
        # Generate smart response
        response = generate_response(request.message, schemes, lang)
        
        return ChatResponse(
            response=response,
            schemes=schemes[:3],  # Return top 3 schemes
            language=lang
        )
        
    except Exception as e:
        print(f"❌ Chat error: {e}")
        import traceback
        traceback.print_exc()
        
        error_messages = {
            "en": "⚠️ An error occurred. Please try again or use the category buttons above.",
            "te": "⚠️ లోపం సంభవించింది. దయచేసి మళ్లీ ప్రయత్నించండి లేదా పైన ఉన్న వర్గం బటన్లను ఉపయోగించండి.",
            "hi": "⚠️ एक त्रुटि हुई। कृपया पुनः प्रयास करें या ऊपर श्रेणी बटन का उपयोग करें।"
        }
        
        return ChatResponse(
            response=error_messages.get(request.language, error_messages["en"]),
            schemes=[],
            language=request.language
        )

@router.get("/health")
def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "sahayataaifinal",
        "features": [
            "multi_field_search",
            "keyword_extraction",
            "relevance_scoring",
            "fuzzy_matching",
            "smart_suggestions"
        ]
    }
