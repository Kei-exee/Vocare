from sqlalchemy import create_engine

DATABASE_URL = "postgresql://dnoriega:kvrn1001.@localhost:5432/IA"

engine = create_engine(DATABASE_URL)