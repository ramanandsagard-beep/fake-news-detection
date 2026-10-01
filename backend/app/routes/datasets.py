import os
import shutil
import pandas as pd
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.config import settings
from app.services.dataset_service import DatasetService
from app.schemas.dataset import DatasetUploadResponse, DatasetDetailResponse
from app.ml.preprocessing import validate_fake_news_dataset

router = APIRouter(prefix="/api/datasets", tags=["Datasets"])

@router.get("", response_model=List[DatasetUploadResponse])
async def list_datasets(project_type: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    return await DatasetService.get_all_datasets(db, project_type=project_type)

@router.post("/upload", response_model=DatasetUploadResponse)
async def upload_dataset(
    file: UploadFile = File(...),
    name: str = Form(...),
    project_type: str = Form("FAKE_NEWS"),
    target_column: Optional[str] = Form(None),
    text_column: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
        
    os.makedirs(settings.dataset_dir, exist_ok=True)
    file_path = os.path.join(settings.dataset_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        df = pd.read_csv(file_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")
        
    val = validate_fake_news_dataset(df)
    if not val["is_valid"]:
        raise HTTPException(status_code=422, detail=val["errors"][0])

    record = await DatasetService.create_dataset_record(
        db=db,
        name=name,
        file_name=file.filename,
        project_type="FAKE_NEWS",
        df=df,
        target_column="class",
        text_column="text"
    )
    return record

@router.get("/{id}", response_model=DatasetDetailResponse)
async def get_dataset(id: str, db: AsyncSession = Depends(get_db)):
    record = await DatasetService.get_dataset_by_id(db, id)
    if not record:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    file_path = os.path.join(settings.dataset_dir, record.file_name)
    if not os.path.exists(file_path):
        file_path = os.path.join("data", record.file_name)
        
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Dataset CSV file '{record.file_name}' not found on disk")
        
    inspection = DatasetService.inspect_dataset_file(
        file_path=file_path,
        project_type="FAKE_NEWS",
        target_column=record.target_column,
        text_column=record.text_column
    )
    
    return DatasetDetailResponse(
        id=record.id,
        name=record.name,
        file_name=record.file_name,
        project_type=record.project_type,
        row_count=record.row_count,
        column_count=record.column_count,
        target_column=record.target_column,
        text_column=record.text_column,
        created_at=record.created_at,
        **inspection
    )
