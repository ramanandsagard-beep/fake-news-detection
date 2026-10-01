import os
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.prediction import FakeNewsPrediction
from app.ml.predict import predict_fake_news
from app.config import settings

class PredictionService:
    @staticmethod
    async def predict_fake_news(
        db: AsyncSession,
        text: str,
        model_name: str = "logistic_regression",
        user_id: Optional[str] = None
    ) -> FakeNewsPrediction:
        model_dir = settings.model_dir
        result = predict_fake_news(text, model_name=model_name, model_dir=model_dir)
        
        display_names = {
            "logistic_regression": "Logistic Regression",
            "decision_tree": "Decision Tree Classifier"
        }
        
        record = FakeNewsPrediction(
            user_id=user_id,
            article_text=text[:2000],
            predicted_class=result["predicted_class"],
            prediction_label=result["prediction_label"],
            probability_fake=result["probability_fake"],
            probability_real=result["probability_real"],
            confidence=result["confidence"],
            model_name=display_names.get(model_name, model_name),
            model_version="v1"
        )
        db.add(record)
        await db.commit()
        await db.refresh(record)
        return record

    @staticmethod
    async def get_fake_news_predictions(db: AsyncSession, limit: int = 50) -> List[FakeNewsPrediction]:
        res = await db.execute(
            select(FakeNewsPrediction).order_by(desc(FakeNewsPrediction.created_at)).limit(limit)
        )
        return list(res.scalars().all())
