import re
import string
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

def clean_news_text(text: str) -> str:
    if not isinstance(text, str):
        text = str(text) if text is not None else ""
        
    text = text.lower()
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r"\W", " ", text)
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>+', '', text)
    text = re.sub(r'[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub(r'\n', '', text)
    text = re.sub(r'\w*\d\w*', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def build_tfidf_vectorizer(n_samples: int = 1000):
    min_df = 2 if n_samples > 200 else 1
    return TfidfVectorizer(
        max_features=50000,
        ngram_range=(1, 2),
        min_df=min_df,
        max_df=0.95,
        sublinear_tf=True
    )

def validate_fake_news_dataset(df: pd.DataFrame):
    results = {"is_valid": True, "errors": [], "warnings": []}
    
    if 'text' not in df.columns or 'class' not in df.columns:
        results["is_valid"] = False
        results["errors"].append("Dataset must contain a 'text' column and a 'class' target column.")
        return results
        
    unique_classes = set(df['class'].dropna().unique())
    if not unique_classes.issubset({0, 1, '0', '1', 0.0, 1.0}):
        results["is_valid"] = False
        results["errors"].append(f"Target column 'class' must contain binary values (0 = Fake, 1 = Real). Found: {unique_classes}")
        
    if df.shape[0] < 30:
        results["warnings"].append("Dataset has less than 30 rows. Classifier may overfit.")
        
    return results
