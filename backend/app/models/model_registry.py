import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, JSON
from app.database import Base

class ModelRegistry(Base):
    __tablename__ = "model_registry"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_type = Column(String(50), default="FAKE_NEWS", index=True)
    model_name = Column(String(100), nullable=False, index=True)
    model_version = Column(String(50), nullable=False)
    model_file_path = Column(String(500), nullable=False)
    metrics = Column(JSON, nullable=True)
    configuration = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
