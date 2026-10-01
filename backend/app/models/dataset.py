import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime
from app.database import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    file_name = Column(String(255), nullable=False)
    project_type = Column(String(50), default="FAKE_NEWS", index=True)
    row_count = Column(Integer, nullable=False)
    column_count = Column(Integer, nullable=False)
    target_column = Column(String(100), nullable=False)
    text_column = Column(String(100), nullable=True)
    uploaded_by = Column(String(36), nullable=True, index=True)
    status = Column(String(50), default="READY")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
