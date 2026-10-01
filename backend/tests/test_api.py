import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
import app.models
from app.main import app
from app.database import engine, Base

@pytest_asyncio.fixture(autouse=True)
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/health")
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"
        assert res.json()["service"] == "Fake News Detection API"

@pytest.mark.asyncio
async def test_dashboard_summary():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/dashboard/summary")
        assert res.status_code == 200
        data = res.json()
        assert "total_predictions" in data
        assert "fake_news_analyses" in data

@pytest.mark.asyncio
async def test_fake_news_models():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.get("/api/fake-news/models")
        assert res.status_code == 200
        models = res.json()
        assert len(models) >= 2
