import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./fake_news.db"
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    jwt_secret: str = "fake-news-detection-super-secret-jwt-key-32chars"
    frontend_url: str = "http://localhost:5173"
    model_dir: str = "trained_models"
    dataset_dir: str = "data"
    default_fake_news_model: str = "logistic_regression"
    allow_demo_mode: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
