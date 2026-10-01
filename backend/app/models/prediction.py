import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Text, DateTime
from app.database import Base

class FakeNewsPrediction(Base):
    __tablename__ = "fake_news_predictions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True, index=True)
    article_text = Column(Text, nullable=False)
    predicted_class = Column(Integer, nullable=False)
    prediction_label = Column(String(20), nullable=False)
    probability_fake = Column(Float, nullable=False)
    probability_real = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    model_name = Column(String(100), nullable=False, index=True)
    model_version = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
