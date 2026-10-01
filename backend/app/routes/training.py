from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.training_service import TrainingService
from app.schemas.training import TrainingRequest, TrainingRunResponse, ModelRegistryResponse
from app.models.model_registry import ModelRegistry
from sqlalchemy import select, desc

router = APIRouter(prefix="/api/training", tags=["Training"])

@router.post("/start", response_model=List[TrainingRunResponse])
async def start_training(req: TrainingRequest, db: AsyncSession = Depends(get_db)):
    try:
        runs = await TrainingService.run_training(
            db=db,
            project_type="FAKE_NEWS",
            dataset_id=req.dataset_id,
            test_size=req.test_size,
            random_state=req.random_state
        )
        return runs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

@router.get("", response_model=List[TrainingRunResponse])
async def list_training_runs(project_type: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    return await TrainingService.get_training_runs(db, project_type=project_type)

@router.get("/models", response_model=List[ModelRegistryResponse])
async def list_registered_models(project_type: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    query = select(ModelRegistry).order_by(desc(ModelRegistry.created_at))
    res = await db.execute(query)
    return list(res.scalars().all())
