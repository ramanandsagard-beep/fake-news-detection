import os
import pandas as pd
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.dataset import Dataset
from app.config import settings

class DatasetService:
    @staticmethod
    async def create_dataset_record(
        db: AsyncSession,
        name: str,
        file_name: str,
        project_type: str,
        df: pd.DataFrame,
        target_column: str,
        text_column: Optional[str] = None,
        uploaded_by: Optional[str] = None
    ) -> Dataset:
        dataset = Dataset(
            name=name,
            file_name=file_name,
            project_type="FAKE_NEWS",
            row_count=len(df),
            column_count=len(df.columns),
            target_column=target_column,
            text_column=text_column,
            uploaded_by=uploaded_by,
            status="READY"
        )
        db.add(dataset)
        await db.commit()
        await db.refresh(dataset)
        return dataset

    @staticmethod
    async def get_all_datasets(db: AsyncSession, project_type: Optional[str] = None) -> List[Dataset]:
        query = select(Dataset).order_by(desc(Dataset.created_at))
        res = await db.execute(query)
        return list(res.scalars().all())

    @staticmethod
    async def get_dataset_by_id(db: AsyncSession, dataset_id: str) -> Optional[Dataset]:
        res = await db.execute(select(Dataset).filter(Dataset.id == dataset_id))
        return res.scalar_one_or_none()

    @staticmethod
    def inspect_dataset_file(file_path: str, project_type: str, target_column: str, text_column: Optional[str] = None) -> Dict[str, Any]:
        df = pd.read_csv(file_path)
        num_cols = df.select_dtypes(include=['number']).columns.tolist()
        cat_cols = df.select_dtypes(include=['object', 'category', 'bool']).columns.tolist()
        missing = df.isnull().sum().to_dict()
        
        target_distribution = None
        if target_column in df.columns:
            vc = df[target_column].value_counts().to_dict()
            target_distribution = {str(k): int(v) for k, v in vc.items()}
                
        samples = df.head(10).fillna("").to_dict(orient="records")
        
        return {
            "columns": list(df.columns),
            "numerical_columns": num_cols,
            "categorical_columns": cat_cols,
            "missing_values": missing,
            "target_distribution": target_distribution,
            "sample_rows": samples
        }
