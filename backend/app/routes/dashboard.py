from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from app.database import get_db
from app.models.prediction import FakeNewsPrediction
from app.models.dataset import Dataset
from app.models.training_run import TrainingRun
from app.models.model_registry import ModelRegistry

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary")
async def get_dashboard_summary(db: AsyncSession = Depends(get_db)):
    fn_pred_count = await db.scalar(select(func.count(FakeNewsPrediction.id))) or 0
    training_count = await db.scalar(select(func.count(TrainingRun.id))) or 0
    dataset_count = await db.scalar(select(func.count(Dataset.id))) or 0
    active_models_count = await db.scalar(select(func.count(ModelRegistry.id)).filter(ModelRegistry.is_active == True)) or 0
    
    recent_fn = await db.execute(select(FakeNewsPrediction).order_by(FakeNewsPrediction.created_at.desc()).limit(6))
    
    activity = []
    for f in recent_fn.scalars().all():
        activity.append({
            "id": f.id,
            "project": "Fake News",
            "type": "ANALYSIS",
            "summary": f"Classified article as {f.prediction_label} ({f.confidence*100:.1f}% confidence)",
            "created_at": f.created_at
        })
    
    return {
        "total_predictions": fn_pred_count,
        "fake_news_analyses": fn_pred_count,
        "total_training_runs": training_count,
        "active_models": active_models_count,
        "total_datasets": dataset_count,
        "recent_activity": activity
    }
