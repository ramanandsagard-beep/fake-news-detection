# Standalone Fake News Detection System 📰

A production-grade, end-to-end NLP Machine Learning web application designed for automated Fake News Classification. Built with **FastAPI**, **SQLAlchemy**, **TF-IDF Vectorization**, **Logistic Regression**, **Decision Trees**, **React (Vite)**, and **Recharts**.

---

## 🌟 Key Features

- **NLP Machine Learning Suite**: TF-IDF (10,000 max features, unigram + bigram) with Logistic Regression & Decision Tree Classifiers.
- **Real-Time Classification**: Live confidence percentage, class probabilities (Real vs. Fake), and input audit storage.
- **Visual Analytics & Graphs**: Interactive confusion matrices, class distribution charts, text length histograms, and radar comparison charts.
- **Model Evaluation**: Metrics including Accuracy, Precision, Recall, and F1-Score.
- **Dataset Management & Custom Training**: Upload news CSV datasets and trigger retraining dynamically via API or UI.
- **Audit & History Log**: Real-time persistence of classification runs in SQLite/PostgreSQL.

---

## 📁 Repository Structure

```
fake-news-detection/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── ml/
│   │   │   ├── preprocessing.py
│   │   │   ├── train.py
│   │   │   ├── predict.py
│   │   │   ├── evaluate.py
│   │   │   └── model_registry.py
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   ├── scripts/seed.py
│   ├── tests/test_api.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── data/
│   └── news_dataset.csv
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Setup Backend
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python scripts/seed.py
uvicorn app.main:app --reload --port 8000
```
- API Documentation available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
- Frontend interface running at: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testing Backend

```bash
cd backend
pytest
```
