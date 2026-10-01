import os
import pandas as pd
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.training_run import TrainingRun
from app.models.model_registry import ModelRegistry
from app.models.dataset import Dataset
from app.ml.train import train_fake_news_models
from app.config import settings

class TrainingService:
    @staticmethod
    async def run_training(
        db: AsyncSession,
        project_type: str = "FAKE_NEWS",
        dataset_id: Optional[str] = None,
        test_size: Optional[float] = None,
        random_state: int = 42
    ) -> List[TrainingRun]:
        dataset = None
        data_path = None
        
        if dataset_id:
            dataset = await db.get(Dataset, dataset_id)
            if dataset:
                data_path = os.path.join(settings.dataset_dir, dataset.file_name)
                
        if not data_path or not os.path.exists(data_path):
            for candidate in [
                os.path.join(settings.dataset_dir, "news_dataset.csv"),
                "data/news_dataset.csv",
                "../data/news_dataset.csv",
                "../../data/news_dataset.csv"
            ]:
                if os.path.exists(candidate):
                    data_path = candidate
                    break
                    
        df = pd.read_csv(data_path)
        training_runs = []
        
        effective_test_size = test_size if test_size is not None else 0.25
        model_dir = settings.model_dir
        results, _, meta = train_fake_news_models(
            df,
            test_size=effective_test_size,
            random_state=random_state,
            model_dir=model_dir
        )
        
        for model_name, res in results.items():
            run = TrainingRun(
                dataset_id=dataset_id,
                project_type="FAKE_NEWS",
                model_name=model_name,
                model_version="v1",
                training_rows=meta["training_rows"],
                testing_rows=meta["testing_rows"],
                metrics=res["metrics"],
                configuration={"test_size": effective_test_size, "random_state": random_state}
            )
            db.add(run)
            training_runs.append(run)
            
            reg = ModelRegistry(
                project_type="FAKE_NEWS",
                model_name=model_name,
                model_version="v1",
                model_file_path=res["path"],
                metrics=res["metrics"],
                configuration={"test_size": effective_test_size, "random_state": random_state},
                is_active=True
            )
            db.add(reg)
                
        await db.commit()
        for r in training_runs:
            await db.refresh(r)
            
        return training_runs

    @staticmethod
    async def get_training_runs(db: AsyncSession, project_type: Optional[str] = None) -> List[TrainingRun]:
        query = select(TrainingRun).order_by(desc(TrainingRun.created_at))
        res = await db.execute(query)
        return list(res.scalars().all())
