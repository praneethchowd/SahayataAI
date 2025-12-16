from database.connection import engine, Base
from models.schemes import Scheme
from models.users import User

# Create all tables
def create_tables():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")

if __name__ == "__main__":
    create_tables()
