import os
import joblib
from typing import Dict, Any
from app.ml.preprocessing import clean_news_text

_loaded_fn_models = {}
_fn_model_mtimes = {}

def get_fake_news_pipeline(model_name: str = 'logistic_regression', model_dir: str = 'trained_models'):
    if not os.path.isabs(model_dir):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        abs_model_dir = os.path.join(base_dir, model_dir)
        if os.path.exists(abs_model_dir):
            model_dir = abs_model_dir

    model_path = os.path.join(model_dir, f"{model_name}.joblib")
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file '{model_name}.joblib' not found in {model_dir}. Please train models first.")

    mtime = os.path.getmtime(model_path)
    model_key = f"fn_{model_name}_{model_dir}"
    
    if model_key in _loaded_fn_models and _fn_model_mtimes.get(model_key) == mtime:
        return _loaded_fn_models[model_key]
        
    pipeline = joblib.load(model_path)
    _loaded_fn_models[model_key] = pipeline
    _fn_model_mtimes[model_key] = mtime
    return pipeline

def predict_fake_news(text: str, model_name: str = 'logistic_regression', model_dir: str = 'trained_models') -> Dict[str, Any]:
    if not os.path.isabs(model_dir):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        abs_model_dir = os.path.join(base_dir, model_dir)
        if os.path.exists(abs_model_dir):
            model_dir = abs_model_dir

    pipeline = get_fake_news_pipeline(model_name, model_dir)
    cleaned = clean_news_text(text)
    
    pred_class = int(pipeline.predict([cleaned])[0])
    
    if hasattr(pipeline, "predict_proba"):
        probs = pipeline.predict_proba([cleaned])[0]
        prob_fake = float(probs[0])
        prob_real = float(probs[1])
    else:
        prob_fake = 1.0 if pred_class == 0 else 0.0
        prob_real = 1.0 if pred_class == 1 else 0.0
        
    confidence = max(prob_fake, prob_real)
    label = "REAL" if pred_class == 1 else "FAKE"
    
    return {
        "predicted_class": pred_class,
        "prediction_label": label,
        "probability_fake": round(prob_fake, 4),
        "probability_real": round(prob_real, 4),
        "confidence": round(confidence, 4)
    }
