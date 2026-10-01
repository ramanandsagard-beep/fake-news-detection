import os
import json
import math
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, Query
import pandas as pd
import numpy as np
from app.config import settings

router = APIRouter(prefix="/api/analysis", tags=["Analysis & Graphs"])

def _fn_dataset_path() -> str:
    candidates = [
        os.path.abspath(os.path.join(settings.dataset_dir, "news_dataset.csv")),
        os.path.abspath("../data/news_dataset.csv"),
        os.path.abspath("../../data/news_dataset.csv"),
        os.path.abspath("data/news_dataset.csv"),
        os.path.abspath("c:/Users/SAGAR/Downloads/ml project/data/news_dataset.csv"),
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    return candidates[0]

def _safe_val(v):
    if isinstance(v, (float, np.floating)):
        if math.isnan(v) or math.isinf(v):
            return None
        return round(float(v), 4)
    if isinstance(v, (np.integer,)):
        return int(v)
    return v

@router.get("/fake-news/dataset-overview")
async def fn_dataset_overview():
    path = _fn_dataset_path()
    if not os.path.exists(path):
        raise HTTPException(404, "news_dataset.csv not found")
    df = pd.read_csv(path)
    class_dist = df["class"].value_counts().to_dict() if "class" in df.columns else {}
    text_lengths = df["text"].dropna().str.len() if "text" in df.columns else pd.Series([])
    return {
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": list(df.columns),
        "class_distribution": {str(k): int(v) for k, v in class_dist.items()},
        "text_length_stats": {
            "mean": _safe_val(text_lengths.mean()) if len(text_lengths) else 0,
            "median": _safe_val(float(text_lengths.median())) if len(text_lengths) else 0,
            "min": int(text_lengths.min()) if len(text_lengths) else 0,
            "max": int(text_lengths.max()) if len(text_lengths) else 0,
        },
        "missing_values": {c: int(df[c].isnull().sum()) for c in df.columns if df[c].isnull().sum() > 0},
    }

@router.get("/fake-news/text-length-distribution")
async def fn_text_length_distribution(bins: int = Query(20, ge=5, le=50)):
    path = _fn_dataset_path()
    if not os.path.exists(path):
        raise HTTPException(404, "news_dataset.csv not found")
    df = pd.read_csv(path)
    lengths = df["text"].dropna().str.len()
    cap = int(lengths.quantile(0.99))
    lengths = lengths.clip(upper=cap)
    counts, edges = np.histogram(lengths, bins=bins)
    histogram = []
    for i in range(len(counts)):
        histogram.append({
            "range": f"{int(edges[i])}-{int(edges[i+1])}",
            "rangeMin": int(edges[i]),
            "rangeMax": int(edges[i+1]),
            "count": int(counts[i]),
        })
    per_class = {}
    if "class" in df.columns:
        for cls_val in sorted(df["class"].dropna().unique()):
            cls_lengths = df[df["class"] == cls_val]["text"].dropna().str.len().clip(upper=cap)
            c_counts, c_edges = np.histogram(cls_lengths, bins=edges)
            per_class[str(int(cls_val))] = [int(c) for c in c_counts]
    return {"histogram": histogram, "per_class": per_class}

@router.get("/fake-news/class-distribution")
async def fn_class_distribution():
    path = _fn_dataset_path()
    if not os.path.exists(path):
        raise HTTPException(404, "news_dataset.csv not found")
    df = pd.read_csv(path)
    if "class" not in df.columns:
        raise HTTPException(400, "'class' column missing")
    dist = df["class"].value_counts().sort_index()
    return {
        "distribution": [
            {"label": "Fake (0)", "value": int(dist.get(0, 0))},
            {"label": "Real (1)", "value": int(dist.get(1, 0))},
        ],
        "total": int(len(df)),
    }

@router.get("/fake-news/all-confusion-matrices")
async def fn_all_confusion_matrices():
    eval_path = os.path.join(settings.model_dir, "test_evaluations.json")
    if not os.path.exists(eval_path):
        raise HTTPException(404, "No test evaluations found.")
    with open(eval_path) as f:
        data = json.load(f)
    mapping = {"logistic_regression": "Logistic Regression", "decision_tree": "Decision Tree"}
    matrices = {}
    for key, name in mapping.items():
        cm = data.get("confusion_matrices", {}).get(key, [[0, 0], [0, 0]])
        matrices[name] = cm
    return {"matrices": matrices}

@router.get("/fake-news/model-comparison")
async def fn_model_comparison():
    eval_path = os.path.join(settings.model_dir, "test_evaluations.json")
    if not os.path.exists(eval_path):
        return {"models": [], "radar": []}
    with open(eval_path) as f:
        data = json.load(f)
    from app.ml.evaluate import calculate_fake_news_metrics
    actual = data.get("actual", [])
    predictions = data.get("predictions", {})
    mapping = {"logistic_regression": "Logistic Regression", "decision_tree": "Decision Tree"}
    raw = []
    for key, name in mapping.items():
        preds = predictions.get(key, [])
        if preds:
            m = calculate_fake_news_metrics(actual, preds)
            m["name"] = name
            m["id"] = key
            raw.append(m)
    radar = []
    for r in raw:
        radar.append({
            "name": r["name"],
            "Accuracy": _safe_val(r["accuracy"]),
            "Precision": _safe_val(r["precision"]),
            "Recall": _safe_val(r["recall"]),
            "F1 Score": _safe_val(r["f1_score"]),
        })
    return {"models": raw, "radar": radar}

@router.get("/summary")
async def analysis_summary():
    fn_eval_path = os.path.join(settings.model_dir, "test_evaluations.json")
    fn_dataset = _fn_dataset_path()

    summary: Dict[str, Any] = {"fake_news": {}}

    if os.path.exists(fn_dataset):
        df = pd.read_csv(fn_dataset)
        summary["fake_news"]["dataset_rows"] = len(df)
        summary["fake_news"]["dataset_cols"] = len(df.columns)
    if os.path.exists(fn_eval_path):
        with open(fn_eval_path) as f:
            data = json.load(f)
        from app.ml.evaluate import calculate_fake_news_metrics
        actual = data.get("actual", [])
        best_acc = -1
        best_model = ""
        for key, preds in data.get("predictions", {}).items():
            m = calculate_fake_news_metrics(actual, preds)
            if m["accuracy"] > best_acc:
                best_acc = m["accuracy"]
                best_model = key
        summary["fake_news"]["best_model"] = best_model
        summary["fake_news"]["best_accuracy"] = _safe_val(best_acc)
        summary["fake_news"]["models_trained"] = len(data.get("predictions", {}))

    return summary
