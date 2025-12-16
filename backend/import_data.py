import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load environment
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def extract_category(beneficiary_tags):
    """Extract category from beneficiary tags"""
    tags = str(beneficiary_tags).lower()
    
    if 'farmer' in tags or 'agriculture' in tags or 'rural' in tags:
        return 'Agriculture, Rural & Environment'
    elif 'education' in tags or 'student' in tags or 'learning' in tags:
        return 'Education & Learning'
    elif 'women' in tags or 'child' in tags:
        return 'Women and Child'
    elif 'health' in tags or 'medical' in tags:
        return 'Health & Wellness'
    elif 'employment' in tags or 'skill' in tags or 'job' in tags:
        return 'Skills & Employment'
    elif 'entrepreneur' in tags or 'business' in tags:
        return 'Business & Entrepreneurship'
    elif 'housing' in tags or 'shelter' in tags:
        return 'Housing & Shelter'
    elif 'bank' in tags or 'insurance' in tags or 'financial' in tags:
        return 'Banking, Financial Services and Insurance'
    elif 'transport' in tags:
        return 'Transport & Infrastructure'
    else:
        return 'Social welfare & Empowerment'

def import_schemes():
    print("🚀 Starting CSV import...")
    
    # Read CSV
    try:
        df = pd.read_csv('SahayataDatasetFinal.csv')
        print(f"✅ CSV loaded: {len(df)} schemes found\n")
    except FileNotFoundError:
        print("❌ Error: SahayataDatasetFinal.csv not found!")
        return
    
    # Connect to database
    engine = create_engine(DATABASE_URL, echo=False)
    
    # Prepare data for bulk insert
    schemes_data = []
    
    for index, row in df.iterrows():
        category = extract_category(row.get('Beneficiary Tags', ''))
        
        scheme_dict = {
            'scheme_name_en': str(row.get('Scheme Name (EN)', '')).strip(),
            'scheme_name_te': str(row.get('Scheme Name (TE)', '')).strip(),
            'scheme_name_hi': str(row.get('Scheme Name (HI)', '')).strip(),
            'description_en': str(row.get('Description (EN)', '')).strip(),
            'description_te': str(row.get('Description (TE)', '')).strip(),
            'description_hi': str(row.get('Description (HI)', '')).strip(),
            'eligibility_en': str(row.get('Eligibility (EN)', '')).strip(),
            'eligibility_te': str(row.get('Eligibility (TE)', '')).strip(),
            'eligibility_hi': str(row.get('Eligibility (HI)', '')).strip(),
            'benefits_en': str(row.get('Benefits (EN)', '')).strip(),
            'benefits_te': str(row.get('Benefits (TE)', '')).strip(),
            'benefits_hi': str(row.get('Benefits (HI)', '')).strip(),
            'application_process_en': str(row.get('Application Process (EN)', '')).strip(),
            'application_process_te': str(row.get('Application Process (TE)', '')).strip(),
            'application_process_hi': str(row.get('Application Process (HI)', '')).strip(),
            'official_link': str(row.get('Official Link', '')).strip(),
            'beneficiary_tags': str(row.get('Beneficiary Tags', '')).strip(),
            'scheme_type': str(row.get('Scheme Type', '')).strip(),
            'category': category
        }
        
        schemes_data.append(scheme_dict)
        
        if (index + 1) % 20 == 0:
            print(f"📊 Processed {index + 1} schemes...")
    
    # Bulk insert using pandas
    df_final = pd.DataFrame(schemes_data)
    df_final.to_sql('schemes', engine, if_exists='append', index=False)
    
    print(f"\n✅ Import completed!")
    print(f"📈 Total schemes imported: {len(schemes_data)}")
    print(f"🎯 Database: sahayataaifinal")

if __name__ == "__main__":
    import_schemes()
