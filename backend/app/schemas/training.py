from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class TrainingRequest(BaseModel):
    project_type: str = "FAKE_NEWS"
    dataset_id: Optional[str] = None
    test_size: Optional[float] = None
    random_state: int = 42

class TrainingRunResponse(BaseModel):
    id: str
    project_type: str
    model_name: str
    model_version: str
    training_rows: int
    testing_rows: int
    metrics: Dict[str, Any]
    configuration: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ModelRegistryResponse(BaseModel):
    id: str
    project_type: str
    model_name: str
    model_version: str
    metrics: Optional[Dict[str, Any]] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
