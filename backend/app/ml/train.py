import os
import json
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.pipeline import Pipeline

from app.ml.preprocessing import clean_news_text, build_tfidf_vectorizer
from app.ml.evaluate import calculate_fake_news_metrics, calculate_confusion_matrix

def train_fake_news_models(df: pd.DataFrame, test_size=0.25, random_state=42, model_dir='trained_models'):
    df = df.copy()
    df['clean_text'] = df['text'].fillna("").apply(clean_news_text)
    
    X = df['clean_text']
    y = df['class'].astype(int)
    
    stratify = y if len(y.unique()) > 1 else None
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=stratify
    )
    
    models = {
        'logistic_regression': LogisticRegression(max_iter=2000, random_state=random_state),
        'decision_tree': DecisionTreeClassifier(max_depth=50, random_state=random_state)
    }
    
    results = {}
    os.makedirs(model_dir, exist_ok=True)
    
    test_evaluations = {"actual": y_test.tolist(), "predictions": {}, "confusion_matrices": {}}
    
    for name, classifier in models.items():
        pipeline = Pipeline([
            ('tfidf', build_tfidf_vectorizer(n_samples=len(X_train))),
            ('classifier', classifier)
        ])
        
        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)
        
        metrics = calculate_fake_news_metrics(y_test, y_pred)
        cm = calculate_confusion_matrix(y_test, y_pred)
        
        model_path = os.path.join(model_dir, f"{name}.joblib")
        joblib.dump(pipeline, model_path)
        
        results[name] = {
            "metrics": metrics,
            "confusion_matrix": cm,
            "path": model_path
        }
        
        test_evaluations["predictions"][name] = [int(p) for p in y_pred]
        test_evaluations["confusion_matrices"][name] = cm
        
    with open(os.path.join(model_dir, "test_evaluations.json"), "w") as f:
        json.dump(test_evaluations, f)
        
    metadata = {
        "training_rows": len(X_train),
        "testing_rows": len(X_test),
        "split_ratio": f"{int((1 - test_size) * 100)}/{int(test_size * 100)}",
        "random_state": random_state
    }
    with open(os.path.join(model_dir, "metadata.json"), "w") as f:
        json.dump(metadata, f)
        
    return results, test_evaluations, metadata
