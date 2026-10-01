import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, JSON
from app.database import Base

class TrainingRun(Base):
    __tablename__ = "training_runs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    dataset_id = Column(String(36), nullable=True, index=True)
    project_type = Column(String(50), default="FAKE_NEWS", index=True)
    model_name = Column(String(100), nullable=False, index=True)
    model_version = Column(String(50), nullable=False)
    training_rows = Column(Integer, nullable=False)
    testing_rows = Column(Integer, nullable=False)
    metrics = Column(JSON, nullable=False)
    configuration = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
