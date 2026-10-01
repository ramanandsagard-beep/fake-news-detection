from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class DatasetUploadResponse(BaseModel):
    id: str
    name: str
    file_name: str
    project_type: str = "FAKE_NEWS"
    row_count: int
    column_count: int
    target_column: str
    text_column: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DatasetDetailResponse(DatasetUploadResponse):
    columns: List[str]
    numerical_columns: List[str]
    categorical_columns: List[str]
    missing_values: Dict[str, int]
    target_distribution: Optional[Dict[str, Any]] = None
    sample_rows: List[Dict[str, Any]]
