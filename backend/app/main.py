from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
import app.models  # Ensure models are loaded into Base metadata
from app.routes import health, dashboard, datasets, training, prediction, analysis

app = FastAPI(
    title="Fake News Detection API",
    description="Standalone Production Machine Learning API for Fake News Detection",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(dashboard.router)
app.include_router(datasets.router)
app.include_router(training.router)
app.include_router(prediction.router)
app.include_router(analysis.router)

@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Fake News Detection API",
        "docs": "/docs",
        "health": "/api/health"
    }
