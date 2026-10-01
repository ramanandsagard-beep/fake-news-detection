from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class FakeNewsPredictRequest(BaseModel):
    text: str = Field(..., min_length=5, description="user supplied news article")
    model: str = "logistic_regression"

class FakeNewsPredictResponse(BaseModel):
    prediction_id: str
    prediction: str
    predicted_class: int
    probability_fake: float
    probability_real: float
    confidence: float
    model: str
    model_version: str
    created_at: datetime

class FakeNewsModelMetric(BaseModel):
    name: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float

class FakeNewsEvaluationResponse(BaseModel):
    models: List[FakeNewsModelMetric]

class ConfusionMatrixResponse(BaseModel):
    model: str
    matrix: List[List[int]]
    labels: List[str] = ["Fake (0)", "Real (1)"]
    accuracy: float
