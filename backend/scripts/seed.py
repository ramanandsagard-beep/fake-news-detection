import asyncio
import os
import sys
import pandas as pd

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import engine, Base, AsyncSessionLocal
from app.services.dataset_service import DatasetService
from app.services.training_service import TrainingService
from app.services.prediction_service import PredictionService

async def seed_database():
    print("🌱 Seeding database for Fake News Detection System...")
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with AsyncSessionLocal() as db:
        # Seed Dataset
        dataset_path = None
        for p in ["data/news_dataset.csv", "../data/news_dataset.csv", "../../data/news_dataset.csv"]:
            if os.path.exists(p):
                dataset_path = p
                break
            
        if os.path.exists(dataset_path):
            print(f"Loading news dataset from {dataset_path}...")
            df = pd.read_csv(dataset_path)
            ds = await DatasetService.create_dataset_record(
                db=db,
                name="WELFake News Classification Dataset",
                file_name="news_dataset.csv",
                project_type="FAKE_NEWS",
                df=df,
                target_column="class",
                text_column="text"
            )
            print(f"✅ Created Dataset record: {ds.name} ({ds.row_count} rows)")
            
            print("🚀 Training initial Fake News NLP models...")
            runs = await TrainingService.run_training(
                db=db,
                project_type="FAKE_NEWS",
                dataset_id=ds.id,
                test_size=0.25,
                random_state=42
            )
            print(f"✅ Trained {len(runs)} models successfully.")
            
            print("🔮 Creating sample prediction...")
            sample_article = "The federal reserve announced a reduction in interest rates following quarterly economic evaluation."
            pred = await PredictionService.predict_fake_news(
                db=db,
                text=sample_article,
                model_name="logistic_regression"
            )
            print(f"✅ Sample prediction generated: {pred.prediction_label} ({pred.confidence*100:.1f}% confidence)")
        else:
            print("⚠️ Warning: news_dataset.csv not found for seeding.")

    print("🎉 Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed_database())
