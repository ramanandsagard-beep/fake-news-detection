import os
import json
from typing import Dict, Any, List

def get_fake_news_model_info(model_dir: str = 'trained_models') -> List[Dict[str, Any]]:
    models = [
        {"id": "logistic_regression", "name": "Logistic Regression", "description": "Maximum Entropy / Log-odds binary classifier with TF-IDF features."},
        {"id": "decision_tree", "name": "Decision Tree", "description": "Non-linear decision tree classifier with max depth 50."}
    ]
    
    for m in models:
        path = os.path.join(model_dir, f"{m['id']}.joblib")
        m["is_trained"] = os.path.exists(path)
        
    return models

def get_fake_news_evaluations(model_dir: str = 'trained_models') -> Dict[str, Any]:
    eval_path = os.path.join(model_dir, "test_evaluations.json")
    if not os.path.exists(eval_path):
        return {"models": []}
        
    with open(eval_path, "r") as f:
        data = json.load(f)
        
    from app.ml.evaluate import calculate_fake_news_metrics
    actual = data.get("actual", [])
    predictions = data.get("predictions", {})
    
    mapping = {
        "logistic_regression": "Logistic Regression",
        "decision_tree": "Decision Tree"
    }
    
    results = []
    for key, name in mapping.items():
        if key in predictions:
            m = calculate_fake_news_metrics(actual, predictions[key])
            results.append({
                "name": name,
                **m
            })
            
    return {"models": results}

def get_fake_news_confusion_matrix(model_name: str, model_dir: str = 'trained_models'):
    eval_path = os.path.join(model_dir, "test_evaluations.json")
    if not os.path.exists(eval_path):
        return {"model": model_name, "matrix": [[0, 0], [0, 0]], "labels": ["Fake (0)", "Real (1)"], "accuracy": 0.0}
        
    with open(eval_path, "r") as f:
        data = json.load(f)
        
    matrix = data.get("confusion_matrices", {}).get(model_name, [[0, 0], [0, 0]])
    actual = data.get("actual", [])
    preds = data.get("predictions", {}).get(model_name, [])
    
    from sklearn.metrics import accuracy_score
    acc = round(float(accuracy_score(actual, preds)), 4) if actual and preds else 0.0
    
    display_names = {
        "logistic_regression": "Logistic Regression",
        "decision_tree": "Decision Tree"
    }
    
    return {
        "model": display_names.get(model_name, model_name),
        "matrix": matrix,
        "labels": ["Fake (0)", "Real (1)"],
        "accuracy": acc
    }
