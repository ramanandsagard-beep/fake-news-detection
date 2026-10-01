import os
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.config import settings
from app.services.prediction_service import PredictionService
from app.schemas.prediction import (
    FakeNewsPredictRequest,
    FakeNewsPredictResponse,
    FakeNewsEvaluationResponse,
    ConfusionMatrixResponse
)
from app.ml.model_registry import (
    get_fake_news_model_info,
    get_fake_news_evaluations,
    get_fake_news_confusion_matrix
)

router = APIRouter(prefix="/api/fake-news", tags=["Fake News Module"])

@router.get("/models")
async def list_models():
    model_dir = settings.model_dir
    return get_fake_news_model_info(model_dir)

@router.get("/models/evaluation", response_model=FakeNewsEvaluationResponse)
async def get_evaluation():
    model_dir = settings.model_dir
    return get_fake_news_evaluations(model_dir)

@router.get("/models/{model_name}/confusion-matrix", response_model=ConfusionMatrixResponse)
async def get_confusion_matrix(model_name: str):
    model_dir = settings.model_dir
    return get_fake_news_confusion_matrix(model_name, model_dir)

@router.post("/predict", response_model=FakeNewsPredictResponse)
async def predict(req: FakeNewsPredictRequest, db: AsyncSession = Depends(get_db)):
    try:
        record = await PredictionService.predict_fake_news(
            db=db,
            text=req.text,
            model_name=req.model
        )
        return FakeNewsPredictResponse(
            prediction_id=record.id,
            prediction=record.prediction_label,
            predicted_class=record.predicted_class,
            probability_fake=record.probability_fake,
            probability_real=record.probability_real,
            confidence=record.confidence,
            model=record.model_name,
            model_version=record.model_version,
            created_at=record.created_at
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.get("/predictions")
async def get_predictions(limit: int = 50, db: AsyncSession = Depends(get_db)):
    records = await PredictionService.get_fake_news_predictions(db, limit=limit)
    return records
